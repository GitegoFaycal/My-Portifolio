import nodemailer from 'nodemailer';
import { getPortfolio } from './store.js';

/**
 * Sends contact-form messages to the site owner's email.
 *
 * Two providers are supported, picked from the environment:
 *   - Resend  : set RESEND_API_KEY (HTTP API, works well on Vercel).
 *   - SMTP    : set SMTP_HOST, SMTP_USER, SMTP_PASS (e.g. Gmail with an app password).
 * The recipient is CONTACT_EMAIL, falling back to the email in the profile section.
 * If nothing is configured the message is only stored in the admin inbox.
 */

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function mailProvider() {
  if (process.env.RESEND_API_KEY) return 'resend';
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) return 'smtp';
  return 'none';
}

async function recipient() {
  if (process.env.CONTACT_EMAIL) return process.env.CONTACT_EMAIL.trim();
  const { profile } = await getPortfolio();
  return profile?.email?.trim() || '';
}

function buildEmail(msg, to) {
  const subject = `[Portfolio] ${msg.subject || 'New message'} - from ${msg.name}`;
  const text = [
    `You received a new message from your portfolio contact form.`,
    ``,
    `Name:    ${msg.name}`,
    `Email:   ${msg.email}`,
    `Subject: ${msg.subject || '(none)'}`,
    `Sent:    ${new Date(msg.createdAt).toUTCString()}`,
    ``,
    `Message:`,
    msg.message,
    ``,
    `Reply to this email to answer ${msg.name} directly.`,
  ].join('\n');
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#0f172a">
      <h2 style="margin:0 0 16px;font-size:20px">New message from your portfolio</h2>
      <table style="border-collapse:collapse;font-size:14px">
        <tr><td style="padding:4px 12px 4px 0;color:#64748b">Name</td><td style="padding:4px 0"><strong>${escapeHtml(msg.name)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#64748b">Email</td><td style="padding:4px 0"><a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#64748b">Subject</td><td style="padding:4px 0">${escapeHtml(msg.subject || '(none)')}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#64748b">Sent</td><td style="padding:4px 0">${new Date(msg.createdAt).toUTCString()}</td></tr>
      </table>
      <div style="margin:20px 0;padding:16px;border-left:4px solid #2563eb;background:#f8fafc;white-space:pre-wrap;font-size:15px;line-height:1.5">${escapeHtml(msg.message)}</div>
      <p style="font-size:13px;color:#64748b">Reply to this email to answer ${escapeHtml(msg.name)} directly.</p>
    </div>`;
  return { to, subject, text, html, replyTo: `${msg.name} <${msg.email}>` };
}

async function sendWithResend(email) {
  const from = process.env.MAIL_FROM || 'Portfolio <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [email.to], reply_to: email.replyTo, subject: email.subject, text: email.text, html: email.html }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Resend responded ${res.status}: ${body}`);
  }
}

async function sendWithSmtp(email) {
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transport.sendMail({
    from: process.env.MAIL_FROM || `Portfolio <${process.env.SMTP_USER}>`,
    to: email.to,
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
}

/**
 * Emails a stored contact message to the owner. Returns true when an email was sent,
 * false when no provider or recipient is configured. Throws on delivery errors.
 */
export async function notifyNewMessage(msg) {
  const provider = mailProvider();
  if (provider === 'none') return false;
  const to = await recipient();
  if (!to) return false;
  const email = buildEmail(msg, to);
  if (provider === 'resend') await sendWithResend(email);
  else await sendWithSmtp(email);
  return true;
}
