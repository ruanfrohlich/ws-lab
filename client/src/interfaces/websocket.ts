export interface ISocketData {
  type: 'chatMessage' | 'other';
  content: {
    from: string;
    to: string;
    message: string;
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
