export interface ISocketData {
  type: 'chatMessage' | 'updateActivityStatus' | 'error';
  content: {
    [key: string]: unknown;
  };
}

export type TWebsocketActions = 'updateWSState';

export interface IWebsocketAction {
  type: TWebsocketActions;
  payload?: IWebsocketContext;
}

export interface IWebsocketContext {
  socket?: WebSocket;
  connected: boolean;
}
