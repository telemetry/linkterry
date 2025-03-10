const WebSocket = require('ws');
const http = require('http');

const port = process.env.PORT || 8080;

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running\n');
});

// Attach the WebSocket server to the HTTP server
const wss = new WebSocket.Server({ server });

// This variable holds the current dot color
let currentColor = 'grey';

wss.on('connection', (ws) => {
  // Send the current color to any new client that connects
  ws.send(JSON.stringify({ type: 'updateColor', color: currentColor }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'updateColor') {
      currentColor = data.color;
      // Broadcast the updated color to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'updateColor', color: currentColor }));
        }
      });
    }
  });
});

// Start the HTTP server using the appropriate port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
