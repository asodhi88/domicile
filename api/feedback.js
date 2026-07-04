// api/feedback.js
//
// Vercel serverless function. Sends feedback to the site owner's email
// without ever exposing the address to the browser. Uses Resend
// (https://resend.com) — set these in your Vercel project's Environment
// Variables, not in any committed file:
//
//   RESEND_API_KEY  — your Resend API key
//   FEEDBACK_EMAIL  — the address feedback should be delivered to
//
// POST /api/feedback  { name: string, feedback: string }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, feedback } = req.body || {};
  const trimmed = (feedback || "").trim().slice(0, 500);

  if (!trimmed) {
    res.status(400).json({ error: "Feedback is required" });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.FEEDBACK_EMAIL;

  if (!apiKey || !toEmail) {
    // Not configured yet — don't error the user experience over it.
    console.log("Feedback received (email not configured):", { name, feedback: trimmed });
    res.status(200).json({ ok: true, delivered: false });
    return;
  }

  try {
    const upstream = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Domicile Feedback <onboarding@resend.dev>",
        to: [toEmail],
        subject: `Domicile feedback from ${(name || "Anonymous").slice(0, 100)}`,
        text: `Name: ${name || "Anonymous"}\n\n${trimmed}`,
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error("Resend error:", detail);
      res.status(502).json({ error: "Failed to send" });
      return;
    }

    res.status(200).json({ ok: true, delivered: true });
  } catch (err) {
    console.error("Feedback send failed:", err);
    res.status(502).json({ error: "Failed to send" });
  }
}
