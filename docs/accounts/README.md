# EmersonEIMS accounts (Report B)

Secure accounts, organisations, organisation-isolated project storage, revision history, verified professional approvals, audit trails, and backup and recovery for the four engineering tools.

**Status: preview only.**
- The feature is off unless `ACCOUNTS_ENABLED` is exactly `true`.
- It is **always off in production**, even if the flag is set (`lib/accounts/config.ts`).
- Professional approvals cannot happen until a registry administrator has verified a real, qualified reviewer. None is verified.

| Document | For |
|---|---|
| [architecture.md](architecture.md) | Engineers: components, data model, request flow |
| [security.md](security.md) | Engineers and reviewers: threat model, controls, test map, residual risks |
| [operations.md](operations.md) | Operators: configuration, migrations, keys, monitoring, incidents |
| [backup-and-recovery.md](backup-and-recovery.md) | Operators: backups, restore drill, recovery after a restore |
| [data-handling-procedures.md](data-handling-procedures.md) | Operators: deletion, retention, purge job, data requests |
| [preview-setup.md](preview-setup.md) | **Owner**: setting up the free preview database and settings |
| [legacy-record-count.md](legacy-record-count.md) | **Owner or administrator**: a counts-only check of older Generator Oracle tables |

## What it is not

- **Not a certification system.** "Verified reviewer" means a registry administrator recorded an identity and registration check. The software cannot itself confirm a professional registration.
- **Not validated engineering.** An approval records that a verified reviewer approved an exact document revision. It says nothing about the accuracy of the tools' calculations, which still needs independent engineering validation.
