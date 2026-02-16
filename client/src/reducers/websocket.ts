import { IWebsocketAction, IWebsocketContext } from 'interfaces';

export const websocketReducer = (
  websocket: IWebsocketContext,
  action: IWebsocketAction,
): IWebsocketContext => {
  switch (action.type) {
    case 'updateWSState': {
      if (action.payload) {
        return {
          ...websocket,
          ...action.payload,
        };
      }

      return websocket;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
};
