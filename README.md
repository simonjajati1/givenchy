# Ledgers

Two independent Vercel projects, each a static page plus serverless API backed by
its own Redis store:

- `shared-ledger-app` — three-way shared expenses (Simon / Joe / Isaac)
- `personal-draws-app` — personal draws & repayments (Simon / Isaac)

Deploy each folder as its own Vercel project. They must **not** share a Redis
database unless you also change the storage keys.

## Required environment variables

Set these in Vercel under Project → Settings → Environment Variables, for
Production (and Preview, if you use it).

| Variable | Required | Notes |
| --- | --- | --- |
| `APP_PASSWORD` | yes | The password that unlocks the ledger. |
| Redis credentials | yes | See below — the name depends on your provider. |
| `AUTH_SECRET` | no | Session signing key. Defaults to a value derived from `APP_PASSWORD`. |

### Redis credentials

Vercel's Redis add-ons hand out one of two shapes, and the app accepts either:

- **TCP** — `REDIS_URL` (or `KV_URL`), a `rediss://` connection string. Used by
  the Redis marketplace integrations. Handled with `ioredis`.
- **REST** — `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (or the
  `KV_REST_API_*` pair). Handled with `@upstash/redis`.

REST is preferred when both are present. The two clients speak different
protocols, so a REST client cannot use `REDIS_URL` and vice versa — that
mismatch is the most likely cause of a 500 on `/api/data`.

Hit `/api/health` on a deployment to see which variables it can see, which
connection type it chose, and whether Redis answers. It returns booleans and
connection errors only, never credential values.

## Storage

Vercel KV was retired and folded into Upstash Redis, so these use
`@upstash/redis` directly. Add it via Vercel → Storage → Create Database →
Upstash Redis, connected to the project.

On the first authenticated read the store is empty, so the API writes the seed
data from `api/seed.js` and serves it. Every read after that comes from Redis.

## Auth model

- `POST /api/login` checks `APP_PASSWORD` and sets an HttpOnly, Secure,
  SameSite=Strict session cookie signed with HMAC-SHA256. Sessions last 30 days.
- `POST /api/logout` clears it. The "Lock" button in the UI calls this.
- `/api/data` returns 401 unless the cookie is valid; the page shows the
  password screen on a 401.
- Login attempts are rate limited to 10 per IP per 15 minutes.

There is one shared password, not per-person accounts — the "I am" selector
records who entered a row, it is not an identity check.

## Local development

```bash
cd shared-ledger-app
npm install
APP_PASSWORD=... REDIS_URL=redis://localhost:6379 vercel dev
```
