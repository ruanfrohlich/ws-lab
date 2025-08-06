import { ReactNode, useEffect, useReducer } from 'react';
import { ISocketData, IWebsocketAction, IWebsocketContext } from '../interfaces';
import { WebsocketContext, WebsocketDispatchContext } from '../contexts/websocket';
import { useUser, useUserDispatch } from '../contexts';

const websocketReducer = (websocket: IWebsocketContext, action: IWebsocketAction): IWebsocketContext => {
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

export const WebsocketProvider = ({ children }: { children: ReactNode }) => {
  const { logged } = useUser();
  const userDispatch = useUserDispatch();
  const [websocket, dispatch] = useReducer(websocketReducer, {
    connected: false,
  });
  let retryCount = 0;
  const maxRetries = 3;
  let connected = false;

  const webSocketHandler = () => {
    const WSConnection = websocket.socket ?? new WebSocket(`wss://${process.env.WS_SERVER}/`);

    WSConnection.onerror = function (error) {
      console.log('Websocket error!');
      console.log(error);

      dispatch({
        type: 'updateWSState',
        payload: {
          ...websocket,
          connected: false,
          socket: undefined,
        },
      });
    };

    WSConnection.onopen = function () {
      console.log('Websocket connected!');
      connected = true;

      dispatch({
        type: 'updateWSState',
        payload: {
          ...websocket,
          connected: true,
          socket: WSConnection,
        },
      });
    };

    WSConnection.onclose = function () {
      console.log('Websocket closed!');

      dispatch({
        type: 'updateWSState',
        payload: {
          ...websocket,
          connected: false,
          socket: undefined,
        },
      });
    };

    WSConnection.onmessage = function (e: MessageEvent<unknown>) {
      const data = JSON.parse(String(e.data)) as ISocketData;

      if (data.type === 'updateActivityStatus') {
        userDispatch({
          type: 'updateFriendActivity',
          payload: {
            uuid: data.content.uuid,
          },
        });
      }
    };
  };

  const connect = () => {
    const interval = Math.floor(Math.random() * 2000) + 1000;

    const reconnectInterval = setInterval(() => {
      if (retryCount >= maxRetries) {
        console.error('Maximum number of retries reached. Giving up on reconnecting.');
        clearInterval(reconnectInterval);
        return;
      }

      if (connected) {
        clearInterval(reconnectInterval);
        return;
      }

      webSocketHandler();
      retryCount++;
    }, interval);
  };

  useEffect(() => {
    if (logged && !websocket.connected) {
      connect();
    }

    if (!logged) {
      websocket.socket?.close();
    }
  }, [logged]);

  return (
    <WebsocketContext value={websocket}>
      <WebsocketDispatchContext value={dispatch}>{children}</WebsocketDispatchContext>
    </WebsocketContext>
  );
};
