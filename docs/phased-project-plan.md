# All Checks Out Azure Modernisation Plan

**Project:** All Checks Out  
**Starting point:** `azure02-deploy-website-to-azure`  
**Date:** 16 June 2026  
**Purpose:** Define a phased route from the current frontend-only Azure static website lesson into a production-shaped Azure application using ASP.NET Core, Azure SQL, Blob Storage, Microsoft Entra, AI document verification, GitHub Actions, separate environments, microservices, and microfrontends.

---

## 1. Executive Summary

The current `azure02` project is a strong early teaching milestone. It contains a React, TypeScript, Vite, Tailwind and shadcn-style frontend, deployed to Azure Blob static website hosting using Bicep and shell scripts. It deliberately has no backend, no database, no real authentication, and no real document storage.

The next step should **not** be to jump straight to microservices and microfrontends. The safest route is:

1. Split the current lesson into two clear repositories:
   - `azure02`: static website deployment without registered domains.
   - `azure03`: custom domain deployment to `www.all-checks-out.com`.
2. Add missing product foundations while the system is still simple:
   - Microsoft Entra login.
   - ASP.NET Core Web API.
   - Azure SQL Database.
   - Azure Blob Storage for uploaded documents.
   - AI-assisted document verification.
3. Harden deployment:
   - GitHub Actions.
   - testing and production environments.
   - separate Azure subscriptions or at least separate resource groups.
   - separate subdomains.
4. Only then split into bounded services and microfrontends.

The recommended architecture is therefore an **evolutionary architecture**:

```text
Current frontend-only lesson
        ↓
Clean static hosting lesson
        ↓
Custom domain lesson
        ↓
Single ASP.NET Core modular backend + Azure SQL + Blob Storage + Entra
        ↓
CI/CD + testing/prod environments
        ↓
Modular monolith with explicit bounded contexts
        ↓
Extract selected microservices only when the boundaries are proven
        ↓
Split UI into route-level microfrontends only when team/course boundaries justify it
```

---

## 2. Current Project Assessment

The uploaded project currently has this relevant structure:

```text
azure02-deploy-website-to-azure
├── README.md
├── docs
│   ├── database-entities.md
│   ├── functional-specification.md
│   └── technical-specification.md
└── monorepo
    ├── apps
    │   └── ui
    ├── infra
    │   └── main.bicep
    ├── scripts
    ├── package.json
    ├── pnpm-lock.yaml
    └── pnpm-workspace.yaml
```

The current implementation includes:

- React frontend.
- TypeScript.
- Vite.
- Tailwind CSS.
- shadcn-style UI primitives.
- React Router.
- pnpm workspaces.
- Bicep infrastructure.
- Azure Storage static website hosting.
- Shell scripts for deploy, upload, show URL and destroy.
- In-memory domain data.
- Demo sign-in.
- No backend API.
- No Azure SQL.
- No real file/document storage.
- No AI verification.
- No GitHub Actions.
- No production-grade authentication.

This is the right foundation for an Azure course, but the project should now be divided into clean, teachable phases.

---

## 3. Important Strategic Decisions

### 3.1 Do Not Start With Microservices

The domain is not yet stable enough to split into independent services. At this stage, premature microservices would create extra complexity in:

- authentication,
- authorization,
- database ownership,
- transactions,
- deployments,
- local development,
- testing,
- eventing,
- observability,
- documentation.

The better approach is:

1. Build a **modular ASP.NET Core backend** first.
2. Put clear module boundaries inside the codebase.
3. Use one Azure SQL database initially.
4. Make the module boundaries explicit.
5. Extract services later when the boundaries have proved themselves.

This gives the teaching benefit of proper architecture without forcing students into distributed-system complexity too early.

### 3.2 Do Not Start With Microfrontends

The UI is also not ready to split yet. The best first step is a single React app with clear route/module boundaries:

```text
apps/ui/src/features
├── auth
├── authority-admin
├── participants
├── stakeholders
├── cases
├── tasks
├── evidence
├── document-verification
└── system-admin
```

Later, these can become separate route applications. This is simpler to teach and much easier to test locally.

### 3.3 Keep pnpm Workspaces

The current pnpm workspace structure should be preserved. The future project should grow around it rather than replacing it.

Recommended long-term repository shape:

