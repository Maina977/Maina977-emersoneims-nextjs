/**
 * TEST-EMAIL WORKFLOW FOR THE PROTECTED PREVIEW (Report B preview authorisation,
 * items 5 and 6).
 *
 * Testers must go through the REAL email-verification workflow (token issued
 * → message delivered → link opened → token consumed by the real endpoint),
 * never a direct database shortcut, and no message may reach a real customer.
 *
 * ACCOUNTS_MAIL_MODE (exact values; anything else = "none"):
 *   none    messages are withheld (the default)
 *   outbox  messages are stored in acct_test_outbox and read on the preview's
 *           "Test email outbox" screen; nothing leaves the system
 *   smtp    messages are sent through a DEDICATED TEST SENDER
 *           (ACCOUNTS_SMTP_URL, ACCOUNTS_MAIL_FROM), never the site's own mail
 *
 * ACCOUNTS_TEST_EMAIL_DOMAINS (required for outbox and smtp): comma-separated
 * domains of fictitious test addresses (for example "test.example"). In those
 * modes:
 *   - sign-up and invitations to any other address are REFUSED, so no real
 *     customer address can be registered or emailed;
 *   - the mailer refuses (never stores, never sends) any other recipient, as
 *     a second line of defence.
 * Accounts are off in production, so none of this runs there.
 */
import 'server-only';
import { randomUUID } from 'node:crypto';
import { AcctError, type Ctx } from './context';
import type { AccountsDb } from './db';
import { getMailer, mailerOverriddenForTests, nullMailer, type AccountMail, type AccountMailer } from './mailer';

export type MailMode = 'none' | 'outbox' | 'smtp';
export function mailMode(env: Record<string, string | undefined> = process.env): MailMode {
  const m = env.ACCOUNTS_MAIL_MODE;
  return m === 'outbox' || m === 'smtp' ? m : 'none';
}
export function testDomains(env: Record<string, string | undefined> = process.env): string[] {
  return (env.ACCOUNTS_TEST_EMAIL_DOMAINS ?? '').split(',').map((d) => d.trim().toLowerCase()).filter((d) => /^[a-z0-9.-]+\.[a-z]{2,}$/.test(d));
}
export function isTestAddress(email: string, env: Record<string, string | undefined> = process.env): boolean {
  const domain = email.toLowerCase().split('@')[1] ?? '';
  return testDomains(env).includes(domain);
}

/** In outbox/smtp mode only allow-listed test addresses may sign up or be invited. */
export function assertTestRecipient(ctx: Ctx, email: string): void {
  const mode = mailMode(ctx.env);
  if (mode === 'none') return;
  const domains = testDomains(ctx.env);
  if (!domains.length) throw new AcctError(503, 'The preview test email is not configured (ACCOUNTS_TEST_EMAIL_DOMAINS).');
  if (!isTestAddress(email, ctx.env)) throw new AcctError(400, `In this preview only test addresses can be used (@${domains.join(', @')}).`);
}

function outboxMailer(db: AccountsDb, env: Record<string, string | undefined>): AccountMailer {
  return {
    async send(m: AccountMail) {
      if (!isTestAddress(m.to, env)) { console.warn(`[accounts] test outbox refused a non-test recipient (${m.kind})`); return; }
      await db.query('INSERT INTO acct_test_outbox (id, to_addr, kind, subject, body, created_at) VALUES ($1, $2, $3, $4, $5, $6)', [randomUUID(), m.to.toLowerCase(), m.kind, m.subject, m.text, new Date().toISOString()]);
    },
  };
}

function smtpMailer(env: Record<string, string | undefined>): AccountMailer {
  const url = (env.ACCOUNTS_SMTP_URL ?? '').trim();
  const from = (env.ACCOUNTS_MAIL_FROM ?? '').trim();
  if (!/^smtps?:\/\//.test(url) || !from) return nullMailer;
  let transport: { sendMail: (o: Record<string, unknown>) => Promise<unknown> } | null = null;
  return {
    async send(m: AccountMail) {
      if (!isTestAddress(m.to, env)) { console.warn(`[accounts] test sender refused a non-test recipient (${m.kind})`); return; }
      if (!transport) {
        const nodemailer = (await import('nodemailer')) as unknown as { createTransport: (u: string) => typeof transport };
        transport = nodemailer.createTransport(url);
      }
      await transport!.sendMail({ from, to: m.to, subject: `[TEST] ${m.subject}`, text: `${m.text}\n\nThis is a test message from the EmersonEIMS preview.` });
    },
  };
}

/** The mailer for this request: a test override first, else by ACCOUNTS_MAIL_MODE. */
export function resolveMailer(env: Record<string, string | undefined>, db: AccountsDb): AccountMailer {
  if (mailerOverriddenForTests()) return getMailer();
  const mode = mailMode(env);
  if (mode !== 'none' && !testDomains(env).length) return nullMailer;
  if (mode === 'outbox') return outboxMailer(db, env);
  if (mode === 'smtp') return smtpMailer(env);
  return nullMailer;
}

/** The test outbox for one test address (outbox mode only), newest first. */
export async function readTestOutbox(ctx: Ctx, emailIn: unknown): Promise<{ messages: { kind: string; subject: string; text: string; createdAt: string }[] }> {
  if (mailMode(ctx.env) !== 'outbox') throw new AcctError(404, 'Not found');
  const email = typeof emailIn === 'string' ? emailIn.trim().toLowerCase() : '';
  if (!isTestAddress(email, ctx.env)) throw new AcctError(400, 'Only test addresses have an outbox.');
  const r = await ctx.db.query<{ kind: string; subject: string; body: string; created_at: unknown }>(
    'SELECT kind, subject, body, created_at FROM acct_test_outbox WHERE to_addr = $1 ORDER BY created_at DESC LIMIT 20', [email]);
  return { messages: r.rows.map((x) => ({ kind: x.kind, subject: x.subject, text: x.body, createdAt: (x.created_at instanceof Date ? x.created_at : new Date(String(x.created_at))).toISOString() })) };
}

/** Public, non-secret: which mode the preview is in (the screens show the outbox link only in outbox mode). */
export function mailInfo(env: Record<string, string | undefined>): { mode: MailMode; testDomains: string[] } {
  const mode = mailMode(env);
  return { mode, testDomains: mode === 'none' ? [] : testDomains(env) };
}
