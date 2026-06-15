# All Checks Out - Phased Implementation Plan

## Purpose

This plan aligns the All Checks Out application with the Azure course sequence.

The first phase was system setup. This repository is the second phase: deploying the initial UI website to Azure. Later phases follow the Azure course sections listed in `/Users/richardbray/src/141-course-portal/src/data/courses.json`.

## Phase 1 - System Setup

- Course module:
  - `azure01`
- Title:
  - Introduction
- Repository:
  - `azure01-introduction`
- Goal:
  - Prepare the Azure development environment.
  - Establish the course architecture.
  - Introduce the monorepo shape and project direction.
- Tooling:
  - Chrome
  - Node.js
  - Git
  - Visual Studio Code
  - pnpm
  - .NET SDK
  - Azure CLI
  - Bicep
- Outcomes:
  - Developer machine ready for Azure development.
  - Azure CLI authentication understood.
  - Course progression understood.
  - Cloud-native target architecture introduced.

## Phase 2 - Initial UI Website Deployment

- Course module:
  - `azure02`
- Title:
  - Azure Blob Static Website Hosting
- Repository:
  - `azure02-deploy-website-to-azure`
- Goal:
  - Build the first usable frontend.
  - Deploy it to Azure Blob static website hosting.
  - Teach the first repeatable Azure deployment flow.
- Current implementation:
  - React and TypeScript Vite application.
  - CaseFlow Console UI.
  - Role-scoped demo sign-in.
  - Authority, Participant, and Stakeholder experiences.
  - In-memory All Checks Out domain model.
  - Administration hub.
  - Participant administration.
  - Stakeholder administration.
  - Case template administration.
  - Generated case views.
  - Participant task workbench.
  - Authority review workflow.
  - Stakeholder read-only portal.
  - Bicep storage account template.
  - Azure CLI deployment scripts.
  - Static website upload scripts.
- Azure services:
  - Azure Storage
  - Azure Blob static website hosting
  - Resource groups
  - Bicep deployments
- Acceptance:
  - `pnpm run type-check` passes.
  - `pnpm run ui:build` passes.
  - `pnpm run infra:deploy` provisions hosting.
  - `pnpm run deploy-website` uploads the built UI.
  - `pnpm run ui:url` prints the live static website endpoint.
  - SPA routes load from Azure through `index.html` fallback.
- Remaining within this phase:
  - Add automated tests for the in-memory domain commands.
  - Consider filling task type and user administration placeholders.
  - Keep backend, real auth, and database work for later phases.

## Phase 3 - API Server

- Course module:
  - `azure03`
- Title:
  - API Server using ASP.NET Core Web API
- Repository:
  - `azure03-deploy-api-server`
- Goal:
  - Add a production-ready ASP.NET Core Web API.
  - Start moving business behavior behind HTTP endpoints.
- Planned work:
  - Create ASP.NET Core Web API project.
  - Add C# domain/service structure.
  - Add dependency injection.
  - Add controller or minimal API endpoints.
  - Add health endpoint.
  - Add local API development workflow.
  - Add Azure-hosted API deployment workflow.
  - Connect frontend to API for read operations.
- All Checks Out focus:
  - Expose authorities.
  - Expose participants.
  - Expose stakeholders.
  - Expose case templates.
  - Expose cases and tasks.
  - Keep write operations conservative until persistence exists.

## Phase 4 - Full Stack Frontend, API, and Blob Storage

- Course module:
  - `azure04`
- Title:
  - Full Stack: React, ASP.NET Core and Azure Blob Storage
- Repository:
  - `azure04-full-stack`
- Goal:
  - Connect React frontend and ASP.NET Core API into a full-stack application.
  - Introduce real Blob Storage use for uploaded files.
- Planned work:
  - Add API-backed frontend data access.
  - Replace selected in-memory reads with API calls.
  - Add file upload endpoints.
  - Store evidence files in Azure Blob Storage.
  - Store evidence metadata through the API.
  - Add upload progress and error states.
- All Checks Out focus:
  - Participant evidence upload becomes real storage.
  - Evidence metadata remains attached to case tasks.
  - Authority and stakeholder views read evidence metadata from the API.

## Phase 5 - Identity and API Security

- Course module:
  - `azure05`
- Title:
  - Microsoft Entra External ID Authentication and API Security
- Repository:
  - `azure05-identity-security`
- Goal:
  - Replace demo sign-in with Microsoft Entra External ID.
  - Secure APIs with JWT authentication.
- Planned work:
  - Configure Microsoft Entra External ID.
  - Add frontend login flow.
  - Add token acquisition.
  - Secure ASP.NET Core API endpoints.
  - Map Entra identity to application user account.
  - Enforce authority, participant, and stakeholder scoping server-side.
- All Checks Out focus:
  - User kind becomes server-enforced.
  - Authority membership becomes server-enforced.
  - Participant case access becomes server-enforced.
  - Stakeholder approved visibility becomes server-enforced.
  - Demo login can be removed or kept only as a local fixture mode.

## Phase 6 - Azure SQL Database and EF Core

