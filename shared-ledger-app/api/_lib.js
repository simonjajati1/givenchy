// Shared helpers: Redis client + password-gate auth.
// Files under /api prefixed with "_" are modules, not routes.

const crypto = require('crypto');
const { Redis } = require('@upstash/redis');

// --- storage -------------------------------------------------------------
// Accepts either the Upstash-native variable names or the older KV_* names,
// because the Vercel Upstash integration has used both.
function redisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error(
      'Redis is not configured. Set UPSTASH_REDIS_REST_URL and ' +
      'UPSTASH_REDIS_REST_TOKEN (or the KV_REST_API_* equivalents).'
    );
  }
  return new Redis({ url, token });
}

// --- auth ----------------------------------------------------------------
const COOKIE = 'ledger_auth';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function signingSecret() {
  const pw = process.env.APP_PASSWORD;
  if (!pw) throw new Error('APP_PASSWORD is not set.');
  // Deriving from the password by default keeps setup to a single variable and
  // has the useful property that changing the password invalidates old sessions.
  return process.env.AUTH_SECRET || crypto.createHash('sha256').update('sig:' + pw).digest('hex');
}

// Compare digests so the check is constant-time and length-independent.
function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function checkPassword(candidate) {
  const pw = process.env.APP_PASSWORD;
  if (!pw) throw new Error('APP_PASSWORD is not set.');
  if (typeof candidate !== 'string' || candidate.length === 0) return false;
  return safeEqual(candidate, pw);
}

function issueToken() {
  const exp = Date.now() + MAX_AGE * 1000;
  const mac = crypto.createHmac('sha256', signingSecret()).update('v1:' + exp).digest('hex');
  return exp + '.' + mac;
}

function tokenValid(token) {
  if (typeof token !== 'string') return false;
  const dot = token.indexOf('.');
  if (dot < 1) return false;
  const exp = Number(token.slice(0, dot));
  const mac = token.slice(dot + 1);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = crypto.createHmac('sha256', signingSecret()).update('v1:' + exp).digest('hex');
  return safeEqual(mac, expected);
}

function readCookie(req, name) {
  const raw = req.headers && req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return null;
}

function isAuthed(req) {
  return tokenValid(readCookie(req, COOKIE));
}

function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie',
    `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
}

module.exports = {
  redisClient, checkPassword, issueToken, isAuthed,
  setSessionCookie, clearSessionCookie, COOKIE
};
