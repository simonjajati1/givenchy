const { kv } = require('@vercel/kv');
const { SEED } = require('./seed');

const KEY = 'personal-draws-data';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      let data = await kv.get(KEY);
      if (!data) {
        data = SEED;
        await kv.set(KEY, data);
      }
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      await kv.set(KEY, body);
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
