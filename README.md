# Interview AI (MongoDB)

A Vite + React front-end for the Interview AI project. This repo builds to a static `dist` folder and can be deployed on Vercel.

## Quick start

Prerequisites: Node 18+, npm.

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Deploy to Vercel

### Using the Vercel dashboard

- Push this repository to GitHub, GitLab, or Bitbucket.
- Import the project on Vercel.
- Set the **Build Command** to `npm run build` and **Output Directory** to `dist`.
- Add the required Environment Variables (see below).

### Using the Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Vercel will run the `build` script and serve the `dist` folder as a static site.

## Environment variables

This project expects the following server-side environment variables (configure them in Vercel under Project Settings → Environment Variables):

- `MONGODB_URI` — MongoDB connection URI
- `MONGODB_DB_NAME` — Database name
- `JWT_SECRET` — Secret used to sign JWTs
- `GROQ_API_KEY` — API key for Groq calls (used server-side)

Note: The code contains server-only modules (MongoDB client, JWT utilities, Groq client). When deploying to Vercel as a static build, these modules will not run in the browser — ensure any server-only operations are executed in serverless functions or a separate server runtime and that env vars are set accordingly.

## Notes & next steps

- If you need server-side endpoints, consider moving server code into Vercel serverless functions (`api/`) or deploying a Node/Cloudflare Worker backend.
- If you want, I can add an example `api/` function wrapper for the MongoDB client or add more deployment automation.
