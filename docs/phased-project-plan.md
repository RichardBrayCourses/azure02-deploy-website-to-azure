# All Checks Out - Azure02 Project Plan

## Purpose

`azure02-deploy-website-to-azure` is the baseline deployment repository for the course. It publishes the frontend using Azure-generated URLs only.

The repository stays focused on a single Azure Storage static website deployment.

## Azure02 Scope

- Build the React and TypeScript frontend.
- Provision one low-cost Azure Storage account with Bicep.
- Enable Azure Blob static website hosting.
- Upload the Vite production build to the `$web` container.
- Print the Azure-generated static website endpoint.
- Delete the resource group when the lesson is complete.

## Azure02 Non-Scope

- Extra hosting resources.
- Edge resources.
- Backend APIs.
- Azure SQL.
- Document storage workflows.
- AI services.
- GitHub Actions.
- Production environment separation.
- Monitoring and alerting.

## Completion Checklist

- [ ] Infrastructure deploys from a clean Azure subscription.
- [ ] The deployed resource group contains only the storage-account static website resources needed for this lesson.
- [ ] The site is reachable at the storage account static website endpoint.
- [ ] React Router routes refresh correctly because `index.html` is configured as the 404 document.
- [ ] The README contains the Azure-generated URL deployment instructions.
- [ ] Teardown deletes the lesson resource group cleanly.
