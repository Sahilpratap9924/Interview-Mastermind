const TOPICS = [
  { id: "DSA", label: "Data Structures & Algorithms" },
  { id: "OS", label: "Operating Systems" },
  { id: "DBMS", label: "Databases" },
  { id: "CN", label: "Computer Networks" },
  { id: "OOP", label: "Object-Oriented Programming" },
  { id: "ML", label: "Machine Learning" },
  { id: "System Design", label: "System Design" },
  { id: "HR", label: "HR / Behavioral" }
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
function buildInterviewerSystemPrompt(topic, difficulty, maxQuestions) {
  return `You are a strict but fair technical interviewer at a top tech company.
Topic: ${topic}
Difficulty: ${difficulty}

Rules:
- Ask ONE question at a time. Never ask two questions together.
- Questions must be progressively harder based on conversation history.
- After the candidate answers, your reply must be ONLY the next question (no feedback, no commentary). Evaluation is handled separately.
- If the candidate says "I don't know", give a one-line hint, then move to the NEXT question on the same line.
- After ${maxQuestions} questions total have been asked, reply with EXACTLY: INTERVIEW_COMPLETE
- Stay in character as an interviewer at all times.
- First message: greet the candidate in one short sentence, then ask the first question.`;
}
function buildEvaluatorPrompt(topic, difficulty, question, answer) {
  return `You are a strict technical evaluator. Evaluate the following answer.

Question: ${question}
Candidate's Answer: ${answer}
Topic: ${topic}
Difficulty: ${difficulty}

Respond ONLY in this JSON format (no extra text, no markdown fences):
{
  "score": <integer 0-10>,
  "verdict": "<Excellent|Good|Partial|Poor>",
  "feedback": "<2-3 sentences: what was right, what was wrong>",
  "ideal_answer_summary": "<1-2 sentences summarizing the ideal answer>",
  "keywords_matched": ["<keyword1>", "<keyword2>"],
  "keywords_missed": ["<keyword3>", "<keyword4>"],
  "improvement_tip": "<One actionable tip>"
}`;
}
export {
  DIFFICULTIES as D,
  TOPICS as T,
  buildInterviewerSystemPrompt as a,
  buildEvaluatorPrompt as b
};
