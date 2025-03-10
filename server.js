const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Create an HTTP server and attach Express
const server = http.createServer(app);

// Attach WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

// Store the current dot color
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

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
