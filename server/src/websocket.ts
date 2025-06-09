import { IncomingMessage, Server } from 'http';
import { log, originIsAllowed } from './utils';
import WebSocket from 'ws';
import database from './database';
import * as Cookies from 'cookie';
import { IIncomingData, IReturnData } from './interfaces';

export default (server: Server) => {
  const connections: {
    [key: string]: WebSocket;
  } = {};

  const sendMessage = (clients: WebSocket[], message: IReturnData) => {
    if (message.type !== 'updateClientId') delete message.clientId;

    clients.forEach((client) => {
      if (client) {
        client.send(JSON.stringify(message));
      }
    });
  };

  const wss = new WebSocket.Server({
    server,
  });

  wss.on('connection', async (ws: WebSocket, { headers }: IncomingMessage) => {
    const { cookie, origin } = headers;
    const clientId = Cookies.parse(cookie ?? '')['USER_TOKEN'] ?? '';
    const { getUser } = await database();

    if (!clientId || !originIsAllowed(origin ?? '')) {
      if (!clientId) log(`ClientID not provided!`);
      else log(`Connection refused for origin ${origin}`);

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
};
