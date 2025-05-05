import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ISocketData, IWSState } from '../interfaces';

export const useWebsocketContext = () => {
  const [state, setState] = useState<IWSState>({
    connected: false,
    receivedMessages: [],
    messagesHistory: [],
    clientId: '',
    openChats: [],
    receiver: {
      id: '',
    },
  });

  const WebsocketContext = createContext<IWSState>(state);

  enum cookies {
    userToken = 'USER_TOKEN',
  }

  // const isValid =
  //   state.connected &&
  //   state.username &&
  //   state.username.length > 2 &&
  //   state.receiver?.id &&
  //   state.receiver.id.length > 2 &&
  //   state.message;

  // const generateRandomColor = () => {
  //   let maxVal = 0xffffff; // 16777215
  //   let randomNumber = Math.floor(Math.random() * maxVal);
  //   let randColor = randomNumber.toString(16);
  //   return `#${randColor.padStart(6, '0').toUpperCase()}`;
  // };

  const webSocketHandler = () => {
    const wsClient = state.socket ?? new WebSocket(`wss://${process.env.WS_SERVER}/`);

    setState((state) => {
      return {
        ...state,
        error: null,
      };
    });

    wsClient.onerror = function (error) {
      console.log('Connection Error');
      console.log(error);

      setState((state) => {
        return {
          ...state,
          connected: false,
          socket: undefined,
        };
      });
    };

    wsClient.onopen = function () {
      setState((state) => {
        return {
          ...state,
          connected: true,
          socket: wsClient,
        };
      });
    };

    wsClient.onclose = function () {
      setState((state) => {
        return {
          ...state,
          connected: false,
          socket: undefined,
        };
      });
    };

    wsClient.onmessage = function (e) {
      const data = JSON.parse(String(e.data)) as ISocketData;

      console.log(data);

      setState((state) => {
        switch (data.type) {
          case 'chatMessage': {
            console.log(data);

            return state;
          }
          case 'updateClientId': {
            return {
              ...state,
              clientId: data.clientId,
            };
          }
          default: {
            return { ...state, message: '' };
          }
        }
      });
    };
  };

  useEffect(() => {
    const actualToken = Cookies.get(cookies.userToken);

    if (state.username && state.username?.length > 3 && state.username !== actualToken) {
      Cookies.set(cookies.userToken, state.username);

      state.socket?.close();

      setTimeout(() => {
        console.log('Enviando novo token para o server.');

        webSocketHandler();
      }, 3000);
    }
  }, [state.username]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let reconnectionCount = 0;
    const userToken = Cookies.get(cookies.userToken);

    if (!userToken) {
      return;
    }

    setState((state) => {
      return {
        ...state,
        username: userToken,
      };
    });

    (async () => {
      while (!state.connected && reconnectionCount < 3) {
        await new Promise((res) => {
          timer = setTimeout(
            () => {
              webSocketHandler();
              reconnectionCount++;
              res('connecting');
            },
            Math.floor(Math.random() * 3000),
          );
        });
      }
    })();

    return () => clearTimeout(timer);
  }, [state.connected]);

  return {
    WebsocketContext,
    websocket: useContext(WebsocketContext),
  };
};