```text
all-checks-out
├── apps
│   ├── shell
│   ├── authority-admin
│   ├── participant-portal
│   ├── stakeholder-portal
│   └── system-admin
├── services
│   ├── api
│   ├── identity-service
│   ├── case-service
│   ├── evidence-service
│   ├── verification-service
│   └── notification-service
├── packages
│   ├── ui
│   ├── domain-contracts
│   ├── eslint-config
│   └── tsconfig
├── infra
├── scripts
├── docs
├── package.json
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

Do not create this full structure immediately. Grow into it phase by phase.

---

## 4. Repository Split: azure02 and azure03

### 4.1 `azure02` Target

`azure02` should become:

```text
azure02-deploy-website-to-azure
```

Purpose:

> Deploy the All Checks Out frontend to Azure Blob static website hosting without using a registered domain.

It should include:

- current React/Vite frontend,
- Bicep storage account,
- static website hosting,
- upload to `$web`,
- generated Azure static website endpoint,
- local build and preview,
- no registered domain,
- no DNS,
- no Front Door,
- no Azure CDN,
- no `all-checks-out.com` references,
- no production/custom-domain terminology.

The resulting lesson should answer one question:

> How do I build a Vite React app and deploy it to Azure Blob static website hosting?

### 4.2 What To Remove From `azure02`

Remove or rewrite anything that refers to:

- `all-checks-out.com`,
- `www.all-checks-out.com`,
- custom domains,
- DNS records,
- Azure DNS,
- Azure Front Door,
- Azure CDN,
- production domain migration,
- TLS certificates,
- domain aliases.

The `azure02` README should describe only the generated Azure static website URL, for example:

```text
https://<storage-account-name>.<zone>.web.core.windows.net
```

### 4.3 `azure03` Target

Create a new repository:

```text
azure03-custom-domain
```

Purpose:

> Migrate the Azure-hosted static website from the generated Azure Storage static website endpoint to `www.all-checks-out.com`.

This should be the phase that contains all domain-related work.

It should include:

- copied source from clean `azure02`,
- domain-specific Bicep changes,
- DNS documentation,
- external DNS provider notes if the domain is not hosted in Azure DNS,
- CNAME/TXT verification guidance,
- custom domain deployment scripts,
- decision record explaining the hosting choice,
- troubleshooting documentation,
- teardown guidance that does not accidentally destroy domain registrations.

### 4.4 Recommended Custom Domain Architecture for `azure03`

For a teaching course, there are two reasonable choices.

#### Option A: Azure Static Web Apps

Best if the aim is simple HTTPS custom domain support and GitHub-based deployment.

Pros:

- Very simple for React/Vite apps.
- Integrated GitHub deployment workflow.
- Custom domains are directly supported.
- Free TLS certificates for custom domains.
- Good developer experience.

Cons:

- Different hosting model from the current Blob static website lesson.
- Less useful if you specifically want to teach Storage + Front Door.

#### Option B: Azure Blob Static Website + Azure Front Door

Best if the aim is to teach production-style Azure edge architecture.

Pros:

- Keeps the storage static website model from `azure02`.
- Adds a realistic edge layer.
- Supports custom domains and managed TLS at the edge.
- More similar to the AWS S3 + CloudFront mental model.

Cons:

- More infrastructure.
- More moving parts.
- More expensive than a minimal static site.
- Harder for beginners.

### 4.5 Recommendation for This Course

Use this sequence:

```text
azure02: Blob static website only, no domain
azure03: Blob static website + Azure Front Door + www.all-checks-out.com
later: decide whether Static Web Apps is better for GitHub Actions teaching
```

Reason:

- `azure02` already teaches Azure Storage static hosting.
- `azure03` should naturally extend that lesson.
- Azure Front Door gives a clean production equivalent to CloudFront.
- The domain lesson stays separate and understandable.

---

## 5. Environment Strategy

### 5.1 Required Environments

You want:

```text
testing.all-checks-out.com
production.all-checks-out.com
www.all-checks-out.com
```

Recommended meaning:

```text
testing.all-checks-out.com      → testing environment
production.all-checks-out.com   → explicit production environment hostname
www.all-checks-out.com          → public production alias
```

The public production site should normally be:

```text
www.all-checks-out.com
```

`production.all-checks-out.com` can exist as an explicit operational alias, but public users should normally be sent to `www`.

### 5.2 Separate Azure Accounts?

In Azure, the closest equivalent of “separate AWS accounts” is usually **separate Azure subscriptions** under the same tenant.

Recommended setup:

```text
Microsoft Entra tenant
├── Azure subscription: all-checks-out-testing
└── Azure subscription: all-checks-out-production
```

This gives strong separation for:

- billing,
- access control,
- resource groups,
- service principals / federated credentials,
- blast radius,
- accidental deletion,
- production secrets.

For a course, you can start with separate resource groups in one subscription, but the target production architecture should be separate subscriptions.

### 5.3 Resource Naming

Use environment names everywhere.

```text
aco-testing-rg
aco-production-rg
aco-testing-app
aco-production-app
aco-testing-sql
aco-production-sql
aco-testing-storage
aco-production-storage
```

Avoid names like:

```text
azure02-static-website-rg
```

outside early lessons, because later the system is no longer just lesson 02.

### 5.4 Domain Routing

Recommended final routing:

```text
testing.all-checks-out.com
  → testing Front Door endpoint
  → testing static frontend origin
  → testing API origin

