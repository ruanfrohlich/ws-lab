import { Server } from 'http';
import WebSocket from 'ws';
import { WebsocketEvents } from './events';

export default (server: Server) => {
  const wss = new WebSocket.Server({
    server,
  });

  wss.on('connection', WebsocketEvents);
};
