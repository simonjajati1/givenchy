const { storage, checkPassword, issueToken, setSessionCookie } = require('./_lib');

// Throttle guesses per IP. This is best-effort: if Redis is unavailable we let
// the attempt through rather than locking the owners out of their own ledger.
const WINDOW = 15 * 60; // seconds
const MAX_ATTEMPTS = 10;

async function tooManyAttempts(ip) {
  try {
    const store = storage();
    const key = 'login-attempts:' + ip;
    const n = await store.incr(key);
    if (n === 1) await store.expire(key, WINDOW);
    return n > MAX_ATTEMPTS;
  } catch (e) {
    return false;
  }
}

async function clearAttempts(ip) {
  try {
    await storage().del('login-attempts:' + ip);
  } catch (e) { /* non-fatal */ }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';

    if (await tooManyAttempts(ip)) {
      return res.status(429).json({ error: 'Too many attempts. Wait 15 minutes and try again.' });
    }

    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body || '{}');
    const password = body && body.password;

    if (!checkPassword(password)) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    await clearAttempts(ip);
    setSessionCookie(res, issueToken());
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
