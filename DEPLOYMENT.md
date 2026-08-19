# Production deployment

## Vercel

Deploy the repository root. The included `vercel.json` sends `/api/*` to the Express API and serves the React client for all other routes.

In the Vercel project settings, add this environment variable for every environment:

```text
DATABASE_URL=your-hosted-postgresql-connection-string
```

Use a hosted PostgreSQL database such as Neon or Supabase. Do not use the local SQLite file in production because Vercel storage is not persistent.

After adding the variable, redeploy the project. Signup, login, products, and orders will then use the same-origin Vercel API.

## Local development

Without `DATABASE_URL`, the server uses `server/store.db` for local development.

```text
npm install
npm run dev
```

The Vite development server proxies `/api` to the local Express server.
