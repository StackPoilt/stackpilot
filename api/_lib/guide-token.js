// Shared helper for signing/verifying the Playbook guide access token.
// Used by api/paypal/capture-order.js (signs, after a paid capture) and
// api/guide.js (verifies, before serving the guide content).
//
// Token format: base64url(expiryEpochMs) + "." + hex(HMAC-SHA256(expiryEpochMs))
// Requires GUIDE_ACCESS_SECRET env var in Vercel (any long random string).

const crypto = require('crypto');

function base64UrlEncode(str) {
  return Buffer.from(str, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(padded, 'base64').toString('utf8');
}

// ttlMs defaults to 30 days — long enough that a legitimate buyer can come
// back and re-read the guide without needing a fresh link every time.
function signToken(ttlMs) {
  const secret = process.env.GUIDE_ACCESS_SECRET;
  if (!secret) {
    throw new Error('Missing GUIDE_ACCESS_SECRET env var');
  }
  const expiry = Date.now() + (ttlMs || 30 * 24 * 60 * 60 * 1000);
  const expiryB64 = base64UrlEncode(String(expiry));
  const sig = crypto.createHmac('sha256', secret).update(expiryB64).digest('hex');
  return expiryB64 + '.' + sig;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  const secret = process.env.GUIDE_ACCESS_SECRET;
  if (!secret) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [expiryB64, sig] = parts;

  const expected = crypto.createHmac('sha256', secret).update(expiryB64).digest('hex');
  const sigBuf = Buffer.from(sig, 'hex');
  const expBuf = Buffer.from(expected, 'hex');
  if (sigBuf.length !== expBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;

  let expiry;
  try {
    expiry = parseInt(base64UrlDecode(expiryB64), 10);
  } catch (e) {
    return false;
  }
  if (!expiry || Number.isNaN(expiry) || Date.now() > expiry) return false;

  return true;
}

module.exports = { signToken: signToken, verifyToken: verifyToken };
