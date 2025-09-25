const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const twilio = require('twilio');
const path = require('path');

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

// Serve static files - handle flattened structure on Render
const publicPath = path.join(__dirname, 'public');
const rootPath = __dirname;

console.log('Setting up static file serving...');
console.log('Public path:', publicPath);
console.log('Root path:', rootPath);

// Check if public directory exists
const fs = require('fs');
if (fs.existsSync(publicPath)) {
  console.log('Public directory exists, using it');
  app.use(express.static(publicPath));
} else {
  console.log('Public directory does not exist, serving from root');
  app.use(express.static(rootPath));
}

// Serve index.html for root route
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  console.log('Serving index.html from:', indexPath);
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

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Twilio configured: ${twilioClient ? 'Yes' : 'No'}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'public')}`);
});