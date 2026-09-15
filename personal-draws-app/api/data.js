const { storage, isAuthed } = require('./_lib');
const { SEED } = require('./_seed');

const KEY = 'personal-draws-data';

module.exports = async (req, res) => {
  // No CORS headers: the UI is served from this same origin, and the previous
  // wildcard let any site on the internet read and overwrite the ledger.
  res.setHeader('Cache-Control', 'no-store');

  try {
    // Inside the try: a missing APP_PASSWORD makes this throw, and an
    // uncaught throw here surfaces as an opaque 500 with no explanation.
    if (!isAuthed(req)) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }

    const store = storage();

    if (req.method === 'GET') {
      let data = await store.getJSON(KEY);
      if (!data) {
        data = SEED;
        await store.setJSON(KEY, data); // initialize storage with seed on first load
      }
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      if (!body || !Array.isArray(body.entries)) {
        return res.status(400).json({ error: 'Expected a ledger object with an entries array.' });
      }
      await store.setJSON(KEY, body);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
