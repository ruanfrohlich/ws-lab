import { IncomingMessage } from 'http';
import { log, originIsAllowed } from '../utils';
import database from '../database';
import { IIncomingData, IReturnData } from '../interfaces';
import { WebSocket } from 'ws';
import { parse } from 'cookie';

const connections: {
  [key: string]: WebSocket;
} = {};

const sendMessage = (clients: WebSocket[], message: IReturnData) => {
  clients.forEach((client) => {
    if (client) {
      client.send(JSON.stringify(message));
    }
  });
};

export const WebsocketEvents = async (ws: WebSocket, { headers, url }: IncomingMessage) => {
  const { cookie, origin } = headers;
  const clientUUID = parse(cookie ?? '')['WS_AUTH'] ?? '';

  if (url !== '/') {
    ws.close(1008, 'Invalid url');
  }

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
      connections[user.uuid] = ws;

      log('Connection accepted, client: ' + user.username);

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString()) as IIncomingData;

          if (message.type === 'updateActivityStatus') {
            console.log('Sending activity status update.');

            Object.keys(connections).map((uuid) => {
              const { friends } = user;

              friends.forEach((friend, i) => {
                if (friend.user.uuid === uuid) {
                  console.log(i + 1, 'amigos conectados');

                  sendMessage([connections[uuid]], {
                    type: 'updateActivityStatus',
                    content: {
                      uuid: user.uuid,
                    },
                  });
                }
              });
            });
          }
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

        delete connections[user.uuid];

        log(`Connected clients: ${JSON.stringify(Object.keys(connections))}`);
      });
    } else {
      log('User not found on database. Disconnecting');

      ws.close(1008, 'Unauthorized');
    }
  }
};
