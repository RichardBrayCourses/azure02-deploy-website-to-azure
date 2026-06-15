# All Checks Out - Stage 4 Implementation Handoff

## Purpose

This note records the Stage 4 work completed after `stage-3-implementation-handoff.md`.

Stage 4 corresponds to:

> Vendor-Controlled Access Grants

from the amended due diligence change plan.

## Completed In Stage 4

### Added First-Class Access Grants

The in-memory domain now includes a first-class `AccessGrant` model owned by a vendor/participant.

The model records:

- Authority.
- Granting participant/vendor.
- Grantee type.
- Grantee subscriber or service-provider organisation.
- Permission level.
- Data scope.
- Status.
- Created-by user.
- Optional expiry date.

Changed in:

- `monorepo/apps/ui/src/data/console.ts`

### Seeded Vendor-Owned Grants

The existing subscriber visibility has been represented as seeded access grants.

Seeded grants include:

- Subscriber grants for Harrington Financial Group and Mercury Retail PLC.
- Service-provider-style helper grants for Sentinel GRC Advisory.

The old `StakeholderParticipantAccess` seed data remains temporarily for compatibility, but active subscriber/vendor scoping now reads from `AccessGrant`.

Changed in:

- `monorepo/apps/ui/src/data/console.ts`

### Added Access Grant Commands

The in-memory database now supports:

- `createAccessGrant`
- `updateAccessGrantStatus`
- `getAccessGrantsForParticipant`
- `getActiveAccessGrantsForStakeholder`

The existing `grantStakeholderAccess` command now also creates a matching vendor-owned grant so legacy callers do not drift away from the new model.

Changed in:

- `monorepo/apps/ui/src/data/console.ts`

### Switched Subscriber Scoping To Active Grants

Subscriber-visible vendors and cases are now scoped through active access grants instead of authority-like stakeholder access records.

This preserves the Stage 3 rule:

> The association has no default access to vendor due diligence answers, evidence metadata, or evidence files.

Changed in:

- `monorepo/apps/ui/src/data/console.ts`

### Added Vendor Access Grants Page

Vendor users can now open:

```text
/cases/access-grants
```

from the Due Diligence Packs workspace.

The page supports:

- Viewing grants for the active vendor.
- Creating subscriber grants.
- Creating service-provider grants.
- Selecting permission level.
- Setting initial status.
- Activating, suspending, and revoking grants.

Changed in:

- `monorepo/apps/ui/src/pages/ConsolePages.tsx`
- `monorepo/apps/ui/src/App.tsx`

### Kept Association Access Read-Only

Association-side vendor and subscriber detail pages continue to show only relationship and aggregate information.

The vendor detail page now summarizes active subscriber grants rather than implying the association manages a single stakeholder access relationship.

Changed in:

- `monorepo/apps/ui/src/pages/ConsolePages.tsx`

## Files Changed

Stage 4 changed:

- `monorepo/apps/ui/src/App.tsx`
- `monorepo/apps/ui/src/data/console.ts`
- `monorepo/apps/ui/src/pages/ConsolePages.tsx`

This handover was added:

- `docs/stage-4-implementation-handoff.md`

## Verification Completed

The following commands passed:

```bash
pnpm run type-check
pnpm run ui:build
```

## Known Limitations After Stage 4

The access grant model is now first-class in the frontend, but the deeper access model is still transitional.

Known gaps:

- `StakeholderParticipantAccess` still exists as a compatibility model and should be removed in a later cleanup.
- Third-party helpers/service providers are still represented with the existing stakeholder model rather than a separate helper account type.
- Helper context sign-in is not implemented.
- Helper create/edit permissions are modelled on grants but not yet connected to a helper workspace.
- Grant data scopes are modelled, but the UI currently creates workspace-wide grants.
- Grant expiry is modelled, but no expiry workflow or filtering is implemented beyond the status field.
- Subscriber requests for additional information are not implemented.
- Vendor-of-vendor records are not first-class records yet.
- Some deeper page copy still uses older labels such as participant, stakeholder, case, and task.

## Recommended Next Stage

The next agent should proceed with Stage 5:

> Due Diligence Pack Workflow

Recommended Stage 5 goals:

- Continue replacing visible case/task labels with due diligence pack/item vocabulary.
- Keep vendor users able to update their own pack items.
- Allow authorised helpers to access and update vendor workspaces only when the grant permission allows it.
- Keep subscribers read-only unless request-for-information workflow is introduced.
- Scope subscriber review state to the subscriber organisation.
- Preserve the association access boundary established in Stages 3 and 4.

Recommended caution:

- Do not reintroduce association default access to private vendor pack routes.
- Do not treat every stakeholder grant as helper edit permission; use `granteeType` and `permissionLevel`.
- Keep subscriber scoping based on active account context and active access grants.
