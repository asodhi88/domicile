// src/components/FeedbackForm.jsx
import { useState } from "react";

const MAX_FEEDBACK_LENGTH = 500;

export default function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  async function submit(e) {
    e.preventDefault();
    if (!feedback.trim() || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), feedback: feedback.trim() }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setOpen(false);
    setStatus("idle");
    setName("");
    setFeedback("");
  }

  return (
    <div className="mt-6">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border border-paper/15 px-4 py-1.5 font-mono text-xs uppercase tracking-wider-2 text-paper/70 transition hover:border-brass/60 hover:text-brass-light"
        >
          Provide feedback
        </button>
      )}

      {open && (
        <div className="max-w-md rounded-sm border border-parchment-dark bg-parchment p-6 shadow-card">
          {status === "done" ? (
            <>
              <p className="font-display text-lg italic text-parchment-text">
                Thank you. Your feedback will help us improve our service.
              </p>
              <button
                onClick={reset}
                className="mt-4 rounded-sm bg-brass px-4 py-2 font-mono text-xs uppercase tracking-wider-2 text-ink-900 transition hover:bg-brass-light"
              >
                Close
              </button>
            </>
          ) : (
            <form onSubmit={submit}>
              <p className="font-mono text-[0.65rem] uppercase tracking-wider-2 text-parchment-text/70">
                Provide feedback
              </p>

              <label className="mt-4 block">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-parchment-text/75">
                  Name
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1 w-full rounded-sm border border-parchment-dark bg-paper px-3 py-2 text-sm text-parchment-text outline-none focus:border-brass"
                />
              </label>

              <label className="mt-4 block">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-parchment-text/75">
                  Feedback
                </span>
                <textarea
                  value={feedback}
                  onChange={(e) =>
                    setFeedback(e.target.value.slice(0, MAX_FEEDBACK_LENGTH))
                  }
                  maxLength={MAX_FEEDBACK_LENGTH}
                  rows={4}
                  placeholder="What's working, what's missing, what's confusing?"
                  className="mt-1 w-full resize-none rounded-sm border border-parchment-dark bg-paper px-3 py-2 text-sm text-parchment-text outline-none focus:border-brass"
                />
                <span className="mt-1 block text-right font-mono text-[0.65rem] text-parchment-text/60">
                  {feedback.length}/{MAX_FEEDBACK_LENGTH}
                </span>
              </label>

              {status === "error" && (
                <p className="mt-2 text-xs text-clay">
                  Something went wrong sending your feedback. Please try again.
                </p>
              )}

              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={!feedback.trim() || status === "sending"}
                  className="rounded-sm bg-brass px-4 py-2 font-mono text-xs uppercase tracking-wider-2 text-ink-900 transition hover:bg-brass-light disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {status === "sending" ? "Sending…" : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider-2 text-parchment-text/70 transition hover:text-parchment-text"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
