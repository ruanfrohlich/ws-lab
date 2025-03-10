import * as Cookies from 'js-cookie';
import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';

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

export function App() {
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
              const oldMessages = state.receivedMessages.find(
                (user) => user.id === data.content.from,
              );

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

    if (state.username?.length > 3 && state.username !== actualToken) {
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
    <div className='p-3 max-w-[600px] my-0 mx-auto'>
      {state.clientId && (
        <p className='fixed bottom-4 left-4 z-[999999]'>
          Seu id de cliente: {state.clientId}
        </p>
      )}
      <h1 className='text-3xl font-bold underline'>
        Olá, {state.username ?? 'Anônimo'}!
      </h1>
      <p>
        Você está atualmente{' '}
        {state.connected ? (
          <span className='text-green-600'>conectado(a)</span>
        ) : (
          <span className='text-red-600'>desconectado(a)</span>
        )}
        .
      </p>

      <form className='my-4 border border-black p-3' noValidate ref={formRef}>
        <div className='flex flex-col gap-[20px] mb-3'>
          <div className='flex flex-col'>
            <label htmlFor='username'>Qual seu nome?</label>
            <input
              className='px-2 py-1 rounded border border-black bg-gray-800 text-white'
              type='text'
              id='username'
              onChange={(e) =>
                setState((state) => {
                  return {
                    ...state,
                    username: e.target.value,
                  };
                })
              }
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='receiverName'>
              Pra quem vai a mensagem? (Client ID)
            </label>
            <input
              className='px-2 py-1 rounded border border-black bg-gray-800 text-white'
              type='text'
              id='receiverName'
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
          </div>
          <div className='flex flex-col'>
            <label htmlFor='message'>Mensagem:</label>
            <input
              type='text'
              className='px-2 py-1 rounded border border-black bg-gray-800 text-white'
              id='message'
              value={state.message ?? ''}
              onChange={(e) =>
                setState((state) => {
                  return {
                    ...state,
                    message: e.target.value,
                  };
                })
              }
            />
          </div>
        </div>
        <button
          type='submit'
          className={`rounded-full disabled:bg-gray-500 uppercase bg-blue-500 hover:bg-slate-600 transition-all duration-100 text-white px-3 py-1 text-[14px] ${!isValid && 'pointer-events-none'}`}
          onClick={handleClick}
          disabled={!isValid}
        >
          Enviar mensagem
        </button>
      </form>

      <div
        ref={chatRef}
        className='chat-box fixed z-[99999] bottom-0 right-[20px] w-[400px] h-[300px] overflow-hidden border-t border-r border-l border-black rounded-t-lg transition-transform duration-200'
      >
        <div className='absolut t-0 bg-slate-900'>
          <button className='text-white w-full h-[30px]' onClick={hideChat}>
            Chat {state.receiver.id && `(${state.receiver.id})`}
          </button>
        </div>
        <div
          ref={chatMessages}
          className='p-3 h-[270px] overflow-y-scroll overflow-x-hidden'
        >
          {state.receivedMessages.map((el, i) => (
            <div
              key={el.id + i}
              className={`chat-message flex gap-[15px] py-1 px-4 ${el.id === state.clientId && 'flex-row-reverse'}`}
            >
              <div className='flex flex-col items-center'>
                <span
                  style={{
                    backgroundColor: el.avatarColor,
                  }}
                  className={`relative rounded-full flex justify-center items-center text-lg font-bold p-2 w-[60px] h-[60px]`}
                >
                  {el.id === state.clientId && (
                    <span className='absolute leading-4 px-2 shadow-sm t-0 left-[50%] translate-x-[-52%] translate-y-[-30px] line bg-green-700 text-white rounded text-[12px]'>
                      Você
                    </span>
                  )}
                  {el.user.name.charAt(0)}
                </span>
                <p>{el.user.name}</p>
              </div>
              <div className='flex flex-col items-start'>
                {el.messages.map((message, j) => (
                  <p
                    key={el.id + j}
                    className={`mb-2 rounded-ss-xl rounded-se-xl ${el.id === state.clientId ? 'rounded-bl-xl' : 'rounded-br-xl'} bg-slate-500 text-white p-2`}
                  >
                    {message}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
