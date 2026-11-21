# CivicResolve – AI-Powered Citizen Grievance Management & Resolution

CivicResolve is a GovTech SaaS prototype built for competitive hackathons. It provides a **Citizen Grievance Portal**, a **Transparent Rule-Based Triage Engine**, **Duplicate Complaint Detection**, and a **Municipal Admin Command Center** with `localStorage` persistence.

> **Demo Data & AI Disclosure:** Pre-loaded complaints, officers, and preset scenarios are fictional **Demo Data** created for evaluation. Classification and priority scoring use a deterministic rule-based engine (`src/utils/aiEngine.js`) without claiming a connected external AI API.

## Local Setup & Build

```bash
npm install
npm run dev
```

## Deploy to Google Cloud Run

```bash
gcloud run deploy civicresolve \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```
