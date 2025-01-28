import { createServer, IncomingMessage } from 'http';
import WebSocket from 'ws';
import 'dotenv/config';
import * as Cookies from 'cookie';
import database from './database';

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

wss.on('connection', async (ws: WebSocket, { headers }: IncomingMessage) => {
  const { cookie, origin } = headers;
  const clientId = Cookies.parse(cookie ?? '')['USER_TOKEN'] ?? '';
  const { getUser } = database();

  if (!clientId || !originIsAllowed(origin ?? '')) {
    !clientId
      ? log(`ClientID not provided!`)
      : log(`Connection refused for origin ${origin}`);

    ws.close(1008, 'Unauthorized');
  }

  if (ws.readyState === WebSocket.OPEN) {
    const { user } = await getUser(clientId);

    connections[user.username] = ws;

    sendMessage([ws], { type: 'updateClientId', clientId });

    log('Connection accepted, client: ' + user.id);

    ws.on('message', (data) => {
      const message = JSON.parse(data.toString()) as IIncomingData; //NOSONAR

      sendMessage([connections[message.content.to], ws], message);
    });

    ws.on('close', function () {
      log(`Client ${clientId} disconnected`);

      delete connections[clientId];

      log(`Connected clients: ${JSON.stringify(Object.keys(connections))}`);
    });
  }
});
