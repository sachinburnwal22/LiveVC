# WebRTC Video Chat Application

A simple peer-to-peer video chat application built with WebRTC, Socket.IO, and Twilio TURN servers.

## Features

- Real-time video chat between two users
- WebRTC peer-to-peer connection
- Socket.IO for signaling
- Twilio TURN servers for NAT traversal
- Responsive web interface

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   export TWILIO_ACCOUNT_SID=your_account_sid
   export TWILIO_AUTH_TOKEN=your_auth_token
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Deployment on Render

### Prerequisites

- A Twilio account with Account SID and Auth Token
- A GitHub repository with your code

### Steps

1. **Push your code to GitHub** (if not already done)

2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Sign up/Login with your GitHub account
   - Click "New +" and select "Web Service"

3. **Configure the service**:
   - Connect your GitHub repository
   - Choose the repository containing this project
   - Use these settings:
     - **Name**: `webrtc-video-chat` (or your preferred name)
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free (or your preferred plan)

4. **Set Environment Variables**:
   - In the Render dashboard, go to your service settings
   - Add these environment variables:
     - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
     - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
     - `NODE_ENV`: `production`

5. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Once deployed, you'll get a URL like `https://your-app-name.onrender.com`

### Alternative: Using render.yaml

If you prefer to use the included `render.yaml` configuration file:

1. Push your code to GitHub
2. In Render, select "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically detect the `render.yaml` file and use those settings
5. You'll still need to manually set the Twilio environment variables in the Render dashboard

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID | Yes |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token | Yes |
| `NODE_ENV` | Environment (production/development) | No |
| `PORT` | Port number (automatically set by Render) | No |

## Security Notes

- Never commit Twilio credentials to version control
- Use environment variables for all sensitive data
- The application uses HTTPS in production (required for WebRTC)

## Troubleshooting

- **WebRTC not working**: Ensure you're using HTTPS in production
- **TURN server errors**: Check your Twilio credentials and account status
- **Connection issues**: Verify both users have camera/microphone permissions

## License

ISC