production.all-checks-out.com
  → production Front Door endpoint
  → production static frontend origin
  → production API origin

www.all-checks-out.com
  → production Front Door endpoint
```

Do not point testing and production hostnames at the same Front Door profile unless you are deliberately teaching shared edge infrastructure. Separate environments should be genuinely separate.

---

## 6. Target Production Architecture

### 6.1 Logical Architecture

```text
Browser
  |
  v
Azure Front Door
  |
  +--> Static frontend origin
  |
  +--> ASP.NET Core API origin
          |
          +--> Azure SQL Database
          |
          +--> Azure Blob Storage
          |
          +--> Azure AI Document Intelligence / Azure OpenAI
          |
          +--> Azure Queue Storage / Event Grid
          |
          +--> Application Insights
          |
          +--> Key Vault
```

### 6.2 Main Azure Services

| Concern | Recommended Azure Service |
|---|---|
| Frontend hosting | Azure Blob static website + Azure Front Door, or Azure Static Web Apps |
| Edge routing / TLS | Azure Front Door |
| API hosting | Azure App Service or Azure Container Apps |
| Backend framework | ASP.NET Core Web API |
| Database | Azure SQL Database |
| ORM | Entity Framework Core |
| Authentication | Microsoft Entra External ID |
| Authorization | ASP.NET Core policies and roles |
| Object storage | Azure Blob Storage |
| Secrets | Azure Key Vault |
| AI document extraction | Azure AI Document Intelligence |
| AI reasoning / verification | Azure OpenAI |
| Async work | Azure Queue Storage initially, later Service Bus if needed |
| Events | Event Grid for cross-service events |
| Observability | Application Insights and Azure Monitor |
| CI/CD | GitHub Actions with OIDC |
| Infrastructure | Bicep |

---

## 7. ASP.NET Core and Azure SQL Plan

### 7.1 Backend Architecture

Start with one ASP.NET Core Web API project:

```text
services/api
├── AllChecksOut.Api
├── AllChecksOut.Application
├── AllChecksOut.Domain
├── AllChecksOut.Infrastructure
└── AllChecksOut.Tests
```

This is a clean architecture / vertical slice style without being over-engineered.

Recommended structure:

```text
services/api/src
├── AllChecksOut.Api
│   ├── Controllers
│   ├── Auth
│   ├── Middleware
│   └── Program.cs
├── AllChecksOut.Application
│   ├── Authorities
│   ├── Participants
│   ├── Stakeholders
│   ├── Cases
│   ├── Tasks
│   ├── Evidence
│   └── Verification
├── AllChecksOut.Domain
│   ├── Entities
│   ├── ValueObjects
│   ├── Events
│   └── Rules
├── AllChecksOut.Infrastructure
│   ├── Data
│   ├── BlobStorage
│   ├── Identity
│   ├── Ai
│   └── Messaging
└── AllChecksOut.Tests
```

### 7.2 Controllers Architecture

Use modern ASP.NET Core controllers initially, because they are explicit and easier to teach than minimal APIs for a large business system.

Example controller groups:

```text
/api/authorities
/api/participants
/api/stakeholders
/api/case-templates
/api/cases
/api/tasks
/api/evidence
/api/document-verifications
/api/users
```

Use:

- controller classes,
- DTOs for requests/responses,
- route attributes,
- async methods,
- cancellation tokens,
- problem details,
- policy-based authorization,
- Entity Framework Core in application services rather than directly in controllers.

Avoid:

- putting business logic inside controllers,
- exposing EF entities directly from the API,
- sharing database models directly with the React app,
- returning anonymous object shapes from important endpoints.

### 7.3 Azure SQL Database

Start with one database:

```text
all-checks-out-testing-sqldb
all-checks-out-production-sqldb
```

Initial schemas:

```text
identity
core
casework
evidence
verification
audit
```

This gives internal modularity before physical microservice separation.

### 7.4 Entity Mapping

The current `database-entities.md` can become the first EF Core model.

Initial aggregate groupings:

| Aggregate / Area | Entities |
|---|---|
| System ownership | SystemOwner, SystemOwnerUser |
| Authority tenancy | Authority, AuthorityTerminology, AuthorityUser |
| Participants | Participant, ParticipantUser, ParticipantSupplier |
| Stakeholders | Stakeholder, StakeholderUser, StakeholderParticipantAccess |
| Agents | Agent, AgentUser |
| User accounts | UserAccount |
| Templates | TaskType, CaseTemplate, TemplateTask, CaseTemplateParticipant |
| Casework | Case, Task, StakeholderReview, RequestForInformation |
| Access control | AccessGrant |
| Evidence | EvidenceDocument, EvidenceBlob, EvidenceVersion |
| Verification | VerificationJob, VerificationFinding, VerificationDecision |

The current document does not yet define evidence and verification entities properly. Add them before implementing Blob Storage and AI.

### 7.5 Proposed New Evidence Entities

Add these to the domain model:

#### EvidenceDocument

```text
id
caseId
taskId
participantId
authorityId
uploadedByUserId
originalFileName
contentType
sizeBytes
blobContainerName
blobName
sha256Hash
status
createdAt
updatedAt
```

#### EvidenceDocumentVersion

```text
id
evidenceDocumentId
versionNumber
blobContainerName
blobName
sha256Hash
uploadedByUserId
createdAt
```

#### VerificationJob

```text
id
evidenceDocumentId
caseId
taskId
status
requestedByUserId
startedAt
completedAt
failureReason
createdAt
updatedAt
```

#### VerificationFinding

```text
id
verificationJobId
findingType
severity
summary
detail
pageNumber
confidenceScore
createdAt
```

#### VerificationDecision

```text
id
verificationJobId
decision
decidedByUserId
decisionNote
decidedAt
createdAt
```

---

## 8. Microsoft Entra Login Plan

### 8.1 Authentication Goal

Replace demo sign-in with real Microsoft Entra External ID login.

User types:

- system owner user,
- authority user,
- participant user,
- stakeholder user,
- agent user.

### 8.2 Frontend Authentication

The React app should use Microsoft Authentication Library for browser-based login.

The frontend should:

- redirect users to Microsoft login,
- receive ID/access tokens,
- store tokens according to MSAL guidance,
- call the API with bearer tokens,
- remove the current demo login selector,
- keep role/context switching only where the authenticated user genuinely has multiple contexts.

### 8.3 Backend Authentication

The ASP.NET Core API should:

- validate JWT bearer tokens,
- trust only configured issuer/audience values,
- map Entra object IDs to `UserAccount.entraObjectId`,
- load the user’s application roles from Azure SQL,
- enforce authorization using policies.

### 8.4 Authorization Model

Do not rely only on Entra groups or app roles. For this product, authorization is domain-specific and tenant-specific.

Use Entra for identity:

```text
Who is this person?
```

Use Azure SQL for application authorization:

```text
Which authority, participant, stakeholder or agent are they allowed to act for?
What can they do in that context?
```

---

## 9. Blob Storage Document Plan

### 9.1 Storage Goal

Uploaded evidence should be stored in Azure Blob Storage, not in Azure SQL.

Azure SQL should store metadata only:

- who uploaded it,
- which case/task it belongs to,
- blob location,
- file name,
- content type,
- size,
- hash,
- status,
- verification results.

### 9.2 Container Strategy

Use separate containers by environment and purpose.

Example:

```text
evidence-documents
verification-working-files
audit-exports
```

Avoid one container per tenant unless there is a strong operational reason. Tenant isolation should be enforced through:

- metadata in SQL,
- blob naming conventions,
- API authorization,
- private containers,
- managed identity access.

### 9.3 Blob Naming Strategy

Use non-guessable, structured blob names:

```text
authorities/{authorityId}/participants/{participantId}/cases/{caseId}/tasks/{taskId}/evidence/{evidenceDocumentId}/v{versionNumber}/{fileId}.pdf
```

Do not use original file names as blob names.

### 9.4 Upload Flow

Recommended flow:

```text
React UI
  ↓
