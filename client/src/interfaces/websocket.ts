export interface ISocketData {
  type: string;
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
