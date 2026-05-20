import { useEffect, useRef, useState } from "react";

type SR = any;

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SR | null>(null);

  useEffect(() => {
    const w: any = typeof window !== "undefined" ? window : {};
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const r: SR = new Ctor();
    r.continuous = true;
    r.interimResults = true;
    r.lang = "en-US";
    r.onresult = (event: any) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };
    r.onerror = (e: any) => {
      setError(e?.error === "not-allowed" ? "Microphone permission denied" : `Voice error: ${e?.error || "unknown"}`);
      setIsListening(false);
    };
    r.onend = () => setIsListening(false);
    recognitionRef.current = r;
    return () => { try { r.stop(); } catch {} };
  }, []);

  const start = () => {
    setError(null);
    setTranscript("");
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch (e: any) {
      setError(e?.message ?? "Could not start recognition");
    }
  };
  const stop = () => {
    try { recognitionRef.current?.stop(); } catch {}
    setIsListening(false);
  };

  return { isListening, transcript, error, supported, start, stop, setTranscript };
}
