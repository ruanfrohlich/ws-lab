import { connection, server as wsServer } from 'websocket';
import { createServer } from 'http';

const acceptedOrigins = ['http://localhost:3000'];

// HTTP Server
const httpServer = createServer(function (request, response) {
  console.log(new Date() + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

httpServer.listen(3001, function () {
  console.log(new Date() + ' Server is listening on port 3001');
});

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
    console.log(
      new Date() + ' Connection from origin ' + socket.origin + ' rejected.',
    );
    return;
  }

  const connection = socket.accept(null, socket.origin);

  if (connection.connected) {
    console.log(new Date() + ' Connection accepted.');

    connections.push(connection);

    connection.on('message', (message) => {
      //@ts-expect-error bug on typecheck
      connections.forEach((conn) => conn.send(message.utf8Data));
    });

    connection.on('close', function () {
      console.log(
        new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.',
      );
    });
  }
});
