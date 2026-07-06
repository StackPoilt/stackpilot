// Serves the paid Playbook guide, gated behind a signed, time-limited access
// token. The token is issued by /api/paypal/capture-order.js right after a
// successful payment capture, so the only way to get a valid token is to
// actually pay (or have a link someone with a valid token shared — see the
// LIMITATION note below).
//
// Requires GUIDE_ACCESS_SECRET env var in Vercel (any long random string) —
// same one used by capture-order.js to sign the token.
//
// LIMITATION (documented, not hidden): this is a stateless signed link, not a
// single-use license. Anyone who has a valid, non-expired link can open it —
// there's no per-purchase revocation or usage tracking. That's an acceptable
// v1 tradeoff (it stops the URL from being freely guessable/discoverable),
// but if sharing becomes a real problem, the next step up is a database-backed
// single-use token (e.g. Vercel KV) that's invalidated after first use.

const guideHtml = require('./guide-content.json');
const guideToken = require('./_lib/guide-token');

function getQuery(req) {
  if (req.query && Object.keys(req.query).length) return req.query;
  try {
    const url = require('url');
    return url.parse(req.url, true).query || {};
  } catch (e) {
    return {};
  }
}

const DENIED_HTML = [
  '<!DOCTYPE html>',
  '<html lang="en">',
  '<head>',
  '<meta charset="UTF-8" />',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
  '<meta name="robots" content="noindex, nofollow" />',
  '<title>Link invalid or expired — StackPilot</title>',
  '</head>',
  '<body style="font-family: system-ui, sans-serif; max-width: 520px; margin: 100px auto; padding: 0 20px; color: #334155;">',
  '<h1 style="font-size: 22px; margin-bottom: 12px;">This link isn’t valid or has expired</h1>',
  '<p style="line-height: 1.6;">Access links to the Playbook are issued after purchase and expire after a while. If you already bought it and this link stopped working, reply to your PayPal receipt email and we’ll send a fresh one.</p>',
  '<p style="margin-top: 24px;"><a href="/playbook.html" style="color:#4f46e5; font-weight:600; text-decoration:none;">Buy the Playbook →</a></p>',
  '</body>',
  '</html>'
].join('\n');

module.exports = function handler(req, res) {
  const query = getQuery(req);
  const token = query.token;

  if (!guideToken.verifyToken(token)) {
    res.status(403);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(DENIED_HTML);
    return;
  }

  res.status(200);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.send(guideHtml);
};