POST /api/evidence/upload-requests
  ↓
API creates EvidenceDocument row and returns upload URL or accepts stream
  ↓
Browser uploads document or API streams to Blob Storage
  ↓
API finalizes metadata
  ↓
API queues VerificationJob
```

For an early teaching version, keep it simple and upload via the API. Later, introduce direct-to-Blob upload with short-lived SAS URLs if needed.

---

## 10. AI Document Verification Plan

### 10.1 Product Goal

When a participant uploads evidence, the system should use AI to help verify whether the uploaded document satisfies the task requirement.

Example:

```text
Task: Upload current cyber insurance certificate.
Document: PDF insurance certificate.
AI checks:
- Is this an insurance certificate?
- Is the named organisation correct?
- Is the insurer visible?
- Is the policy period visible?
- Is the expiry date in the future?
- Are there exclusions that matter?
- Does the coverage match the requested requirement?
```

### 10.2 Recommended AI Architecture

Use two steps:

```text
Document extraction
  → Azure AI Document Intelligence

Reasoned verification
  → Azure OpenAI or other approved LLM endpoint
```

Do not send raw documents blindly to an LLM if a structured extraction step can reduce the data needed.

### 10.3 Verification Flow

```text
1. Participant uploads evidence.
2. API stores file in Blob Storage.
3. API creates VerificationJob with status QUEUED.
4. Queue message is created.
5. Verification worker downloads the blob.
6. Worker extracts text and structure.
7. Worker calls AI verifier with task requirement + extracted content.
8. Worker stores findings and confidence scores.
9. User sees result: likely pass, likely fail, needs human review.
10. Authority or stakeholder can make final decision.
```

### 10.4 Important Product Rule

AI should assist verification, not silently make final legal/compliance decisions.

Recommended statuses:

```text
NOT_VERIFIED
QUEUED
PROCESSING
AI_PASSED
AI_FAILED
NEEDS_HUMAN_REVIEW
HUMAN_APPROVED
HUMAN_REJECTED
ERROR
```

### 10.5 Verification Boundaries

Keep AI verification in its own module from the start:

```text
AllChecksOut.Application.Verification
AllChecksOut.Infrastructure.Ai
```

Later it can become a separate `verification-service`.

---

## 11. GitHub Actions CI/CD Plan

### 11.1 Goal

The developer should be able to:

```text
1. Run locally.
2. Run tests locally.
3. Commit and push.
4. GitHub Actions builds, tests and deploys.
```

### 11.2 Authentication From GitHub To Azure

Use GitHub Actions OIDC rather than long-lived Azure client secrets.

Each environment should have its own federated identity:

```text
GitHub environment: testing
  → Azure identity allowed to deploy only testing resources

