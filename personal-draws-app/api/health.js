// Diagnostic endpoint. Reports only whether configuration is PRESENT and
// whether Redis answers — never the values themselves.
const { storage } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  const env = {
    APP_PASSWORD: Boolean(process.env.APP_PASSWORD),
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
    // TCP-style connection strings
    REDIS_URL: Boolean(process.env.REDIS_URL),
    KV_URL: Boolean(process.env.KV_URL),
    // REST-style credentials
    UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
    KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN)
  };

  let redis = 'not attempted';
  let kind = null;
  try {
    const store = storage();
    kind = store.kind;
    await store.ping();
    redis = 'ok';
  } catch (e) {
    redis = 'FAILED: ' + e.message;
  }

  const problems = [];
  if (!env.APP_PASSWORD) problems.push('APP_PASSWORD is not set — login cannot work.');
  const haveTcp = env.REDIS_URL || env.KV_URL;
  const haveRest = (env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL) &&
                   (env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN);
  if (!haveTcp && !haveRest) {
    problems.push('No Redis credentials. Connect a Redis database to this project.');
  }
  if (redis !== 'ok' && problems.length === 0) {
    problems.push('Credentials exist but the connection failed. See "redis" above.');
  }

  return res.status(200).json({ env, connection: kind, redis, problems, ok: problems.length === 0 });
};
