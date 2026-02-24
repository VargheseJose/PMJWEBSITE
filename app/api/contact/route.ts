export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"

import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
    try {
        const { firstName, lastName, email, phone, subject, message } = await req.json()

        if (!firstName || !email || !message) {
            return NextResponse.json({ error: "First name, email, and message are required." }, { status: 400 })
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        const recipients = process.env.ENQUIRY_TO || process.env.SMTP_USER || ""
        const fullName = [firstName, lastName].filter(Boolean).join(" ")

        const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 32px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #1e293b; color: #fff; padding: 28px 32px; }
    .header h1 { margin: 0; font-size: 22px; }
    .header p { margin: 6px 0 0; font-size: 14px; color: #94a3b8; }
    .body { padding: 28px 32px; }
    .section { margin-bottom: 20px; }
    .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
    .value { font-size: 15px; color: #1e293b; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
    .subject-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 20px; margin-bottom: 24px; }
    .subject-box .text { font-size: 16px; font-weight: 700; color: #0f172a; }
    .footer { background: #f8fafc; padding: 16px 32px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
      <p>A visitor has sent a message through the website contact form.</p>
    </div>
    <div class="body">
      ${subject ? `
      <div class="subject-box">
        <div class="label">Subject</div>
        <div class="text">${subject}</div>
      </div>` : ""}

      <div class="section">
        <div class="label">Name</div>
        <div class="value">${fullName}</div>
      </div>
      <div class="section">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${email}" style="color:#3b82f6;">${email}</a></div>
      </div>
      ${phone ? `
      <div class="section">
        <div class="label">Phone</div>
        <div class="value">${phone}</div>
      </div>` : ""}
      <hr class="divider" />
      <div class="section">
        <div class="label">Message</div>
        <div class="value" style="white-space:pre-wrap;">${message}</div>
      </div>
    </div>
    <div class="footer">This message was submitted from the PMJ Website Contact Form</div>
  </div>
</body>
</html>`

        await transporter.sendMail({
            from: `"PMJ Website" <${process.env.SMTP_USER}>`,
            to: recipients,
            replyTo: email,
            subject: subject ? `Contact: ${subject} — ${fullName}` : `Contact Form Message from ${fullName}`,
            html,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Contact email error:", error)
        return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
    }
}
