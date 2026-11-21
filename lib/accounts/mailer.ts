/**
 * Email for accounts (verification, password reset, invitations) behind an
 * interface. NOTHING is wired to real sending: the default mailer drops the
 * message (it logs only that a message was withheld, never the token). Tests
 * use the in-memory mailer. Wiring a real sender is a business decision
 * (docs/accounts/architecture.md, "Blocked").
 */
export interface AccountMail { to: string; subject: string; text: string; kind: 'verify_email' | 'reset_password' | 'invite' }
export interface AccountMailer { send(m: AccountMail): Promise<void> }

export const nullMailer: AccountMailer = {
  async send(m) {
    console.warn(`[accounts] email not sent (no mailer configured): ${m.kind}`);
  },
};

export class MemoryMailer implements AccountMailer {
  sent: AccountMail[] = [];
  async send(m: AccountMail) { this.sent.push(m); }
  /** The token in the last message of this kind to this address (tests). */
  lastToken(to: string, kind: AccountMail['kind']): string | null {
    const m = [...this.sent].reverse().find((x) => x.to === to && x.kind === kind);
    const t = m?.text.match(/token=([A-Za-z0-9_-]{43})/);
    return t ? t[1] : null;
  }
}

let current: AccountMailer = nullMailer;
export const getMailer = () => current;
/** Tests only. */
export function setMailerForTests(m: AccountMailer | null) { current = m ?? nullMailer; }
