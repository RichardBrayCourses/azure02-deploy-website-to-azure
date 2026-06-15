# All Checks Out - Stage 1 Implementation Handoff

## Purpose

This note records what has already been implemented so the next agent can continue from the right point without re-discovering the recent decisions.

Stage 1 corresponds to:

> Authority Terminology And Corrected Seed Data

from `vendor-owned-due-diligence-change-plan.md`.

## Completed In Stage 1

### Corrected Demo Scenario

The in-memory demo data now centres on one authority:

- `Digital Platform Assurance Association`

The previous mixed demo scenarios have been removed from the UI seed data:

- Home services / plumbing.
- Council permit renewal.

The seeded authority now represents the trade association scenario from the updated functional specification.

### Seeded Vendors

Participants now represent member IT platform vendors:

- `Northstar Cloud Platforms`
- `Cobalt Workflow Systems`
- `Pinebridge Data Exchange`
- `Asteria Identity Services`

These are still stored using the existing `Participant` model because the deeper domain migration has not yet happened.

### Seeded Subscribers And Service-Provider-Like Reviewer

Stakeholders now represent subscriber/customer organisations and one service-provider-like reviewer:

- `Harrington Financial Group`
- `Mercury Retail PLC`
- `Sentinel GRC Advisory`

These are still stored using the existing `Stakeholder` model. The real split between subscriber and third-party helper is still pending.

### Seeded Access

The existing stakeholder-participant access model now grants subscribers visibility of multiple vendors:

- Harrington can view Northstar and Cobalt.
- Mercury can view Cobalt and Pinebridge.
- Sentinel can view Northstar and Asteria.

This is still implemented using `StakeholderParticipantAccess`. The proper participant-controlled `AccessGrant` model is still pending.

### Seeded Users

User seed data was updated so emails and memberships match the association/vendor/subscriber story.

Important limitation:

- The old `userKind` exclusivity rule is still in place.
- Multi-account membership has not yet been implemented.

That is expected for Stage 1 and should be handled in Stage 2.

### Seeded Task Types

The task type library has been changed from generic/demo items such as driving licence, GPS, and vehicle documents to IT vendor due diligence task types:

- Policy document upload.
- Certification evidence.
- Questionnaire.
- Control attestation.
- Supplier register.
- Vendor-of-vendor DDQ.
- Risk and remediation register.
- Evidence metadata upload.
- Digital signature.
- AI usage disclosure.
- Access control and MFA.
- Hosting and data residency.

### Seeded DDQ Templates

The current seed data includes:

- Published template:
  - `Annual Platform Vendor DDQ 2026`
- Draft template:
  - `Critical Supplier DDQ`

The published template has realistic IT vendor due diligence tasks including:

- Company profile and platform summary.
- Information security policy.
- ISO 27001 or SOC 2 evidence.
- Penetration test summary.
- Vulnerability management process.
- Access control and MFA attestation.
- Data protection registration.
- GDPR data processing agreement.
- Subprocessor register.
- Hosting and data residency statement.
- Backup and restore evidence.
- Business continuity and disaster recovery plan.
- Incident response plan.
- Cyber insurance evidence.
- Secure development lifecycle questionnaire.
- AI usage and customer-data disclosure.
- Critical supplier and vendor-of-vendor DDQ.
- Senior officer attestation and signature.

### Seeded Due Diligence Packs

Each seeded vendor now has a generated case instance from the annual DDQ template.

These are still stored using the existing `Case` and `CaseTask` model, but displayed and seeded as vendor due diligence packs.

### UI Label Updates

Several top-level labels were updated:

- Role labels:
  - Authority -> Association.
  - Participant -> Vendor.
  - Stakeholder -> Subscriber.
- App labels:
  - Administration -> Scheme Administration.
  - Case Management -> Due Diligence Packs.
  - Stakeholder Portal -> Subscriber Portal.
- Search placeholder:
  - Now refers to apps, vendors, DDQs, and items.
- Sign-in screen:
  - Now asks for association and vendor context.

Important limitation:

- Many deeper page labels still use the old internal vocabulary such as participant, stakeholder, case, and task.
- This is intentional for now. A previous broad text replacement was unsafe, so deeper copy should be updated carefully during later stages.

### Affirmative Action Button Cleanup

The unwanted automatic affirmative buttons were removed after Stage 1.

Completed cleanup:

- Removed automatic top-right `Save/Update/Apply` button from `ConsoleLayout`.
- Removed unused affirmative props from page call sites.
- Kept real page/action-panel buttons such as `Create`, `Save`, `Grant`, `Submit task`, etc.

## Files Changed

Stage 1 primarily changed:

- `monorepo/apps/ui/src/data/console.ts`
- `monorepo/apps/ui/src/context/AuthContext.tsx`
- `monorepo/apps/ui/src/pages/SignInPage.tsx`
- `monorepo/apps/ui/src/components/Header.tsx`

Affirmative button cleanup changed:

- `monorepo/apps/ui/src/components/ConsoleLayout.tsx`
- `monorepo/apps/ui/src/pages/ConsolePages.tsx`

## Verification Completed

The following commands passed after the changes:

```bash
pnpm run type-check
pnpm run ui:build
```

The local dev server was started successfully during testing:

```text
http://localhost:5173/
```

## Known Limitations After Stage 1

The app has better seed data and top-level vocabulary, but the deeper domain model is still the old one.

Known gaps:

- `UserAccount.userKind` still exists.
- The app still assumes one role context at login.
- Users cannot yet switch between multiple account contexts.
- Third-party helpers are not yet a separate model.
- Access is still represented as stakeholder-participant access rather than participant-controlled grants.
- Information requests are not yet implemented.
- Vendor-of-vendor records are not yet implemented as first-class records.
- Authority terminology is not yet a stored/configurable object.
- Deeper pages still contain some old labels and authority-review assumptions.

## Recommended Next Stage

The next agent should proceed with Stage 2:

> Login, Authority Context, And Account Switching

Recommended Stage 2 goals:

- Change demo sign-in to select a user identity first.
- Show all available authority/account contexts for that user.
- Store active authority and active account context.
- Add account switching in the header.
- Begin removing the one-user-kind assumption.
- Keep route behaviour working for the existing authority/vendor/subscriber contexts.

Recommended caution:

- Avoid broad mechanical text replacement in `ConsolePages.tsx`; it can damage code identifiers.
- Prefer small, type-checked edits.
- Keep each stage buildable and manually testable.

