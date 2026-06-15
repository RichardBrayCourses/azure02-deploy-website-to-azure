# All Checks Out - Stage 5 Implementation Handoff

## Purpose

This note records the Stage 5 work completed after `stage-4-implementation-handoff.md`.

Stage 5 corresponds to:

> Due Diligence Pack Workflow

from the amended due diligence change plan.

## Completed In Stage 5

### Added Subscriber-Owned Review State

The in-memory domain now includes a `SubscriberReview` model scoped to a subscriber organisation and a visible DDQ pack.

The model records:

- Subscriber/stakeholder organisation.
- Due diligence pack.
- Subscriber review status.
- Subscriber note.
- Reviewing user.
- Review timestamp.

Changed in:

- `monorepo/apps/ui/src/data/console.ts`

### Added Subscriber Review Command

The in-memory database now supports:

- `getSubscriberReview`
- `upsertSubscriberReview`

`upsertSubscriberReview` validates that the subscriber has an active vendor access grant for the vendor that owns the pack before the review can be saved.

Changed in:

- `monorepo/apps/ui/src/data/console.ts`

### Seeded Subscriber Reviews

Seeded review state now exists for selected subscriber/vendor pack combinations, including:

- Harrington Financial Group reviewing Northstar Cloud Platforms.
- Harrington Financial Group waiting on Cobalt Workflow Systems.
- Mercury Retail PLC reviewing Cobalt Workflow Systems.
- Mercury Retail PLC requesting more information from Pinebridge Data Exchange.

Changed in:

- `monorepo/apps/ui/src/data/console.ts`

### Added Subscriber Review UI

Subscriber users can now open a granted DDQ pack and maintain their own review outcome and note.

The subscriber can set review status to:

- Not reviewed.
- In review.
- Approved.
- More information requested.

This updates subscriber-owned review state only. It does not modify vendor DDQ answers, evidence metadata, or pack item data.

Changed in:

- `monorepo/apps/ui/src/pages/ConsolePages.tsx`

### Reframed Subscriber Portal Vocabulary

The subscriber portal now uses the primary scenario vocabulary more consistently:

- Stakeholder Portal -> Subscriber Portal.
- Participant -> Vendor.
- Case -> DDQ pack / due diligence pack.
- Task -> Due diligence item.
- Visible outcome -> Subscriber review or vendor pack outcome where appropriate.

Changed in:

- `monorepo/apps/ui/src/pages/ConsolePages.tsx`

### Reframed Vendor Workspace Vocabulary

The vendor-facing pack workflow now uses DDQ pack and due diligence item language on:

- Due diligence pack list.
- Pack detail page.
- Due diligence item workbench.

Vendor users can still:

- Update item responses.
- Upload evidence metadata.
- Submit items.
- Submit packs.

Changed in:

- `monorepo/apps/ui/src/pages/ConsolePages.tsx`

## Files Changed

Stage 5 changed:

- `monorepo/apps/ui/src/data/console.ts`
- `monorepo/apps/ui/src/pages/ConsolePages.tsx`

This handover was added:

- `docs/stage-5-implementation-handoff.md`

## Verification Completed

The following commands passed:

```bash
pnpm run type-check
pnpm run ui:build
```

## Known Limitations After Stage 5

The pack workflow now behaves more like vendor due diligence, but the model is still frontend-only and transitional.

Known gaps:

- Helper/service-provider context sign-in is still not implemented.
- Helper create/edit permissions are modelled through grants but not yet connected to a helper workspace.
- Subscriber "more information requested" is review state, not a first-class request-for-information workflow.
- Request assignment, response, and status history are not implemented.
- Subscriber review state is pack-level only, not item-level.
- Grant data scopes are still mostly workspace-wide in the UI.
- Some authority admin pages still use older internal labels such as participant, stakeholder, case, and task.
- `StakeholderParticipantAccess` still exists as a compatibility model.

## Recommended Next Stage

The next agent should proceed with Stage 6:

> Requests For Information

Recommended Stage 6 goals:

- Add a first-class request-for-information model.
- Let subscribers create requests from a granted DDQ pack or due diligence item.
- Let vendors see open requests in their workspace.
- Let vendors respond to requests.
- Keep request visibility scoped to the requesting subscriber and owning vendor.
- Keep authority users out of private vendor answers and evidence by default.

Recommended caution:

- Do not treat subscriber review notes as the long-term request model.
- Do not allow subscriber requests to modify vendor-owned DDQ item responses directly.
- Keep helper/service-provider edit behavior behind explicit grant permission checks when helper context is eventually added.