- Course module:
  - `azure06`
- Title:
  - Azure SQL Database Serverless, Entity Framework Core and User Registration
- Repository:
  - `azure06-sql-database`
- Goal:
  - Persist the domain model in Azure SQL Database.
  - Use Entity Framework Core and migrations.
- Planned work:
  - Create Azure SQL Database Serverless infrastructure.
  - Add EF Core DbContext.
  - Add entity mappings.
  - Add migrations.
  - Persist authorities, participants, stakeholders, users, templates, cases, and tasks.
  - Add user registration or invite persistence.
  - Replace in-memory command state with database-backed services.
- All Checks Out focus:
  - Implement tenant boundary with authority IDs.
  - Persist stakeholder access.
  - Persist generated cases.
  - Persist task responses.
  - Persist evidence metadata.
  - Preserve task withdrawal and post-publication task additions.

## Phase 7 - Historic Workflow and Analytics Microservice

- Course module:
  - `azure07`
- Title:
  - Historic Likes Microservice: Event Grid and Queue Storage
- Repository:
  - `azure07-historic-likes-microservice`
- Goal:
  - Introduce event-driven processing with Event Grid and Queue Storage.
  - Build a separately owned analytics or history capability.
- Planned work:
  - Publish domain events from core case actions.
  - Subscribe to events through Event Grid.
  - Process asynchronous work through Azure Queue Storage.
  - Build a read model for historic activity.
- All Checks Out focus:
  - Replace UI-side mock activity with persisted audit events.
  - Capture participant-created, task-submitted, task-reviewed, case-submitted, template-published, task-withdrawn, and evidence-uploaded events.
  - Build historical case activity and reporting views.

## Phase 8 - Realtime Event-Driven Updates

- Course module:
  - `azure08`
- Title:
  - Realtime Likes Microservice: Event-Driven Analytics
- Repository:
  - `azure08-realtime-likes-microservice`
- Goal:
  - Add realtime workflow updates and asynchronous user feedback.
- Planned work:
  - Extend event-driven architecture.
  - Add live browser update mechanism.
  - Surface async processing status.
  - Add resilient retry and dead-letter handling where appropriate.
- All Checks Out focus:
  - Realtime case status updates.
  - Realtime review outcome updates.
  - Realtime stakeholder visibility changes.
  - Background evidence processing status.

## Phase 9 - Microfrontend Architecture

- Course module:
  - `azure09`
- Title:
  - Microfrontend Architecture
- Repository:
  - `azure09-microfrontend-architecture`
- Goal:
  - Split the frontend into independently owned and deployable applications.
- Planned work:
  - Define route-based microfrontend boundaries.
  - Extract shared packages.
  - Separate administration, case management, and stakeholder portal apps.
  - Add independent build and deployment workflows.
  - Preserve shared identity and navigation.
- All Checks Out focus:
  - Administration microfrontend.
  - Participant case management microfrontend.
  - Stakeholder portal microfrontend.
  - Shared shell/header/app launcher.
  - Shared domain client package.

## Phase 10 - Azure AI Vision Tagging

- Course module:
  - `azure10`
- Title:
  - Azure AI Vision Image Tagging
- Repository:
  - `azure10-ai-vision-tagging`
- Goal:
  - Add AI-powered image tagging, metadata enrichment, and intelligent search.
- Planned work:
  - Integrate Azure AI Vision.
  - Analyze uploaded images.
  - Generate suggested tags.
  - Let users review AI suggestions before saving.
  - Persist curated tags.
  - Add tag-aware search.
- All Checks Out focus:
  - Photo identity task tagging.
  - Work photo tagging.
  - Evidence metadata enrichment.
  - Authority review assistance.
  - Search and filter evidence by approved tags.

## Cross-Phase Guardrails

- Preserve the domain vocabulary:
  - Authority
  - Participant
  - Stakeholder
  - Case template
  - Case
  - Task
  - Evidence
- Preserve tenant boundary:
  - Authority remains the unit of isolation.
- Preserve user-kind exclusivity:
  - One user belongs to one user kind.
- Preserve stakeholder visibility:
  - Stakeholders see only approved participants.
- Keep phase scope clear:
  - Phase 2 is static website hosting and frontend behavior.
  - Backend, identity, persistence, events, microfrontends, and AI arrive in later phases.
- Keep implementation practical:
  - Each phase should leave a runnable application.
  - Each phase should have clear Azure resources.
  - Each phase should teach one major cloud-native concept.

## Immediate Next Work

- Add Vitest or an equivalent test runner for `monorepo/apps/ui`.
- Add domain command tests for `InMemoryAllChecksOutDatabase`.
- Prioritize tests for:
  - User kind exclusivity.
  - Participant creation scoping.
  - Participant user creation.
  - Stakeholder access cross-authority blocking.
  - Template publication.
  - Case submission validation.
  - Task review status recalculation.
  - Published template task withdrawal.
  - Post-publication task addition.
- Run:
  - `pnpm run type-check`
  - `pnpm run ui:build`
