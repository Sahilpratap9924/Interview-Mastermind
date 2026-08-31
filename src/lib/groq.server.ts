// Server-only Gemini client. Never import from client code.
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";
const DEFAULT_MODEL = "gemini-3.6-flash";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function groqChat(messages: ChatMessage[], opts?: { model?: string; jsonMode?: boolean; temperature?: number }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured. Add it in Cloud secrets.");

  const systemInstruction = messages.find((message) => message.role === "system")?.content;
  const contents = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: opts?.temperature ?? 0.7,
      ...(opts?.jsonMode ? { responseMimeType: "application/json" } : {}),
    },
    ...(systemInstruction ? { systemInstruction: { parts: [{ text: systemInstruction }] } } : {}),
  };

  if (opts?.model && opts.model !== DEFAULT_MODEL) {
    body.model = opts.model;
  }

  const res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gemini API ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json() as {
    candidates?: {
      content?: {
        parts?: { text?: string }[];
      };
    }[];
  };

  const content = data.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!content) throw new Error("Empty response from Gemini");
  return content;
}
