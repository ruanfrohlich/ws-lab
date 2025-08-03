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

  wss.on('connection', async (ws: WebSocket, { headers, url }: IncomingMessage) => {
    const { cookie, origin } = headers;
    console.log('ws requested url: ', url);

    const clientUUID = Cookies.parse(cookie ?? '')['WS_AUTH'] ?? '';
    const {
      UserModel: { getUserByUUID },
      FriendsModel,
    } = await database();

    if (!clientUUID || !originIsAllowed(origin ?? '')) {
      if (!clientUUID) log(`Client token not provided!`);
      else log(`Connection refused for origin ${origin}`);

      ws.close(1008, 'Unauthorized');
    }

    if (ws.readyState === WebSocket.OPEN) {
      const user = await getUserByUUID(clientUUID, FriendsModel.Model);

      if (user) {
        connections[user.username] = ws;

        log('Connection accepted, client: ' + user.username);

        ws.on('message', (data) => {
          try {
            const message = JSON.parse(data.toString()) as IIncomingData;
            sendMessage([connections[message.content.to], ws], message);
          } catch (e) {
            console.log(e);

            sendMessage([ws], {
              type: 'error',
              content: {
                message: data.toString(),
                error: (e as Error).message,
              },
            });
          }
        });

        ws.on('close', function () {
          log(`Client ${user.username} disconnected`);

          delete connections[user.username];

          log(`Connected clients: ${JSON.stringify(Object.keys(connections))}`);
        });
      } else {
        log('User not found on database. Disconnecting');

        ws.close(1008, 'Unauthorized');
      }
    }
  });
};
