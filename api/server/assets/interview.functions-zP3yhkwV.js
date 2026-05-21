import { c as createServerRpc } from "./createServerRpc-CENBlW2Y.js";
import { s as stringType, e as enumType, r as requireAuth, o as objectType, n as numberType, l as libExports } from "./auth-middleware-BuPT9MPp.js";
import { b as buildEvaluatorPrompt, a as buildInterviewerSystemPrompt } from "./interview-prompts-CtMgmc30.js";
import { a0 as createServerFn } from "./server-Pe6FDPZq.js";
import "node:fs";
import "node:path";
import "node:url";
import "timers/promises";
import "timers";
import "fs";
import "http";
import "./worker-entry-CVE5LoHb.js";
import "node:events";
import "stream";
import "events";
import "util";
import "dns";
import "url";
import "zlib";
import "net";
import "fs/promises";
import "tls";
import "buffer";
import "crypto";
import "./createMiddleware-BvN2ghIY.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";
async function groqChat(messages, opts) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured. Add it in Cloud secrets.");
  const body = {
    model: opts?.model ?? DEFAULT_MODEL,
    messages,
    temperature: opts?.temperature ?? 0.7
  };
  if (opts?.jsonMode) body.response_format = { type: "json_object" };
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Groq API ${res.status}: ${text || res.statusText}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");
  return content;
}
const TopicSchema = stringType().min(1).max(60);
const DifficultySchema = enumType(["Easy", "Medium", "Hard"]);
const ObjectIdSchema = stringType().regex(/^[a-f0-9]{24}$/i, "Invalid id");
function toSessionDTO(s) {
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
    ended_at: s.ended_at ? (s.ended_at instanceof Date ? s.ended_at : new Date(s.ended_at)).toISOString() : null
  };
}
function toPairDTO(p) {
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
    created_at: p.created_at ? (p.created_at instanceof Date ? p.created_at : new Date(p.created_at)).toISOString() : null
  };
}
async function rebuildHistory(db, sessionId, system) {
  const pairs = await db.collection("qa_pairs").find({
    session_id: sessionId
  }).sort({
    question_index: 1
  }).toArray();
  const history = [{
    role: "system",
    content: system
  }];
  for (const p of pairs) {
    history.push({
      role: "assistant",
      content: p.question
    });
    if (p.user_answer) history.push({
      role: "user",
      content: p.user_answer
    });
  }
  return history;
}
const startSession_createServerFn_handler = createServerRpc({
  id: "95625e14c815851be0f806a42bc4c51ee2ec02ae6ffcf4fe5e5942905f04aa9d",
  name: "startSession",
  filename: "src/lib/interview.functions.ts"
}, (opts) => startSession.__executeServer(opts));
const startSession = createServerFn({
  method: "POST"
}).middleware([requireAuth]).inputValidator((input) => objectType({
  topic: TopicSchema,
  difficulty: DifficultySchema,
  maxQuestions: numberType().int().min(3).max(10).default(5)
}).parse(input)).handler(startSession_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    db,
    userId
  } = context;
  const {
    topic,
    difficulty,
    maxQuestions
  } = data;
  const insert = await db.collection("interview_sessions").insertOne({
    user_id: userId,
    topic,
    difficulty,
    status: "active",
    max_questions: maxQuestions,
    total_questions: 0,
    overall_score: null,
    started_at: /* @__PURE__ */ new Date(),
    ended_at: null
  });
  const sessionId = insert.insertedId.toHexString();
  const system = buildInterviewerSystemPrompt(topic, difficulty, maxQuestions);
  const firstQuestion = await groqChat([{
    role: "system",
    content: system
  }, {
    role: "user",
    content: "Begin the interview now."
  }], {
    temperature: 0.8
  });
  await db.collection("qa_pairs").insertOne({
    session_id: sessionId,
    user_id: userId,
    question_index: 0,
    question: firstQuestion,
    user_answer: null,
    created_at: /* @__PURE__ */ new Date()
  });
  return {
    sessionId,
    firstQuestion,
    maxQuestions
  };
});
const submitAnswer_createServerFn_handler = createServerRpc({
  id: "8ab63f8c7ad7b6c5cbc1638767c518a46b72f5229345c810410a97461fc27e10",
  name: "submitAnswer",
  filename: "src/lib/interview.functions.ts"
}, (opts) => submitAnswer.__executeServer(opts));
const submitAnswer = createServerFn({
  method: "POST"
}).middleware([requireAuth]).inputValidator((input) => objectType({
  sessionId: ObjectIdSchema,
  answer: stringType().min(1).max(5e3),
  timeTaken: numberType().int().min(0).max(3600).default(0)
}).parse(input)).handler(submitAnswer_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    db,
    userId
  } = context;
  const {
    sessionId,
    answer,
    timeTaken
  } = data;
  const session = await db.collection("interview_sessions").findOne({
    _id: new libExports.ObjectId(sessionId),
    user_id: userId
  });
  if (!session) throw new Error("Session not found");
  if (session.status !== "active") throw new Error("Session already completed");
  const openQ = await db.collection("qa_pairs").findOne({
    session_id: sessionId,
    user_answer: null
  }, {
    sort: {
      question_index: -1
    }
  });
  if (!openQ) throw new Error("No open question to answer");
  let evaluation;
  try {
    const raw = await groqChat([{
      role: "system",
      content: "You output strict JSON only."
    }, {
      role: "user",
      content: buildEvaluatorPrompt(session.topic, session.difficulty, openQ.question, answer)
    }], {
      jsonMode: true,
      temperature: 0.2
    });
    evaluation = JSON.parse(raw);
  } catch {
    evaluation = {
      score: 5,
      verdict: "Partial",
      feedback: "Evaluator unavailable. Default partial score assigned.",
      ideal_answer_summary: "",
      keywords_matched: [],
      keywords_missed: [],
      improvement_tip: "Try again later."
    };
  }
  const score = Math.max(0, Math.min(10, Number(evaluation.score) || 0));
  await db.collection("qa_pairs").updateOne({
    _id: openQ._id
  }, {
    $set: {
      user_answer: answer,
      score,
      verdict: String(evaluation.verdict ?? "Partial").slice(0, 30),
      feedback: String(evaluation.feedback ?? "").slice(0, 1e3),
      ideal_answer_summary: String(evaluation.ideal_answer_summary ?? "").slice(0, 1e3),
      keywords_matched: Array.isArray(evaluation.keywords_matched) ? evaluation.keywords_matched.slice(0, 10).map(String) : [],
      keywords_missed: Array.isArray(evaluation.keywords_missed) ? evaluation.keywords_missed.slice(0, 10).map(String) : [],
      improvement_tip: String(evaluation.improvement_tip ?? "").slice(0, 500),
      time_taken_seconds: timeTaken
    }
  });
  const askedSoFar = openQ.question_index + 1;
  const isComplete = askedSoFar >= session.max_questions;
  let nextQuestion = null;
  if (!isComplete) {
    const system = buildInterviewerSystemPrompt(session.topic, session.difficulty, session.max_questions);
    const history = await rebuildHistory(db, sessionId, system);
    const reply = await groqChat(history, {
      temperature: 0.8
    });
    if (!reply.includes("INTERVIEW_COMPLETE")) {
      nextQuestion = reply;
      await db.collection("qa_pairs").insertOne({
        session_id: sessionId,
        user_id: userId,
        question_index: askedSoFar,
        question: nextQuestion,
        user_answer: null,
        created_at: /* @__PURE__ */ new Date()
      });
    }
  }
  let summary = null;
  if (isComplete || nextQuestion === null) {
    const allPairs = await db.collection("qa_pairs").find({
      session_id: sessionId,
      user_answer: {
        $ne: null
      }
    }).sort({
      question_index: 1
    }).toArray();
    const scores = allPairs.map((p) => Number(p.score) || 0);
    const overall = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10 : 0;
    await db.collection("interview_sessions").updateOne({
      _id: new libExports.ObjectId(sessionId)
    }, {
      $set: {
        status: "completed",
        ended_at: /* @__PURE__ */ new Date(),
        overall_score: overall,
        total_questions: scores.length
      }
    });
    summary = {
      overall_score: overall,
      total_questions: scores.length,
      breakdown: allPairs.map((p, i) => ({
        index: i + 1,
        score: p.score,
        verdict: p.verdict
      }))
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
      improvement_tip: evaluation.improvement_tip
    },
    nextQuestion,
    isComplete: isComplete || nextQuestion === null,
    summary
  };
});
const listHistory_createServerFn_handler = createServerRpc({
  id: "842094e482f06201c0231819743b02482992efc518cf6affdacf9c100e4e7e35",
  name: "listHistory",
  filename: "src/lib/interview.functions.ts"
}, (opts) => listHistory.__executeServer(opts));
const listHistory = createServerFn({
  method: "GET"
}).middleware([requireAuth]).handler(listHistory_createServerFn_handler, async ({
  context
}) => {
  const {
    db,
    userId
  } = context;
  const sessions = await db.collection("interview_sessions").find({
    user_id: userId
  }).sort({
    started_at: -1
  }).limit(100).toArray();
  return {
    sessions: sessions.map(toSessionDTO)
  };
});
const getSessionDetail_createServerFn_handler = createServerRpc({
  id: "68c1a89ff20626e59583a55d4bf07a408e9d7d05a95078bb66758c392f682f66",
  name: "getSessionDetail",
  filename: "src/lib/interview.functions.ts"
}, (opts) => getSessionDetail.__executeServer(opts));
const getSessionDetail = createServerFn({
  method: "POST"
}).middleware([requireAuth]).inputValidator((input) => objectType({
  sessionId: ObjectIdSchema
}).parse(input)).handler(getSessionDetail_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    db,
    userId
  } = context;
  const session = await db.collection("interview_sessions").findOne({
    _id: new libExports.ObjectId(data.sessionId),
    user_id: userId
  });
  if (!session) throw new Error("Session not found");
  const pairs = await db.collection("qa_pairs").find({
    session_id: data.sessionId
  }).sort({
    question_index: 1
  }).toArray();
  return {
    session: toSessionDTO(session),
    pairs: pairs.map(toPairDTO)
  };
});
const deleteSession_createServerFn_handler = createServerRpc({
  id: "cdbac37975a271cf6d7af2c2b23e20b93ae2f7652902827e27db74e82740959b",
  name: "deleteSession",
  filename: "src/lib/interview.functions.ts"
}, (opts) => deleteSession.__executeServer(opts));
const deleteSession = createServerFn({
  method: "POST"
}).middleware([requireAuth]).inputValidator((input) => objectType({
  sessionId: ObjectIdSchema
}).parse(input)).handler(deleteSession_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    db,
    userId
  } = context;
  const sessionId = data.sessionId;
  const session = await db.collection("interview_sessions").findOne({
    _id: new libExports.ObjectId(sessionId),
    user_id: userId
  });
  if (!session) throw new Error("Session not found");
  await db.collection("interview_sessions").deleteOne({
    _id: new libExports.ObjectId(sessionId),
    user_id: userId
  });
  await db.collection("qa_pairs").deleteMany({
    session_id: sessionId,
    user_id: userId
  });
  return {
    success: true
  };
});
export {
  deleteSession_createServerFn_handler,
  getSessionDetail_createServerFn_handler,
  listHistory_createServerFn_handler,
  startSession_createServerFn_handler,
  submitAnswer_createServerFn_handler
};
