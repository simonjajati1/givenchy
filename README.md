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
| `UPSTASH_REDIS_REST_URL` | yes | Added automatically when you connect the Upstash integration. |
| `UPSTASH_REDIS_REST_TOKEN` | yes | Same. |
| `AUTH_SECRET` | no | Session signing key. Defaults to a value derived from `APP_PASSWORD`. |

The code also accepts `KV_REST_API_URL` / `KV_REST_API_TOKEN` in place of the
`UPSTASH_*` pair, since the Vercel integration has used both names.

Changing `APP_PASSWORD` invalidates existing sessions (unless `AUTH_SECRET` is
set explicitly), which is the easiest way to log everyone out.

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
APP_PASSWORD=... UPSTASH_REDIS_REST_URL=... UPSTASH_REDIS_REST_TOKEN=... vercel dev
```
