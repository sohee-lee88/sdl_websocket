const WebSocket = require('ws');
const Controller = require('./controller.js')

const wss = new WebSocket.Server({port: 8087});
wss.on('connection', function connection(ws) {
    const controller = new Controller(ws);
    ws.on('message', function incoming(message) {
        console.log('come: '+message);
        controller.process(JSON.parse(message));
    });
});