GitHub environment: production
  → Azure identity allowed to deploy only production resources
```

This avoids storing long-lived Azure credentials in GitHub secrets.

### 11.3 Workflow Structure

Recommended workflows:

```text
.github/workflows
├── pull-request.yml
├── deploy-testing.yml
└── deploy-production.yml
```

#### Pull Request Workflow

Runs on pull requests:

```text
pnpm install
pnpm type-check
pnpm test
pnpm build
 dotnet restore
 dotnet build
 dotnet test
 bicep build
```

No deployment.

#### Testing Deployment Workflow

Runs on push to `main`:

```text
build frontend
build backend
run tests
deploy Bicep to testing subscription/resource group
deploy API to testing
upload frontend to testing static host
run smoke tests
```

#### Production Deployment Workflow

Runs on release tag or manual approval:

```text
build immutable artifacts
reuse tested artifacts where possible
deploy Bicep to production
run migrations deliberately
deploy API
upload frontend
run smoke tests
```

Production should require manual approval in GitHub Environments.

### 11.4 Database Migrations

Do not let production database migrations happen accidentally.

Recommended sequence:

```text
1. Generate EF Core migration in development.
2. Review migration file.
3. Run migration automatically in testing.
4. For production, run migration as a controlled pipeline step.
5. Keep rollback notes for destructive changes.
```

---

## 12. Microservices Plan

### 12.1 Recommended Service Boundaries

Do not split by database table. Split by business capability.

Potential future services:

| Service | Responsibility |
|---|---|
| Identity/Profile Service | User accounts, Entra mapping, application memberships |
| Authority Service | Authorities, terminology, authority configuration |
| Participant Service | Participants, participant users, participant suppliers |
| Stakeholder Service | Stakeholders, access grants, stakeholder visibility |
| Casework Service | Case templates, cases, tasks, reviews, RFIs |
| Evidence Service | Evidence metadata, Blob Storage access, upload/download flows |
| Verification Service | AI extraction, verification jobs, findings, decisions |
| Notification Service | Emails, reminders, task nudges, event-driven notifications |
| Audit Service | Audit trail, compliance exports, immutable event history |

### 12.2 First Extraction Candidate

The best first true microservice is likely:

```text
Verification Service
```

Why:

- It is naturally asynchronous.
- It calls external AI services.
- It may have different scaling needs.
- It can fail/retry independently.
- It is less transactional than case creation.
- It can communicate via queue messages and persisted results.

### 12.3 Services Not To Extract First

Do not extract these first:

- Authority Service.
- Participant Service.
- Stakeholder Service.
- Casework Service.

These are tightly connected early on and will cause distributed transaction problems if split too soon.

### 12.4 Intermediate Modular Monolith Boundary

Before extraction, use modules inside the ASP.NET Core solution:

```text
Modules
├── Identity
├── AuthorityManagement
├── ParticipantManagement
├── StakeholderManagement
├── Casework
├── Evidence
├── Verification
├── Notifications
└── Audit
```

Each module should own:

- commands,
- queries,
- DTOs,
- validators,
- authorization policies,
- domain rules,
- tests.

The application can still deploy as one API until the course is ready to teach extraction.

### 12.5 Event Contracts

Use integration events only at module/service boundaries.

Examples:

```text
ParticipantCreated
CaseCreated
TaskSubmitted
EvidenceUploaded
VerificationRequested
VerificationCompleted
TaskApproved
TaskRejected
RequestForInformationCreated
```

Do not build an event-driven system before the core database model is working.

---

## 13. Microfrontends Plan

### 13.1 Recommended MFE Boundaries

The UI should eventually split by user journey, not by component type.

Recommended future microfrontends:

| Microfrontend | Users | Responsibility |
|---|---|---|
| Shell | All users | Authentication, layout, navigation, app switcher, shared route loading |
| Authority Admin | Authority users | Participants, stakeholders, templates, users, task types |
| Participant Portal | Participant users | Cases, tasks, evidence upload, RFIs |
| Stakeholder Portal | Stakeholder users | Visible participants, reviews, evidence checks, RFIs |
| Agent Portal | Agent users | Work assigned to agents across participants |
| System Admin | System owner users | Authorities, global task types, system configuration |

### 13.2 Do Not Split Too Early

Start with one app:

```text
apps/ui
```

Refactor internally first:

```text
apps/ui/src/features
├── shell
├── authority-admin
├── participant-portal
├── stakeholder-portal
├── agent-portal
└── system-admin
```

Only later split into:

```text
apps/shell
apps/authority-admin
apps/participant-portal
apps/stakeholder-portal
apps/agent-portal
apps/system-admin
packages/ui
packages/auth
packages/api-client
packages/domain-contracts
```

### 13.3 Preferred MFE Style

For this course, prefer **route-level independent apps** over complex runtime module federation at first.

This means:

```text
www.all-checks-out.com/authority/*     → Authority Admin app
www.all-checks-out.com/participant/*   → Participant Portal app
www.all-checks-out.com/stakeholder/*   → Stakeholder Portal app
www.all-checks-out.com/system/*        → System Admin app
```

This is easier to reason about, test and deploy.

Module Federation can be introduced later only if there is a strong reason.

---

## 14. Phased Delivery Plan

## Phase 0 — Clean The Current Repository

### Goal

Prepare the current uploaded source so it can become the clean `azure02` repository.

### Work

- Remove `.git` from the distributable archive if this is being handed to students.
- Remove `.DS_Store` files.
- Keep pnpm workspace structure.
- Confirm all commands run from repository root.
- Confirm `pnpm install`, `pnpm run type-check`, `pnpm run ui:build`, `pnpm run ui:preview` work.
- Confirm deploy scripts do not require domain settings.

### Output

```text
azure02-deploy-website-to-azure
```

### Done When

- The app deploys to the Azure-generated static website URL.
- The README contains no custom domain instructions.
- The repo teaches one clear thing: deploy a static Vite React app to Azure Blob static website hosting.

---

## Phase 1 — Create `azure03-custom-domain`

### Goal

Create the next repository that migrates the static site to `www.all-checks-out.com`.

### Work

- Copy clean `azure02` source.
- Add domain architecture documentation.
- Add Azure Front Door Bicep or a clearly documented manual first version.
- Add DNS record documentation.
- Add scripts to show the Front Door URL and custom domain status.
- Add notes for external DNS provider configuration.
- Add troubleshooting section for DNS propagation and certificate validation.

### Output

```text
azure03-custom-domain
```

### Done When

- `www.all-checks-out.com` serves the current frontend.
- The old generated Azure Storage endpoint still exists but is no longer the public teaching target.
- The README clearly explains the move from generated Azure URL to custom domain.

---

## Phase 2 — Add ASP.NET Core API Skeleton

### Goal

Introduce the backend without changing the frontend behaviour too much.

### Work

- Add `services/api`.
- Add ASP.NET Core Web API.
- Add `/health` endpoint.
- Add CORS for local frontend.
- Add typed configuration.
- Add Swagger/OpenAPI for development.
- Add Application Insights later or as optional.
- Add local development scripts.

### Output Structure

```text
monorepo
├── apps/ui
├── services/api
├── infra
└── scripts
```

### Done When

- React app can call `/api/health` locally.
- API builds and tests locally.
- API can be deployed to Azure App Service or Container Apps.

---

## Phase 3 — Add Azure SQL And EF Core

### Goal

Move from in-memory TypeScript data to Azure SQL-backed data through ASP.NET Core.

### Work

- Add EF Core.
- Add SQL Server provider.
- Add local SQL Server container or local SQL Edge alternative if suitable.
- Add migrations.
- Map existing entities.
- Add seed data equivalent to the current frontend fixtures.
- Replace frontend fixture reads with API calls gradually.

### Done When

- Cases, participants, stakeholders, templates and tasks load from API.
- The database can be recreated from migrations.
- The frontend no longer depends on `console.ts` as source of truth.

---

## Phase 4 — Add Microsoft Entra Login

### Goal

Replace demo sign-in with real login.

### Work

- Configure Entra External ID.
- Register frontend app.
- Register API app.
- Add MSAL to frontend.
- Add JWT bearer authentication to API.
- Map Entra users to `UserAccount` rows.
- Add policy-based authorization.
- Add user-context endpoint:

```text
GET /api/me
```

### Done When

- A real user can sign in.
- The API rejects unauthenticated requests.
- The API enforces tenant and role boundaries.
- Demo login is removed or retained only behind a development flag.

---

## Phase 5 — Add Blob Storage Evidence Uploads

### Goal

Store uploaded evidence documents in Azure Blob Storage.

### Work

- Add private Blob container.
- Add API upload endpoint.
- Add evidence metadata tables.
- Add upload UI.
- Add download/view endpoint.
- Add hash calculation.
- Add content-type and file-size validation.
- Add authorization checks.

### Done When

- Participant uploads a real file.
- File is stored in Blob Storage.
- Metadata is stored in Azure SQL.
- Authorized users can view/download it.
- Unauthorized users cannot access it.

---

## Phase 6 — Add AI Verification

### Goal

Use AI to assess whether uploaded evidence satisfies task requirements.

### Work

- Add verification entities.
- Add queue for verification jobs.
- Add verification worker.
- Add document text extraction.
- Add AI verification prompt templates.
- Store findings.
- Display result in task screen.
- Add human review workflow.

### Done When

- Uploading evidence creates a verification job.
- The job runs asynchronously.
- Findings are visible in the UI.
- Human users remain responsible for final approval/rejection.

---

## Phase 7 — Add GitHub Actions For Testing Environment

### Goal

Push to GitHub and deploy automatically to testing.

### Work

- Add GitHub Actions workflow.
- Add OIDC federated credential for testing.
- Add Bicep deployment step.
- Add frontend build/upload.
- Add API deployment.
- Add smoke test.
- Add testing environment variables.

### Done When

- Push to `main` deploys to `testing.all-checks-out.com`.
- Secrets are not committed.
- Long-lived Azure credentials are not stored in GitHub.

---

## Phase 8 — Add Production Environment

### Goal

Deploy production separately and safely.

### Work

- Create production subscription or resource group.
- Add production federated credential.
- Add GitHub protected environment.
- Add manual approval.
- Add production domain routing.
- Add production database.
- Add production storage.
- Add production Key Vault.

### Done When

- Testing and production are separate.
- `testing.all-checks-out.com` deploys automatically.
- `www.all-checks-out.com` deploys only after approval.
- `production.all-checks-out.com` aliases to the same production environment as `www`.

---

## Phase 9 — Modularise Backend Internally

### Goal

Prepare for microservices without extracting anything yet.

### Work

- Separate application modules.
- Give each module its own command/query handlers.
- Add module-level tests.
- Add internal event abstractions.
- Add clear ownership of tables.
- Add architecture decision records.

### Done When

- The codebase has visible service boundaries.
- Teams could work on separate modules.
- There is still one deployable backend.

---

## Phase 10 — Extract Verification Service

### Goal

Create the first real microservice.

### Work

- Move verification worker to separate service.
- Use queue/event input.
- Keep verification tables either owned by verification service or accessed through clear contracts.
- Add independent deployment.
- Add service-specific Application Insights.

### Done When

- API queues verification work.
- Verification service processes work independently.
- API reads verification results through a controlled boundary.

---

## Phase 11 — Prepare UI For Microfrontends

### Goal

Create clear UI boundaries before splitting apps.

### Work

- Refactor `apps/ui/src/features` by user journey.
- Extract shared UI components to `packages/ui`.
- Extract API client to `packages/api-client`.
- Extract auth helpers to `packages/auth`.
- Extract shared types to `packages/domain-contracts`.

### Done When

- UI features are cleanly separated.
- Shared components are not copied between features.
- Each feature could become its own app later.

---

## Phase 12 — Split Route-Level Microfrontends

### Goal

Split the UI into independently deployable route apps.

### Work

Create:

```text
apps/shell
apps/authority-admin
apps/participant-portal
apps/stakeholder-portal
apps/system-admin
```

Route through Front Door:

```text
/authority/*     → authority-admin
/participant/*   → participant-portal
/stakeholder/*   → stakeholder-portal
/system/*        → system-admin
```

### Done When

- Each app builds independently.
- Each app deploys independently.
- Shared UI package provides visual consistency.
- Shell handles authentication and top-level navigation.

---

## 15. Suggested Course Repository Sequence

Recommended course repos:

```text
azure01-getting-started
azure02-deploy-website-to-azure
azure03-custom-domain
azure04-aspnet-core-api
azure05-connect-ui-to-api
azure06-azure-sql-ef-core
azure07-entra-login
azure08-blob-storage-evidence
azure09-ai-document-verification
azure10-github-actions-testing
azure11-production-environment
azure12-modular-backend
azure13-first-microservice
azure14-ui-modularisation
azure15-microfrontends
```

This sequence is long, but each step has a clear teaching purpose.

---

## 16. Immediate Action List

### First: Fix `azure02`

1. Rename/confirm repo as `azure02-deploy-website-to-azure`.
2. Remove domain material.
3. Remove `.DS_Store` and accidental local files.
4. Confirm pnpm workspace scripts.
5. Confirm deployment to generated Azure URL.
6. Update README and docs.
7. Zip or publish the clean repo.

### Second: Create `azure03`

1. Copy clean `azure02`.
2. Add Front Door/domain infrastructure.
3. Add `www.all-checks-out.com` docs.
4. Add DNS setup section.
5. Add teardown warnings.
6. Deploy and verify.

### Third: Decide API hosting

Recommended default:

```text
Azure App Service for ASP.NET Core API
```

Reason:

- easiest for students,
- familiar hosting model,
- good GitHub Actions support,
- works well with managed identity,
- simpler than Kubernetes or Container Apps.

Use Container Apps later if the course needs containerised microservices.

### Fourth: Start the Backend

Add `azure04-aspnet-core-api` with only:

- health endpoint,
- CORS,
- local run,
- deploy to Azure,
- UI calls API health endpoint.

Do not add SQL, Entra, Blob Storage and AI all at once.

---

## 17. Key Risks

### Risk: Too Much Architecture Too Early

Mitigation:

- teach one architectural change per repo,
- keep each lesson deployable,
- keep local development working.

### Risk: Microservices Before Boundaries Are Known

Mitigation:

- build modular monolith first,
- extract verification service first,
- avoid distributed transactions.

### Risk: Authentication Complexity Overwhelms The Course

Mitigation:

- add API before Entra,
- add Entra in its own repo,
- keep user-context endpoint simple.

### Risk: AI Verification Becomes Legally Misleading

Mitigation:

- present AI as assistance,
- keep human final review,
- store confidence and findings,
- record who made final decision.

### Risk: Testing And Production Accidentally Share Resources

Mitigation:

- separate subscriptions if possible,
- separate resource groups at minimum,
- separate Key Vaults,
- separate databases,
- separate storage accounts,
- separate GitHub environments.

---

## 18. Architecture Decision Records To Add

Add these ADRs as the project evolves:

```text
docs/adr/0001-use-pnpm-workspaces.md
docs/adr/0002-use-bicep-for-infrastructure.md
docs/adr/0003-use-blob-static-website-for-azure02.md
docs/adr/0004-use-front-door-for-custom-domain.md
docs/adr/0005-use-aspnet-core-controllers.md
docs/adr/0006-use-azure-sql-and-ef-core.md
docs/adr/0007-use-entra-external-id.md
docs/adr/0008-store-documents-in-blob-storage.md
docs/adr/0009-use-ai-as-assisted-verification.md
docs/adr/0010-use-github-actions-oidc.md
docs/adr/0011-start-with-modular-monolith.md
docs/adr/0012-extract-verification-service-first.md
docs/adr/0013-use-route-level-microfrontends.md
```

---

## 19. Documentation Needed Per Repository

Each repo should contain:

```text
README.md
```

With:

- what this lesson adds,
- architecture diagram,
- prerequisites,
- local run,
- local test,
- deploy,
- verify,
- teardown,
- troubleshooting.

Also add:

```text
docs/architecture.md
docs/commands.md
docs/troubleshooting.md
docs/security-notes.md
```

For later repos add:

```text
docs/environment-setup.md
docs/github-actions.md
docs/database.md
docs/authentication.md
docs/blob-storage.md
docs/ai-verification.md
docs/domain-model.md
docs/api-contracts.md
```

---

## 20. External References Checked

The following current Microsoft/GitHub documentation areas were checked while preparing this plan:

- Azure Blob Storage static website hosting and custom domain limitations.
- Azure Storage custom domain mapping.
- Azure Static Web Apps custom domains and managed certificates.
- Entity Framework Core and SQL Server/Azure SQL provider guidance.
- GitHub Actions OIDC authentication to Azure.

Relevant documentation URLs:

```text
https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website
https://learn.microsoft.com/en-us/azure/storage/blobs/storage-custom-domain-name
https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain
https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain-external
https://learn.microsoft.com/en-us/ef/core/
https://learn.microsoft.com/en-us/ef/core/providers/sql-server/
https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure-openid-connect
https://docs.github.com/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure
```

---

## 21. Final Recommendation

The best plan is:

```text
1. Make azure02 clean and domain-free.
2. Create azure03 for www.all-checks-out.com.
3. Add ASP.NET Core API.
4. Add Azure SQL with EF Core.
5. Add Entra login.
6. Add Blob Storage evidence uploads.
7. Add AI verification.
8. Add GitHub Actions testing deployment.
9. Add production deployment.
10. Modularise backend.
11. Extract verification service first.
12. Modularise UI.
13. Split route-level microfrontends.
```

This gives you a course and project that grows naturally from simple deployment to serious production architecture without losing students or making the code unmaintainable.
