import { connection, server as wsServer } from 'websocket';
import { createServer } from 'http';
import 'dotenv/config';

const acceptedOrigins = ['http://localhost:3000'];
const port = process.env.PORT ?? 3001;
const logHistory: string[] = [];

const log = (message: string) => {
  message = `(${new Date().toLocaleString('pt-BR')}) - ${message}.`;

  logHistory.push(message);

  return console.log(message);
};

// HTTP Server
const httpServer = createServer((request, response) => {
  log(`Received request for ${request.url}`);

  const { url, method } = request;

  if (url === '/history' && method === 'GET') {
    response.writeHead(200);
    response.write(JSON.stringify(logHistory));
    response.end();
  } else {
    response.writeHead(404);
    response.write(url);
    response.end();
  }
});

httpServer.listen(port, () => log(`Server is listening on port ${port}`));

// WS Server
const ws = new wsServer({
  httpServer,
  autoAcceptConnections: false,
});

function originIsAllowed(origin: string) {
  if (acceptedOrigins.includes(origin)) return true;
}

const connections: connection[] = [];

ws.on('request', function (socket) {
  if (!originIsAllowed(socket.origin)) {
    socket.reject();
    log(`Connection from origin ${socket.origin} rejected`);
    return;
  }

  const connection = socket.accept(null, socket.origin);

  if (connection.connected) {
    log('Connection accepted');

    connections.push(connection);

    connection.on('message', (message) => {
      //@ts-expect-error bug on typecheck
      connections.forEach((conn) => conn.send(message.utf8Data));
    });

    connection.on('close', function () {
      log(`Peer ${connection.remoteAddress} disconnected`);
    });
  }
});
