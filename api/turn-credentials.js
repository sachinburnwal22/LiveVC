const twilio = require('twilio');

// Get Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

let twilioClient = null;
if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!twilioClient) {
    return res.status(500).json({ error: 'Twilio not configured' });
  }
  
  try {
    const token = await twilioClient.tokens.create({
      ttl: 3600 // 1 hour expiry
    });
    res.json({ iceServers: token.iceServers });
  } catch (error) {
    console.error('Error generating TURN credentials:', error);
    res.status(500).json({ error: 'Failed to generate TURN credentials' });
  }
}
