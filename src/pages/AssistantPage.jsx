import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";
import LoadingState from "../components/LoadingState";
import { DEMO_PROMPT } from "../data/tailors";

const GREETING =
  "Hi! I'm your PatternX styling assistant. Tell me what you're looking for, and I'll find the best options for you.";

const SUGGESTIONS = [
  DEMO_PROMPT,
  "I need a cream HTP set for a wedding in Mandalay, around MMK 80000-180000.",
  "Looking for a linen suit for an outdoor ceremony, preferably in Shan State.",
];

export default function AssistantPage() {
  const location = useLocation();
  const [input, setInput] = useState(location.state?.draftPrompt || "");
  const [messages, setMessages] = useState([{ id: "g", role: "ai", text: GREETING }]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (location.state?.draftPrompt) {
      setInput(location.state.draftPrompt);
    }
  }, [location.state]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function send(text) {
    const value = (text ?? input).trim();
    if (!value || loading) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: value }]);
    setInput("");
    setLoading(true);

    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: "I've noted that. Full requirement extraction and tailor matching arrive in the next phase — this chat is ready for the demo conversation UI.",
        },
      ]);
      setLoading(false);
    }, 700);
  }

  return (
    <PageContainer>
      <div className="chat">
        <div>
          <p className="eyebrow">PatternX assistant</p>
          <h1 className="serif" style={{ fontSize: "2.2rem", margin: "4px 0 16px" }}>
            Describe the piece you need
          </h1>
          <div className="chips">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip" type="button" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
          <div className="chat__thread">
            {messages.map((m) => (
              <div key={m.id} className={`bubble bubble--${m.role}`}>
                {m.text}
              </div>
            ))}
            {loading ? <LoadingState label="Listening…" /> : null}
            <div ref={endRef} />
          </div>
        </div>
        <form
          className="chat__composer"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell us what you're looking for"
            aria-label="Your clothing request"
          />
          <Button type="submit" variant="primary" disabled={!input.trim() || loading}>
            Send
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}
