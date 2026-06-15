# All Checks Out - Stage 2 Implementation Handoff

## Purpose

This note records the Stage 2 work completed after `stage-1-implementation-handoff.md`.

Stage 2 corresponds to:

> Login, Authority Context, And Account Switching

from `vendor-owned-due-diligence-change-plan.md`.

## Completed In Stage 2

### Identity-First Demo Sign-In

The demo sign-in flow now starts by selecting a user identity.

After a user is selected, the UI shows the account contexts available to that identity. Selecting a context signs the user into that active authority/account context.

This replaces the previous flow where the demo first selected:

- Association.
- Role.
- Vendor/subscriber target.
- User.

### Active Account Context In Auth State

`AuthenticatedUser` now stores explicit active context fields:

- `accountContextId`
- `accountContextType`
- `accountContextEntityId`
- `accountContextName`
- `membershipRole`
- `stakeholderId`

Existing compatibility fields remain:

- `role`
- `authorityId`
- `participantId`

This keeps the current route and page logic working while starting the migration away from the one-user-kind assumption.

### Account Context View Models

The UI data layer now builds separate view models for:

- `UserIdentity`
- `AccountContext`

The new selectors are:

- `getAccountContextsForUser(userAccountId)`
- `getAccountContext(id)`
- `getUserIdentity(id)`

These sit alongside the existing `authenticatableUsers` view model so older pages can keep working.

### Multi-Context Demo User

A new seeded user was added:

- `Nadia Cole`
- `nadia.cole@portfolio.example`

Nadia has two memberships:

- Vendor admin for `Cobalt Workflow Systems`.
- Subscriber member for `Sentinel GRC Advisory`.

This gives the app a concrete demo of one login identity switching between account contexts.

### Removed Runtime User-Kind Exclusivity Enforcement

The in-memory database no longer throws when one user account has memberships across more than one context type.

Important limitation:

- `UserAccount.userKind` still exists in the DTO and seed data.
- Create-user flows still create a user account with one `userKind`.
- Some admin tables still display `userKind`.

The enforcement has been removed, but the deeper model migration is still pending.

### Header Account Switching

The account menu now shows:

- Active authority.
- Active context type.
- Active context name.
- A `Switch context` section when the signed-in user has more than one context.

Switching context updates auth state and navigates to the default route for the selected context:

- Association -> `/admin`
- Vendor -> `/cases`
- Subscriber -> `/stakeholder`

### Stakeholder Scoping Uses Active Context

Stakeholder participant scoping now prefers the active `stakeholderId`/context entity over looking up the first matching membership for a user.

This matters for multi-context users because a user may have more than one membership record.

## Critical Product Rule

The product-owner rule is:

> The authority/association owns the scheme and tenant, but no one at the authority has default access to vendor due diligence data.

In this context, "association" means the authority.

The vendor owns and manages its own due diligence data. Subscribers can review that data only when the vendor grants access. Third-party service providers, such as lawyers or outsourced compliance firms, can review, create, or modify vendor data only when the vendor grants delegated access.

This rule is not fully enforced yet. The current UI still allows `authority-admin` users to reach some due-diligence-pack/case routes inherited from the older model. That should be treated as the highest-priority behavioral correction before further polish.

## Files Changed

Stage 2 changed:

- `monorepo/apps/ui/src/context/AuthContext.tsx`
- `monorepo/apps/ui/src/data/console.ts`
- `monorepo/apps/ui/src/pages/SignInPage.tsx`
- `monorepo/apps/ui/src/components/Header.tsx`

This handover was added:

- `docs/stage-2-implementation-handoff.md`

## Verification Completed

The following commands passed:

```bash
pnpm run type-check
pnpm run ui:build
```

## Known Limitations After Stage 2

The app now supports a multi-context login demo, but several deeper migrations remain.

Known gaps:

- Authority users still have too much default visibility into due-diligence-pack routes.
- `UserAccount.userKind` still exists and appears in some admin views.
- Membership roles are still only `ADMIN` and `MEMBER`.
- Third-party helper/service-provider context is not implemented.
- Active terminology is still mostly hard-coded rather than read from an authority terminology object.
- Route protection is still role-based and uses the old `authority-admin` / `participant` / `stakeholder` role names.
- Many pages still contain old internal vocabulary such as participant, stakeholder, case, and task.
- Account switching only handles memberships, not delegated helper grants.
- The auth state is still frontend-only local storage.

## Recommended Next Stage

The next agent should proceed with Stage 3:

> Vendor-Owned Access Boundary

Recommended Stage 3 goals:

- Remove default authority access to vendor due diligence pack detail and item/evidence detail routes.
- Keep authority access to scheme administration, vendor/subscriber records, users, task types, and DDQ template configuration.
- Decide what authority users can see at aggregate level without exposing private vendor answers or evidence.
- Ensure global search and app launcher do not surface private vendor due diligence records to authority users by default.
- Keep vendor users able to manage their own due diligence packs.
- Keep subscriber users able to review only vendor data granted to their subscriber context.
- Add or prepare a first-class access-grant shape that is controlled by vendors rather than by the authority.

Recommended caution:

- Avoid broad mechanical replacement in `ConsolePages.tsx`.
- Keep existing route behavior buildable after each small set of edits.
- Be careful with stakeholder/subscriber scoping for multi-context users.

After the access boundary is enforced, the next suitable stage is:

> Configurable Authority Terminology And Deeper Vocabulary Pass

That later stage should add an authority terminology object, create small terminology helper functions, carefully update deeper page copy, and replace visible `userKind` labels with membership/account-context language.
