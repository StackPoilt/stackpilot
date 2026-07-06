// Creates a PayPal order server-side for the AI & Automation Stack Playbook.
// Requires PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET env vars in Vercel.
// Defaults to PayPal's sandbox API — switch PAYPAL_API_BASE to
// https://api-m.paypal.com once you're ready to take real payments.

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';
const PLAYBOOK_PRICE_USD = '29.00';

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
    try {
          const accessToken = await getAccessToken();
          const orderRes = await fetch(PAYPAL_API_BASE + '/v2/checkout/orders', {
                  method: 'POST',
                  headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + accessToken,
                  },
                  body: JSON.stringify({
                            intent: 'CAPTURE',
                            purchase_units: [
                              {
                                            description: 'StackPilot — AI & Automation Stack Playbook',
                                            amount: {
                                                            currency_code: 'USD',
                                                            value: PLAYBOOK_PRICE_USD,
                                            },
                              },
                                      ],
                  }),
          });
          const order = await orderRes.json();
          if (!orderRes.ok) {
                  console.error('PayPal create order error:', order);
                  res.status(500).json({ error: 'Could not create order' });
                  return;
          }
          res.status(200).json({ id: order.id });
    } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Server error creating order' });
    }
};
