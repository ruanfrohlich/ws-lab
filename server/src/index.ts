import { createServer, IncomingMessage } from 'http';
import { randomUUID } from 'crypto';
import WebSocket from 'ws';
import 'dotenv/config';

type TDataType = 'chatMessage' | 'updateClientId';

interface IReturnData {
  type: TDataType;
  clientId?: string;
  content?: {
    [key: string]: string;
  };
}

interface IIncomingData {
  type: TDataType;
  clientId: string;
  content: {
    [key: string]: string;
  };
}

const acceptedOrigins = ['http://localhost:3000'];
const port = process.env.PORT ?? 3001;
const logHistory: string[] = [];
const connections: {
  [key: string]: WebSocket;
} = {};

const log = (message: string) => {
  message = `(${new Date().toLocaleString('pt-BR')}) - ${message}.`;

  logHistory.push(message);

  return console.log(message);
};

const originIsAllowed = (origin: string) => {
  if (acceptedOrigins.includes(origin)) return true;
};

// HTTP Server
const server = createServer((request, response) => {
  const { url, method } = request;

  log(`Received request for ${url}`);

  if (url === '/history' && method === 'GET') {
    response.writeHead(200);
    response.write(JSON.stringify(logHistory));
    response.end();
  } else {
    response.writeHead(404);
    response.end();
  }
}).listen(port, () => log(`Server is listening on port ${port}`));

// WS Server
const wss = new WebSocket.Server({
  server,
});

const sendMessage = (clients: WebSocket[], message: IReturnData) => {
  if (message.type !== 'updateClientId') delete message.clientId;

  clients.forEach((client) => {
    if (client) {
      client.send(JSON.stringify(message));
    }
  });
};

wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
  const { headers, url } = request;
  const origin = headers['origin'] ?? '';

  if (!originIsAllowed(origin) || url !== '/') {
    log(`Connection from origin ${origin} rejected`);

    ws.close(1008, 'Unauthorized');
  }

  if (ws.readyState === WebSocket.OPEN) {
    const clientId = randomUUID();

    connections[clientId] = ws;

    sendMessage([ws], { type: 'updateClientId', clientId });

    log('Connection accepted, client: ' + clientId);

    ws.on('message', (data) => {
      const message = JSON.parse(data.toString()) as IIncomingData;

      sendMessage([connections[message.content.to], ws], message);
    });

    ws.on('close', function () {
      log(`Client ${clientId} disconnected`);

      delete connections[clientId];

      console.log(
        'Connected clients: ',
        JSON.stringify(Object.keys(connections)),
      );
    });
  }
});
