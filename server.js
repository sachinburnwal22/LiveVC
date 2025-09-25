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

// Serve static files
const publicPath = path.join(__dirname, 'public');
console.log('Setting up static file serving from:', publicPath);

// Check if public directory exists
const fs = require('fs');
if (fs.existsSync(publicPath)) {
  console.log('Public directory exists');
  const files = fs.readdirSync(publicPath);
  console.log('Files in public directory:', files);
} else {
  console.log('Public directory does not exist');
}

app.use(express.static(publicPath));

// Serve index.html for root route
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  console.log('Attempting to serve index.html from:', indexPath);
  console.log('Current directory (__dirname):', __dirname);
  
  // Check if file exists
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    console.log('File exists, serving...');
    res.sendFile(indexPath);
  } else {
    console.log('File does not exist, checking alternatives...');
    // Try alternative paths
    const altPaths = [
      path.join(__dirname, 'index.html'),
      path.join(process.cwd(), 'public', 'index.html'),
      path.join(process.cwd(), 'index.html')
    ];
    
    for (const altPath of altPaths) {
      console.log('Checking:', altPath);
      if (fs.existsSync(altPath)) {
        console.log('Found file at:', altPath);
        return res.sendFile(altPath);
      }
    }
    
    console.log('No index.html found, returning error');
    res.status(404).send('index.html not found');
  }
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