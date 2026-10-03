# E-Commerce Backend — Vercel Ready

This Express + MongoDB backend runs locally on port 5000 and as a Vercel serverless function in production.

## Local

```bash
npm install
cp .env.example .env
npm run dev
```

Local API: `http://localhost:5000/api/v1`

## Vercel deployment

1. Push this `server` folder to GitHub. Do not commit `.env`.
2. Create a new Vercel project from the repository.
3. Set **Root Directory** to `server` if the repository contains both `client` and `server`.
4. Vercel will use `api/index.js` as the serverless entry point.
5. Add these Environment Variables in the backend Vercel project:

```text
NODE_ENV=production
MONGODB_URI=<your MongoDB Atlas URI>
JWT_ACCESS_SECRET=<long random secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<another long random secret>
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=https://<your-frontend>.vercel.app
COOKIE_SAME_SITE=none
```

6. Deploy. The API base URL will be:

`https://<your-backend>.vercel.app/api/v1`

Health check:

`https://<your-backend>.vercel.app/api/v1/health`

## Frontend Vercel environment variable

In the **Next.js client Vercel project**, add:

```text
NEXT_PUBLIC_API_URL=https://<your-backend>.vercel.app/api/v1
```

Redeploy the frontend after changing this value.

## Important

- Never upload `.env` or JWT/MongoDB secrets to GitHub.
- Do not use `app.listen()` in the Vercel entry point. `src/server.js` remains only for local development.
- MongoDB is connected lazily and cached between warm Vercel invocations.
- The frontend must send `credentials: 'include'` for cookie-based authentication.
