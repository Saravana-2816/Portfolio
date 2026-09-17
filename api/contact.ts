import type { IncomingMessage, ServerResponse } from "node:http"
import { Resend } from "resend"

type ContactRequest = IncomingMessage & { body?: unknown }

const CONTACT_TO_EMAIL = "saravana28092004@gmail.com"

const INTENT_LABELS: Record<string, string> = {
  "full-time": "Full-time opportunity",
  freelance: "Freelance / contract project",
  other: "Something else",
}

function isValidPayload(
  body: unknown
): body is { name: string; email: string; message: string; intent?: string } {
  if (typeof body !== "object" || body === null) return false
  const { name, email, message, intent } = body as Record<string, unknown>
  return (
    typeof name === "string" &&
    name.trim().length >= 2 &&
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    typeof message === "string" &&
    message.trim().length >= 10 &&
    (intent === undefined || typeof intent === "string")
  )
}

export default async function handler(req: ContactRequest, res: ServerResponse) {
  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Method not allowed" }))
    return
  }

  if (!isValidPayload(req.body)) {
    res.writeHead(400, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Invalid form submission" }))
    return
  }

  // Honeypot filled in: a bot. Answer like a success so it moves on.
  const honeypot = (req.body as { website?: unknown }).website
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ ok: true }))
    return
  }

  const { name, email, message, intent } = req.body
  const intentLabel = intent ? (INTENT_LABELS[intent] ?? intent) : null

  // A pasted key can carry a stray newline, which makes the Authorization header invalid.
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set for this environment")
    res.writeHead(500, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Email service is not configured" }))
    return
  }

  try {
    const resend = new Resend(apiKey)
    // Resend reports API failures in the result instead of throwing.
    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: intentLabel
        ? `New message from ${name} via portfolio — ${intentLabel}`
        : `New message from ${name} via portfolio`,
      text: `From: ${name} <${email}>${intentLabel ? `\nReason: ${intentLabel}` : ""}\n\n${message}`,
    })

    if (error) {
      console.error("[contact] Resend rejected the email:", JSON.stringify(error))
      res.writeHead(502, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ error: "Failed to send email" }))
      return
    }

    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ ok: true }))
  } catch (err) {
    console.error("[contact] Sending threw:", err instanceof Error ? `${err.name}: ${err.message}` : err)
    res.writeHead(502, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Failed to send email" }))
  }
}
