// Diagnostic endpoint. Reports only whether configuration is PRESENT and
// whether Redis answers — never the values themselves.
const { redisClient } = require('./_lib');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  const env = {
    APP_PASSWORD: Boolean(process.env.APP_PASSWORD),
    AUTH_SECRET: Boolean(process.env.AUTH_SECRET),
    UPSTASH_REDIS_REST_URL: Boolean(process.env.UPSTASH_REDIS_REST_URL),
    UPSTASH_REDIS_REST_TOKEN: Boolean(process.env.UPSTASH_REDIS_REST_TOKEN),
    KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
    KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN)
  };

  let redis = 'not attempted';
  try {
    await redisClient().ping();
    redis = 'ok';
  } catch (e) {
    redis = 'FAILED: ' + e.message;
  }

  const problems = [];
  if (!env.APP_PASSWORD) problems.push('APP_PASSWORD is not set — login cannot work.');
  if (!(env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL) ||
      !(env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN)) {
    problems.push('No Redis credentials — connect the Upstash database to this project.');
  }
  if (redis !== 'ok' && problems.length === 0) {
    problems.push('Redis credentials exist but the connection failed. See "redis" above.');
  }

  return res.status(200).json({ env, redis, problems, ok: problems.length === 0 });
};
