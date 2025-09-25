# WebRTC Video Chat - Vercel Deployment

A WebRTC video chat application deployed on Vercel with serverless functions.

## Vercel Deployment

### Prerequisites
- Vercel account
- Twilio account with credentials
- GitHub repository

### Deployment Steps

1. **Install Vercel CLI** (optional but recommended):
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   Or connect your GitHub repository at [vercel.com](https://vercel.com)

3. **Set Environment Variables**:
   In your Vercel dashboard, add these environment variables:
   - `TWILIO_ACCOUNT_SID`: Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio Auth Token
   - `NODE_ENV`: `production`

4. **Redeploy** after setting environment variables

### Important Notes

- **Socket.IO Limitation**: Vercel's serverless functions don't support persistent WebSocket connections like Socket.IO
- **Alternative**: Consider using Vercel's WebSocket support or a separate service for signaling
- **TURN Credentials**: The `/api/turn-credentials` endpoint works as a serverless function

### Local Development

```bash
npm run dev
```

### Project Structure

```
├── api/
│   └── turn-credentials.js    # Serverless function for TURN credentials
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── server.js                   # Main Express app
├── vercel.json                 # Vercel configuration
└── package.json
```

### Limitations on Vercel

- **No persistent WebSocket connections** (Socket.IO won't work)
- **Serverless functions** have execution time limits
- **Cold starts** may cause delays

### Alternative Solutions

For full WebRTC functionality, consider:
1. **Render** (current deployment) - supports WebSockets
2. **Railway** - supports persistent connections
3. **Heroku** - traditional hosting with WebSocket support
4. **Separate signaling service** - use Vercel for static files + separate WebSocket service

## License

ISC
