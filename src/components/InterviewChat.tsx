import { Bot, User } from "lucide-react";

export type ChatTurn = { role: "ai" | "user"; text: string };

export function InterviewChat({ turns, thinking }: { turns: ChatTurn[]; thinking: boolean }) {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-4">
      {turns.map((t, i) => (
        <div key={i} className={`flex gap-3 ${t.role === "user" ? "flex-row-reverse" : ""}`}>
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${t.role === "ai" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
            {t.role === "ai" ? <Bot size={16} /> : <User size={16} />}
          </div>
          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${t.role === "ai" ? "bg-card text-card-foreground border border-border" : "bg-primary text-primary-foreground"}`}>
            {t.text}
          </div>
        </div>
      ))}
      {thinking && (
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bot size={16} />
          </div>
          <div className="rounded-2xl bg-card border border-border px-4 py-3">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
