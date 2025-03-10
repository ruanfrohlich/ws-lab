import { createServer } from 'https';
import WebSocket from 'ws';
import 'dotenv/config';
import * as Cookies from 'cookie';
import database from './database';
import { IncomingMessage } from 'http';
import { readFile, readFileSync } from 'fs';
import { cwd } from 'process';
import { extname, relative } from 'path';

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

const acceptedOrigins = ['https://localhost:3001'];
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
const serverOptions = {
  key: readFileSync(process.env.LOCALHOST_SSL_KEY ?? ''),
  cert: readFileSync(process.env.LOCALHOST_SSL_CERT ?? ''),
};

const server = createServer(serverOptions, (request, response) => {
  const { url, method } = request;

  log(`Received request for ${url}`);

  if (url === '/history' && method === 'GET') {
    response.setHeader('content-type', 'application/json');
    response.writeHead(200);
    response.write(JSON.stringify(logHistory));
    response.end();
  } else if (url?.startsWith('/app') && method === 'GET') {
    const appRoot = relative(cwd(), 'client/public');
    let contentType = '';
    let filePath = appRoot + request.url;

    if (url === '/app') filePath = appRoot + '/index.html';
    else filePath = filePath.replace('/app', '');

    const extName = extname(filePath);

    switch (extName) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
        contentType = 'image/jpg';
        break;
      case '.wav':
        contentType = 'audio/wav';
        break;
      default:
        contentType = 'text/html';
    }

    readFile(filePath, function (error, content) {
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    });
  } else {
    response.writeHead(404);
    response.end();
  }
}).listen(port, () =>
  log(`Server is listening on port https://localhost:${port}`),
);

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
