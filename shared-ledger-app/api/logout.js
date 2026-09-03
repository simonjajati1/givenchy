const { clearSessionCookie } = require('./_lib');

module.exports = async (req, res) => {
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
};
