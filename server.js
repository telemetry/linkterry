const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// This variable holds the current dot color
let currentColor = 'grey';

wss.on('connection', (ws) => {
  // Send the current color to any new client that connects
  ws.send(JSON.stringify({ type: 'updateColor', color: currentColor }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if(data.type === 'updateColor') {
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

console.log('WebSocket server is running on ws://localhost:8080');
