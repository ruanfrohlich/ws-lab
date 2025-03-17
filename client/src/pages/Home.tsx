import Cookies from 'js-cookie';
import { FormEvent, Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AppHelmet } from '../components';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

export enum cookies {
  userToken = 'USER_TOKEN',
}

interface ISocketData {
  type: 'chatMessage' | 'updateClientId';
  clientId: string;
  content: {
    from: string;
    to: string;
    user: {
      name: string;
    };
    message: string;
  };
}

interface IState {
  socket?: WebSocket;
  connected: boolean;
  username?: string;
  clientId: string;
  message?: string;
  messagesHistory?: string[];
  hideChat?: boolean;
  openChats: string[];
  myMouse?: {
    x: number;
    y: number;
  };
  mouses?: {
    id: string;
    coordinates: {
      x: number;
      y: number;
    };
  };
  receivedMessages: Array<{
    id: string;
    avatarColor?: string;
    user?: {
      name: string;
    };
    messages: string[];
  }>;
  receiver: {
    id: string;
  };
}

export function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const chatMessages = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<IState>({
    connected: false,
    receivedMessages: [],
    hideChat: true,
    messagesHistory: [],
    clientId: '',
    openChats: [],
    receiver: {
      id: '',
    },
  });

  const isValid =
    state.connected &&
    state.username &&
    state.username.length > 2 &&
    state.receiver?.id &&
    state.receiver.id.length > 2 &&
    state.message;

  const generateRandomColor = () => {
    let maxVal = 0xffffff; // 16777215
    let randomNumber = Math.random() * maxVal;
    randomNumber = Math.floor(randomNumber);
    let randColor = randomNumber.toString(16);
    return `#${randColor.padStart(6, '0').toUpperCase()}`;
  };

  const handleClick = (event: FormEvent) => {
    event.preventDefault();

    if (state.socket && formRef.current) {
      const data: ISocketData = {
        type: 'chatMessage',
        clientId: state.clientId,
        content: {
          from: state.clientId,
          to: state.receiver.id,
          message: state.message,
          user: {
            name: state.username,
          },
        },
      };

      state.socket.send(JSON.stringify(data));

      setState((state) => {
        return {
          ...state,
          messagesHistory: [...state.messagesHistory, state.message],
        };
      });
    }
  };

  const webSocketHandler = () => {
    const wsClient = state.socket ?? new WebSocket('wss://localhost:3001/');

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
          socket: null,
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
          socket: null,
        };
      });
    };

    wsClient.onmessage = function (e) {
      const data = JSON.parse(String(e.data)) as ISocketData;

      console.log(data);

      setState((state) => {
        switch (data.type) {
          case 'chatMessage': {
            if (data.content.from === state.clientId) {
              return {
                ...state,
                receivedMessages: [
                  ...state.receivedMessages,
                  {
                    id: data.content.from,
                    avatarColor: '#0fef21',
                    user: data.content.user,
                    messages: [data.content.message],
                  },
                ],
              };
            }

            if (data.content.to === state.clientId) {
              const oldMessages = state.receivedMessages.find((user) => user.id === data.content.from);

              if (oldMessages) {
                return {
                  ...state,
                  message: '',
                  receivedMessages: [
                    ...state.receivedMessages,
                    {
                      ...oldMessages,
                      messages: [data.content.message],
                    },
                  ],
                };
              }

              return {
                ...state,
                message: '',
                receivedMessages: [
                  ...state.receivedMessages,
                  {
                    id: data.content.from,
                    avatarColor: generateRandomColor(),
                    user: data.content.user,
                    messages: [data.content.message],
                  },
                ],
              };
            }

            return {
              ...state,
              message: '',
            };
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

  const hideChat = () => {
    const chatEl = chatRef.current;

    if (!chatEl) return;

    setState((state) => {
      return {
        ...state,
        hideChat: !state.hideChat,
      };
    });

    const chatSize = chatEl.getBoundingClientRect().height;

    if (state.hideChat) {
      chatEl.style.transform = `translateY(${chatSize - 30}px)`;
    } else {
      chatEl.style.transform = `translateY(0)`;
    }
  };

  useEffect(() => {
    const messages = chatMessages.current;

    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }
  }, [state.receivedMessages]);

  useEffect(() => {
    const actualToken = Cookies.get(cookies.userToken);

    if (state.username && state.username?.length > 3 && state.username !== actualToken) {
      Cookies.set(cookies.userToken, state.username);

      state.socket?.close();

      setTimeout(() => {
        console.log('Enviando novo token para o server.');

        webSocketHandler();
      }, 2000);
    }
  }, [state.username]);

  useLayoutEffect(() => {
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
      while (!state.connected && reconnectionCount <= 3) {
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

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingBlock: 3,
      }}
    >
      <AppHelmet title='Home' description='Estudos com websocket + webRTC' />
      <Box>
        {state.clientId && <p>Seu id de cliente: {state.clientId}</p>}
        <Typography variant='h3' component='h1'>
          Olá, {state.username ?? 'Anônimo'}!
        </Typography>
        <Typography variant='body1' mb={2}>
          Você está atualmente{' '}
          {state.connected ? (
            <Typography component={'span'} color='success'>
              conectado(a)
            </Typography>
          ) : (
            <Typography component={'span'} color='error'>
              desconectado(a)
            </Typography>
          )}
          .
        </Typography>

        <Box component={'form'} noValidate ref={formRef} width={400}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              type='text'
              id='username'
              label='Qual seu nome?'
              fullWidth
              onChange={(e) =>
                setState((state) => {
                  return {
                    ...state,
                    username: e.target.value,
                  };
                })
              }
            />
            <TextField
              type='text'
              id='receiverName'
              label='Pra quem vai a mensagem? (Client ID)'
              fullWidth
              onChange={(e) =>
                setState((state) => {
                  return {
                    ...state,
                    receiver: {
                      id: e.target.value,
                    },
                  };
                })
              }
            />
            <TextField
              type='text'
              id='message'
              label='Mensagem:'
              value={state.message ?? ''}
              fullWidth
              onChange={(e) =>
                setState((state) => {
                  return {
                    ...state,
                    message: e.target.value,
                  };
                })
              }
            />
          </Box>
          <Button variant='outlined' type='submit' onClick={handleClick} disabled={!isValid}>
            Enviar mensagem
          </Button>
        </Box>

        <div ref={chatRef}>
          <div>
            <button onClick={hideChat}>Chat {state.receiver.id && `(${state.receiver.id})`}</button>
          </div>
          <div ref={chatMessages}>
            {state.receivedMessages.map((el, i) => (
              <div key={el.id + i}>
                <div>
                  <span
                    style={{
                      backgroundColor: el.avatarColor,
                    }}
                  >
                    {el.id === state.clientId && <span>Você</span>}
                    {el.user.name.charAt(0)}
                  </span>
                  <p>{el.user.name}</p>
                </div>
                <div>
                  {el.messages.map((message, j) => (
                    <p key={el.id + j}>{message}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Box>
    </Box>
  );
}
