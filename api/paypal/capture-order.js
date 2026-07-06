// Captures a previously-created PayPal order after the buyer approves payment.
// Requires PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, and GUIDE_ACCESS_SECRET env
// vars in Vercel.
//
// On a COMPLETED capture, this also issues a signed, time-limited access token
// (see ../_lib/guide-token.js) and returns an accessUrl pointing at
// /api/guide?token=... — that's the only supported way to reach the guide
// content now. The old public /guide/ai-automation-stack-playbook.html static
// page no longer serves the real content (see that file for details).

const guideToken = require('../_lib/guide-token');

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET env vars');
  }
  const auth = Buffer.from(clientId + ':' + clientSecret).toString('base64');
  const tokenRes = await fetch(PAYPAL_API_BASE + '/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + auth,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) {
    throw new Error(tokenData.error_description || 'Failed to get PayPal access token');
  }
  return tokenData.access_token;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }
  const orderID = body && body.orderID;
  if (!orderID) {
    res.status(400).json({ error: 'Missing orderID' });
    return;
  }

  try {
    const accessToken = await getAccessToken();
    const captureRes = await fetch(
      PAYPAL_API_BASE + '/v2/checkout/orders/' + encodeURIComponent(orderID) + '/capture',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      }
    );
    const capture = await captureRes.json();
    if (!captureRes.ok) {
      console.error('PayPal capture error:', capture);
      res.status(500).json({ error: 'Could not capture order' });
      return;
    }

    if (capture.status === 'COMPLETED') {
      let accessUrl = null;
      try {
        const token = guideToken.signToken();
        accessUrl = '/api/guide?token=' + encodeURIComponent(token);
      } catch (e) {
        // Missing GUIDE_ACCESS_SECRET — payment still succeeded, just log it
        // so we notice and can hand-deliver access in the meantime.
        console.error('Could not issue guide access token:', e.message);
      }
      res.status(200).json({ status: capture.status, id: capture.id, accessUrl: accessUrl });
      return;
    }

    res.status(200).json({ status: capture.status, id: capture.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error capturing order' });
  }
};
