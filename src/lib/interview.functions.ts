import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { requireAuth } from "@/integrations/mongo/auth-middleware";
import { groqChat, type ChatMessage } from "./groq.server";
import { buildInterviewerSystemPrompt, buildEvaluatorPrompt } from "./interview-prompts";

const TopicSchema = z.string().min(1).max(60);
const DifficultySchema = z.enum(["Easy", "Medium", "Hard"]);
const ObjectIdSchema = z.string().regex(/^[a-f0-9]{24}$/i, "Invalid id");

function toSessionDTO(s: any) {
  return {
    id: s._id.toHexString(),
    user_id: s.user_id,
    topic: s.topic,
    difficulty: s.difficulty,
    status: s.status,
    max_questions: s.max_questions,
    total_questions: s.total_questions ?? 0,
    overall_score: s.overall_score ?? null,
    started_at: (s.started_at instanceof Date ? s.started_at : new Date(s.started_at)).toISOString(),
    ended_at: s.ended_at ? (s.ended_at instanceof Date ? s.ended_at : new Date(s.ended_at)).toISOString() : null,
  };
}

function toPairDTO(p: any) {
  return {
    id: p._id.toHexString(),
    session_id: p.session_id,
    user_id: p.user_id,
    question_index: p.question_index,
    question: p.question,
    user_answer: p.user_answer ?? null,
    score: p.score ?? null,
    verdict: p.verdict ?? null,
    feedback: p.feedback ?? null,
    ideal_answer_summary: p.ideal_answer_summary ?? null,
    keywords_matched: p.keywords_matched ?? [],
    keywords_missed: p.keywords_missed ?? [],
    improvement_tip: p.improvement_tip ?? null,
    time_taken_seconds: p.time_taken_seconds ?? null,
    created_at: p.created_at ? (p.created_at instanceof Date ? p.created_at : new Date(p.created_at)).toISOString() : null,
  };
}

async function rebuildHistory(db: any, sessionId: string, system: string): Promise<ChatMessage[]> {
  const pairs = await db.collection("qa_pairs")
    .find({ session_id: sessionId })
    .sort({ question_index: 1 })
    .toArray();
  const history: ChatMessage[] = [{ role: "system", content: system }];
  for (const p of pairs) {
    history.push({ role: "assistant", content: p.question });
    if (p.user_answer) history.push({ role: "user", content: p.user_answer });
  }
  return history;
}

export const startSession = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input) =>
    z.object({
      topic: TopicSchema,
      difficulty: DifficultySchema,
      maxQuestions: z.number().int().min(3).max(10).default(5),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { db, userId } = context;
    const { topic, difficulty, maxQuestions } = data;

    const insert = await db.collection("interview_sessions").insertOne({
      user_id: userId,
      topic, difficulty,
      status: "active",
      max_questions: maxQuestions,
      total_questions: 0,
      overall_score: null,
      started_at: new Date(),
      ended_at: null,
    });
    const sessionId = insert.insertedId.toHexString();

    const system = buildInterviewerSystemPrompt(topic, difficulty, maxQuestions);
    const firstQuestion = await groqChat(
      [{ role: "system", content: system }, { role: "user", content: "Begin the interview now." }],
      { temperature: 0.8 },
    );

    await db.collection("qa_pairs").insertOne({
      session_id: sessionId,
      user_id: userId,
      question_index: 0,
      question: firstQuestion,
      user_answer: null,
      created_at: new Date(),
    });

    return { sessionId, firstQuestion, maxQuestions };
  });

