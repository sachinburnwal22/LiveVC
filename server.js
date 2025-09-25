const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const twilio = require('twilio');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Get Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

let twilioClient = null;
if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}

// Serve static files
app.use(express.static('public'));

// Serve index.html for root route
app.get('/', (req, res) => {
  const indexPath = require('path').join(__dirname, 'public', 'index.html');
  console.log('Looking for index.html at:', indexPath);
  res.sendFile(indexPath);
});

// API endpoint to get TURN credentials
app.get('/api/turn-credentials', async (req, res) => {
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
});

// Socket.io signaling
io.on('connection', socket => {
  console.log('User connected:', socket.id);
  
  // Relay signaling data to other peer
  const relay = (event) => {
    socket.on(event, data => {
      socket.broadcast.emit(event, data);
    });
  };
  // Set up relay for WebRTC signals
  relay('offer');
  relay('answer');
  relay('candidate');
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Current directory: ${__dirname}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'public')}`);
  console.log(`Twilio configured: ${twilioClient ? 'Yes' : 'No'}`);
  
  // Debug: List files in public directory
  const publicDir = path.join(__dirname, 'public');
  try {
    const files = fs.readdirSync(publicDir);
    console.log('Files in public directory:', files);
  } catch (error) {
    console.log('Error reading public directory:', error.message);
  }
});