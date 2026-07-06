// Returns the public PayPal Client ID to the browser so the PayPal SDK script
// can be loaded without hardcoding the key into static HTML.
// Set PAYPAL_CLIENT_ID in Vercel Project Settings → Environment Variables.
module.exports = function handler(req, res) {
    res.status(200).json({ clientId: process.env.PAYPAL_CLIENT_ID || '' });
};
