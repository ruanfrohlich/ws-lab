import { createServer } from 'https';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import * as Cookies from 'cookie';
import database from './database';
import { IncomingMessage } from 'http';
import { readFileSync } from 'fs';
import { router } from './routes';
import { log, originIsAllowed } from './utils';
import { IIncomingData, IReturnData } from './interfaces';
import { BuildClient } from './buildClient';
import { cwd } from 'process';

const onlyAPI = process.argv.includes('--api');
const isProd = process.argv.includes('--prod');

dotenv.config({
  path: cwd() + `/server/.env.${!isProd ? 'dev' : 'prd'}`,
});

const port = process.env.PORT ?? 3001;
const connections: {
  [key: string]: WebSocket;
} = {};

// HTTP Server
const serverOptions = {
  key: readFileSync(process.env.LOCALHOST_SSL_KEY ?? ''),
  cert: readFileSync(process.env.LOCALHOST_SSL_CERT ?? ''),
};

const sendMessage = (clients: WebSocket[], message: IReturnData) => {
  if (message.type !== 'updateClientId') delete message.clientId;

  clients.forEach((client) => {
    if (client) {
      client.send(JSON.stringify(message));
    }
  });
};

(async () => {
  const { success, error } = onlyAPI
    ? {
        success: true,
      }
    : await BuildClient(isProd);

  if (success) {
    const server = createServer(serverOptions, router).listen(port, () => {
      console.log(`🌪️  Server is listening on https://localhost:${port}/${onlyAPI ? 'api' : 'app'}`);
    });

    // WebSocket Server
    const wss = new WebSocket.Server({
      server,
    });

    wss.on('connection', async (ws: WebSocket, { headers }: IncomingMessage) => {
      const { cookie, origin } = headers;
      const clientId = Cookies.parse(cookie ?? '')['USER_TOKEN'] ?? '';
      const { getUser } = await database();

      if (!clientId || !originIsAllowed(origin ?? '')) {
        !clientId ? log(`ClientID not provided!`) : log(`Connection refused for origin ${origin}`);

        ws.close(1008, 'Unauthorized');
      }

      if (ws.readyState === WebSocket.OPEN) {
        const user = await getUser({ username: clientId, email: '' });

        if (user) {
          connections[user.username] = ws;

          log('Connection accepted, client: ' + user.username);

          ws.on('message', (data) => {
            try {
              const message = JSON.parse(data.toString()) as IIncomingData; //NOSONAR
              sendMessage([connections[message.content.to], ws], message);
            } catch (e) {
              console.log(e);

              sendMessage([ws], {
                type: 'error',
                content: {
                  message: data.toString(), //NOSONAR
                  error: (e as Error).message,
                },
              });
            }
          });

          ws.on('close', function () {
            log(`Client ${clientId} disconnected`);

            delete connections[clientId];

            log(`Connected clients: ${JSON.stringify(Object.keys(connections))}`);
          });
        } else {
          log(`User [${clientId}] não consta no banco de dados. Desconectando`);

          ws.close(1008, 'Unauthorized');
        }
      }
    });
  } else if (error) {
    throw error;
  }
})();
