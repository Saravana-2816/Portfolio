import type { IncomingMessage, ServerResponse } from "node:http"
import { Resend } from "resend"

type ContactRequest = IncomingMessage & { body?: unknown }

const CONTACT_TO_EMAIL = "saravana28092004@gmail.com"

function isValidPayload(
  body: unknown
): body is { name: string; email: string; message: string } {
  if (typeof body !== "object" || body === null) return false
  const { name, email, message } = body as Record<string, unknown>
  return (
    typeof name === "string" &&
    name.trim().length >= 2 &&
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    typeof message === "string" &&
    message.trim().length >= 10
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

  const { name, email, message } = req.body

  if (!process.env.RESEND_API_KEY) {
    res.writeHead(500, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Email service is not configured" }))
    return
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `New message from ${name} via portfolio`,
      text: `From: ${name} <${email}>\n\n${message}`,
    })

    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ ok: true }))
  } catch {
    res.writeHead(502, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: "Failed to send email" }))
  }
}