export const submitAnswer = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input) =>
    z.object({
      sessionId: ObjectIdSchema,
      answer: z.string().min(1).max(5000),
      timeTaken: z.number().int().min(0).max(3600).default(0),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { db, userId } = context;
    const { sessionId, answer, timeTaken } = data;

    const session = await db.collection("interview_sessions").findOne({
      _id: new ObjectId(sessionId),
      user_id: userId,
    });
    if (!session) throw new Error("Session not found");
    if (session.status !== "active") throw new Error("Session already completed");

    const openQ = await db.collection("qa_pairs").findOne(
      { session_id: sessionId, user_answer: null },
      { sort: { question_index: -1 } },
    );
    if (!openQ) throw new Error("No open question to answer");

    let evaluation: any;
    try {
      const raw = await groqChat(
        [{ role: "system", content: "You output strict JSON only." },
         { role: "user", content: buildEvaluatorPrompt(session.topic, session.difficulty, openQ.question, answer) }],
        { jsonMode: true, temperature: 0.2 },
      );
      evaluation = JSON.parse(raw);
    } catch {
      evaluation = {
        score: 5, verdict: "Partial",
        feedback: "Evaluator unavailable. Default partial score assigned.",
        ideal_answer_summary: "", keywords_matched: [], keywords_missed: [],
        improvement_tip: "Try again later.",
      };
    }
    const score = Math.max(0, Math.min(10, Number(evaluation.score) || 0));

    await db.collection("qa_pairs").updateOne(
      { _id: openQ._id },
      {
        $set: {
          user_answer: answer,
          score,
          verdict: String(evaluation.verdict ?? "Partial").slice(0, 30),
          feedback: String(evaluation.feedback ?? "").slice(0, 1000),
          ideal_answer_summary: String(evaluation.ideal_answer_summary ?? "").slice(0, 1000),
          keywords_matched: Array.isArray(evaluation.keywords_matched) ? evaluation.keywords_matched.slice(0, 10).map(String) : [],
          keywords_missed: Array.isArray(evaluation.keywords_missed) ? evaluation.keywords_missed.slice(0, 10).map(String) : [],
          improvement_tip: String(evaluation.improvement_tip ?? "").slice(0, 500),
          time_taken_seconds: timeTaken,
        },
      },
    );

    const askedSoFar = openQ.question_index + 1;
    const isComplete = askedSoFar >= session.max_questions;

    let nextQuestion: string | null = null;
    if (!isComplete) {
      const system = buildInterviewerSystemPrompt(session.topic, session.difficulty, session.max_questions);
      const history = await rebuildHistory(db, sessionId, system);
      const reply = await groqChat(history, { temperature: 0.8 });
      if (!reply.includes("INTERVIEW_COMPLETE")) {
        nextQuestion = reply;
        await db.collection("qa_pairs").insertOne({
          session_id: sessionId,
          user_id: userId,
          question_index: askedSoFar,
          question: nextQuestion,
          user_answer: null,
          created_at: new Date(),
        });
      }
    }

    let summary: any = null;
    if (isComplete || nextQuestion === null) {
      const allPairs = await db.collection("qa_pairs")
        .find({ session_id: sessionId, user_answer: { $ne: null } })
        .sort({ question_index: 1 })
        .toArray();
      const scores = allPairs.map((p: any) => Number(p.score) || 0);
      const overall = scores.length ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 10) / 10 : 0;
      await db.collection("interview_sessions").updateOne(
        { _id: new ObjectId(sessionId) },
        { $set: { status: "completed", ended_at: new Date(), overall_score: overall, total_questions: scores.length } },
      );
      summary = {
        overall_score: overall,
        total_questions: scores.length,
        breakdown: allPairs.map((p: any, i: number) => ({ index: i + 1, score: p.score, verdict: p.verdict })),
      };
    }

    return {
      evaluation: {
        score,
        verdict: evaluation.verdict,
        feedback: evaluation.feedback,
        ideal_answer_summary: evaluation.ideal_answer_summary,
        keywords_matched: evaluation.keywords_matched ?? [],
        keywords_missed: evaluation.keywords_missed ?? [],
        improvement_tip: evaluation.improvement_tip,
      },
      nextQuestion,
      isComplete: isComplete || nextQuestion === null,
      summary,
    };
  });

export const listHistory = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(async ({ context }) => {
    const { db, userId } = context;
    const sessions = await db.collection("interview_sessions")
      .find({ user_id: userId })
      .sort({ started_at: -1 })
      .limit(100)
      .toArray();
    return { sessions: sessions.map(toSessionDTO) };
  });

export const getSessionDetail = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input) => z.object({ sessionId: ObjectIdSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const { db, userId } = context;
    const session = await db.collection("interview_sessions").findOne({
      _id: new ObjectId(data.sessionId),
      user_id: userId,
    });
    if (!session) throw new Error("Session not found");
    const pairs = await db.collection("qa_pairs")
      .find({ session_id: data.sessionId })
      .sort({ question_index: 1 })
      .toArray();
    return { session: toSessionDTO(session), pairs: pairs.map(toPairDTO) };
  });

export const deleteSession = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input) => z.object({ sessionId: ObjectIdSchema }).parse(input))
  .handler(async ({ data, context }) => {
    const { db, userId } = context;
    const sessionId = data.sessionId;

    const session = await db.collection("interview_sessions").findOne({ _id: new ObjectId(sessionId), user_id: userId });
    if (!session) throw new Error("Session not found");

    await db.collection("interview_sessions").deleteOne({ _id: new ObjectId(sessionId), user_id: userId });
    await db.collection("qa_pairs").deleteMany({ session_id: sessionId, user_id: userId });

    return { success: true };
  });
