import { ReactNode, useEffect, useReducer } from 'react';
import { ISocketData, IWebsocketAction, IWebsocketContext } from '../interfaces';
import { WebsocketContext, WebsocketDispatchContext } from '../contexts/websocket';
import { useUser } from '../contexts';

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
  const [websocket, dispatch] = useReducer(websocketReducer, {
    connected: false,
  });

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
      console.log('Websocket conectado!');

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
      console.log('Websocket fechado!');

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

      console.log(data);
    };
  };

  useEffect(() => {
    if (logged && !websocket.connected) webSocketHandler();

    if (websocket.connected && !logged) {
      websocket.socket?.close();
    }
  }, [logged, websocket.connected]);

  // useEffect(() => {
  //   let timer: NodeJS.Timeout;
  //   let reconnectionCount = 0;

  //   if (!user) {
  //     return;
  //   }

  //   dispatch({
  //     type: 'updateWSState',
  //     payload: {
  //       ...websocket,
  //     },
  //   });

  //   (async () => {
  //     while (!websocket.connected && reconnectionCount < 3) {
  //       await new Promise((res) => {
  //         timer = setTimeout(
  //           () => {
  //             webSocketHandler();
  //             reconnectionCount++;
  //             res('connecting');
  //           },
  //           Math.floor(Math.random() * 3000),
  //         );
  //       });
  //     }
  //   })();

  //   return () => clearTimeout(timer);
  // }, [websocket.connected]);

  return (
    <WebsocketContext value={websocket}>
      <WebsocketDispatchContext value={dispatch}>{children}</WebsocketDispatchContext>
    </WebsocketContext>
  );
};
