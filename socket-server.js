const WebSocket = require('ws')

const wss = new WebSocket.Server({
  port: 3000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Connection': 'Upgrade',
    'Upgrade': 'websocket'
  }
})

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});
