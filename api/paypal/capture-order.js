// Captures a previously-created PayPal order after the buyer approves payment.
// Requires PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET env vars in Vercel.
//
// NOTE (MVP limitation): this returns status only; the client redirects to the
// guide page on "COMPLETED". The guide URL itself isn't access-gated yet, so
// anyone with the direct link could view it without paying. Fine for a v1
// single-product launch, but before scaling this, add either: (a) a signed,
// short-lived token returned here and checked on the guide page, or
// (b) email delivery of the guide instead of a public URL.

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
          res.status(200).json({ status: capture.status, id: capture.id });
    } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Server error capturing order' });
    }
};
