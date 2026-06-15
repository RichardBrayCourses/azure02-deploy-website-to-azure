# All Checks Out - Stage 3 Implementation Handoff

## Purpose

This note records the Stage 3 work completed after `stage-2-implementation-handoff.md`.

Stage 3 corresponds to:

> Vendor-Owned Access Boundary

from the amended handoff and the clarified product-owner rule:

> The authority/association owns the scheme and tenant, but no one at the authority has default access to vendor due diligence data.

## Completed In Stage 3

### Removed Authority DDQ App Access

The `Due Diligence Packs` console app is no longer available to authority users in the app launcher.

It is now available only to vendor/participant contexts.

Changed in:

- `monorepo/apps/ui/src/data/console.ts`

### Removed Authority Search Exposure To Private Packs And Items

Global search no longer exposes:

- Due diligence packs.
- Due diligence items.

to authority users by default.

Vendor users can still search their own scoped packs and items.

Changed in:

- `monorepo/apps/ui/src/data/console.ts`

### Removed Authority Scoped Case Access

`getScopedCases(user)` now returns an empty list for authority users.

This prevents authority users from receiving private due diligence pack records through shared scoped-data helpers.

Changed in:

- `monorepo/apps/ui/src/data/console.ts`

### Guarded Direct Case Routes

Authority users who directly navigate to private pack routes are redirected back to scheme administration.

Guarded routes include:

- `/cases`
- `/cases/:caseId`
- `/cases/:caseId/tasks/:taskId`
- `/cases/tasks`
- `/cases/evidence`
- `/cases/stakeholder-preview`

Changed in:

- `monorepo/apps/ui/src/pages/ConsolePages.tsx`

### Removed Authority Review UI From Pack Detail

The old authority task-review branch was removed from the due diligence pack detail page.

That branch showed task responses, evidence metadata, and pass/fail review actions to authority users. It is no longer reachable or present in the page code.

Changed in:

- `monorepo/apps/ui/src/pages/ConsolePages.tsx`

### Removed Authority Links Into Vendor Private Packs

The authority vendor detail page no longer lists private due diligence packs with links into `/cases/:caseId`.

It now shows a boundary notice explaining that the authority can see vendor membership and aggregate progress, but cannot open vendor packs, answers, evidence metadata, or evidence files by default.

Changed in:

- `monorepo/apps/ui/src/pages/ConsolePages.tsx`

### Removed Authority-Managed Subscriber Grant Action

The authority subscriber detail page no longer has a `Grant access` action for granting a subscriber access to a vendor.

It now shows existing access relationships as read-only from the authority context and states that vendor due diligence access is granted by the vendor account, not by the authority.

Changed in:

- `monorepo/apps/ui/src/pages/ConsolePages.tsx`

## Files Changed

Stage 3 changed:

- `monorepo/apps/ui/src/data/console.ts`
- `monorepo/apps/ui/src/pages/ConsolePages.tsx`

This handover was added:

- `docs/stage-3-implementation-handoff.md`

## Verification Completed

The following commands passed:

```bash
pnpm run type-check
pnpm run ui:build
```

## Known Limitations After Stage 3

The authority no longer has default UI access to vendor due diligence pack/detail/item routes, but the access model is still transitional.

Known gaps:

- `StakeholderParticipantAccess` still exists and is not yet a first-class vendor-controlled `AccessGrant`.
- Seeded subscriber access still exists as static data rather than vendor-created grants.
- Vendor users do not yet have a full Access Grants management screen.
- Third-party helper/service-provider context is not implemented.
- Helper create/modify permissions are not implemented.
- Subscriber requests for additional information are not implemented.
- Vendor-of-vendor records are not first-class records yet.
- Some page copy still uses older internal labels such as participant, stakeholder, case, and task.
- Admin aggregate metrics still show derived progress counts for vendors; this is intended as high-level status, not answer/evidence visibility.

## Recommended Next Stage

The next agent should proceed with Stage 4:

> Vendor-Controlled Access Grants

Recommended Stage 4 goals:

- Introduce a first-class `AccessGrant` model or view model owned by the vendor/participant.
- Let vendor users grant subscriber read/review access.
- Prepare grant target types for subscribers, helpers/service providers, specific users, and explicit authority review if ever needed.
- Move existing seeded subscriber visibility from authority-like `StakeholderParticipantAccess` semantics toward vendor-controlled grants.
- Add a vendor-facing Access Grants page or section.
- Keep authority users read-only for access relationships unless an explicit delegated permission is introduced.

Recommended caution:

- Do not reintroduce authority default access to pack answers, evidence metadata, or item detail routes.
- Keep subscriber scoping based on active account context.
- Keep each change type-checked and buildable.
