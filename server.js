const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Ensure root URL loads index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket setup
const wss = new WebSocket.Server({ server });

let currentColor = 'grey';

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'updateColor', color: currentColor }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'updateColor') {
      currentColor = data.color;
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'updateColor', color: currentColor }));
        }
      });
    }
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});