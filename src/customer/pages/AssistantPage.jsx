import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageContainer from "../../shared/components/PageContainer";
import Button from "../../shared/components/Button";
import LoadingState from "../../shared/components/LoadingState";
import { DEMO_PROMPT } from "../../shared/data/tailors";
import { parseRequest } from "../../services/aiService";
import { saveRequirements, saveJourney } from "../../services/journeyService";
import { mergeMessages } from "../../shared/utils/requirementParser";

const GREETING =
  "Hi! I'm your PatternX styling assistant. Tell me what you're looking for, and I'll find the best options for you.";

const SUGGESTIONS = [
  DEMO_PROMPT,
  "I need a cream HTP set for a wedding in Mandalay, around MMK 80000-180000.",
  "Looking for a linen suit for an outdoor ceremony, preferably in Shan State.",
];

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `m-${Date.now()}`;
}

export default function AssistantPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [input, setInput] = useState(location.state?.draftPrompt || "");
  const [messages, setMessages] = useState([{ id: "g", role: "ai", text: GREETING }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pendingRef = useRef("");
  const endRef = useRef(null);

  useEffect(() => {
    if (location.state?.draftPrompt) setInput(location.state.draftPrompt);
  }, [location.state]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const value = (text ?? input).trim();
    if (loading) return;
    if (!value) {
      setError("Please describe what you’d like PatternX to find.");
      return;
    }

    setError("");
    setMessages((prev) => [...prev, { id: newId(), role: "user", text: value }]);
    setInput("");
    setLoading(true);

    const combined = mergeMessages(pendingRef.current, value);
    const result = await parseRequest(combined);
    const req = result.requirements;
    const prefix =
      result.source === "mock"
        ? "I’ve understood your request."
        : "I’ve analysed your request.";

    if (req?.needsClarification) {
      pendingRef.current = combined;
      saveJourney({ originalRequest: combined, requirements: req, parseSource: result.source });
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: "ai", text: req.clarificationQuestion || "Could you add a little more detail?" },
      ]);
      setLoading(false);
      return;
    }

    pendingRef.current = "";
    saveJourney({ originalRequest: combined, parseSource: result.source, parseWarning: result.warning || null });
    saveRequirements(req, { originalRequest: combined });

    const summary = [
      req.clothingType && `${req.clothingType}`,
      req.occasion && `for a ${req.occasion.toLowerCase()}`,
      (req.budgetMin || req.budgetMax) && "within your budget",
      req.deadlineLabel && `by ${req.deadlineLabel.toLowerCase()}`,
    ]
      .filter(Boolean)
      .join(" ");

    setMessages((prev) => [
      ...prev,
      {
        id: newId(),
        role: "ai",
        text: `${prefix} ${summary ? `You’re looking for ${summary}.` : ""} I’ll show you the details so you can adjust anything before I match tailors.`,
      },
    ]);
    setLoading(false);
    window.setTimeout(() => navigate("/requirements"), 650);
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
              <button key={s} className="chip" type="button" onClick={() => setInput(s)}>
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
            {loading ? <LoadingState label="Understanding your request…" /> : null}
            <div ref={endRef} />
          </div>
          {error ? <p className="form-error">{error}</p> : null}
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
          <Button type="submit" variant="primary" disabled={loading}>
            Send
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}
