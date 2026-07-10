# Concrete Sealing Cowichan Landing Page (Next.js)

This project contains a landing page optimized for the keyword "Concrete Sealing Cowichan".

## Routes

- `/` simple route index with a link to the landing page
- `/concrete-sealing-cowichan` main landing page

## Features

- Headline aligned with keyword intent
- Click-to-call CTA links
- Lead form with hidden tracking fields:
  - `gclid`
  - `utm_source`
  - `utm_medium`
  - `utm_campaign`
  - `utm_term`
  - `utm_content`
- Media reused from Rocket Wash page assets hosted on Wix static CDN

## Run

1. Install Node.js 18+.
2. Run `npm install`.
3. Run `npm run dev`.

## Lead Storage Persistence

By default in local development, leads are stored in `data/crm-leads.json`.

For hosted deployments, configure durable storage with Vercel Blob:

1. Add a Blob store in your Vercel project.
2. Set `BLOB_READ_WRITE_TOKEN` in project environment variables.
3. (Optional) Set `CRM_BLOB_PATH` (default: `crm/crm-leads.json`).

When `BLOB_READ_WRITE_TOKEN` is present, CRM lead reads/writes use Blob so leads stay consistent across deploy versions and server instances.
