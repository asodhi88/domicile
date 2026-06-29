// src/components/FeedbackForm.jsx
import { useState } from "react";

const MAX_FEEDBACK_LENGTH = 500;

export default function FeedbackForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitted(true);
  }

  function reset() {
    setOpen(false);
    setSubmitted(false);
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
          {submitted ? (
            <>
              <p className="font-display text-lg italic text-parchment-text">
                Thanks for the feedback.
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
              <p className="font-mono text-[0.65rem] uppercase tracking-wider-2 text-parchment-text/50">
                Provide feedback
              </p>

              <label className="mt-4 block">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-parchment-text/55">
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
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-parchment-text/55">
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
                <span className="mt-1 block text-right font-mono text-[0.65rem] text-parchment-text/40">
                  {feedback.length}/{MAX_FEEDBACK_LENGTH}
                </span>
              </label>

              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={!feedback.trim()}
                  className="rounded-sm bg-brass px-4 py-2 font-mono text-xs uppercase tracking-wider-2 text-ink-900 transition hover:bg-brass-light disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-sm px-4 py-2 font-mono text-xs uppercase tracking-wider-2 text-parchment-text/50 transition hover:text-parchment-text"
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
