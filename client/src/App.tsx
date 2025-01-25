import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { w3cwebsocket } from 'websocket';

interface ISocketData {
  senderId: string;
  receiverId: string;
  message: string;
}

interface IState {
  socket?: w3cwebsocket;
  connected: boolean;
  username?: string;
  message?: string;
  messagesHistory?: string[];
  error?: Error;
  hideChat?: boolean;
  receivedMessages: Array<{
    id: string;
    avatarColor?: string;
    messages: string[];
  }>;
  receiver?: {
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
    hideChat: false,
    messagesHistory: [],
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
        senderId: state.username,
        receiverId: state.receiver.id,
        message: state.message,
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
    const wsClient = state.socket ?? new w3cwebsocket('ws://localhost:3001/');

    setState((state) => {
      return {
        ...state,
        error: null,
      };
    });

    wsClient.onerror = function (info) {
      console.log('Connection Error');

      setState((state) => {
        return {
          ...state,
          connected: false,
          socket: null,
          error: info,
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

      setState((state) => {
        if (data.receiverId !== state.username) {
          return { ...state, message: '' };
        }

        const oldMessages = state.receivedMessages.find(
          (user) => user.id === data.senderId,
        );

        if (oldMessages) {
          return {
            ...state,
            message: '',
            receivedMessages: [
              ...state.receivedMessages,
              {
                ...oldMessages,
                messages: [data.message],
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
              id: data.senderId,
              avatarColor: generateRandomColor(),
              messages: [data.message],
            },
          ],
        };
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

  useLayoutEffect(() => {
    let timer: NodeJS.Timeout;
    let reconnectionCount = 0;

    (async () => {
      while (!state.connected && reconnectionCount <= 3) {
        await new Promise((res) => {
          timer = setTimeout(() => {
            webSocketHandler();
            reconnectionCount++;
            res('ok');
          }, 3000);
        });
      }
    })();

    return () => clearTimeout(timer);
  }, [state.connected]);

  return (
    <div className='p-3 max-w-[600px] my-0 mx-auto'>
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

      {/* FORM */}
      <form className='my-4 border border-black p-3' noValidate ref={formRef}>
        <div className='flex flex-col gap-[20px] mb-3'>
          <div className='flex flex-col'>
            <label htmlFor='username'>
              Qual seu nome? {state.username && `(Atual: ${state.username})`}
            </label>
            <input
              className='px-2 py-1 rounded border border-black'
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
            <label htmlFor='receiverName'>Pra quem vai a mensagem?</label>
            <input
              className='px-2 py-1 rounded border border-black'
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
              className='px-2 py-1 rounded border border-black'
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

      {/* CHATBOX */}
      <div
        ref={chatRef}
        className='fixed z-[99999] bottom-0 right-[20px] w-full max-w-[400px] h-[300px] overflow-hidden border-t border-r border-l border-black rounded-t-lg transition-transform duration-200'
      >
        <div className='absolut t-0 bg-slate-900'>
          <button className='text-white w-full h-[30px]' onClick={hideChat}>
            <span>Chat</span>
          </button>
        </div>
        <div
          ref={chatMessages}
          className='p-3 h-[270px] overflow-y-scroll overflow-x-hidden'
        >
          {state.receivedMessages.map((el, i) => (
            <div
              key={i}
              className={`chat-message flex gap-[15px] py-1 px-4 ${el.id === state.username && 'flex-row-reverse'}`}
            >
              <div className='flex flex-col items-center'>
                <span
                  style={{
                    backgroundColor: el.avatarColor,
                  }}
                  className={`relative rounded-full flex justify-center items-center text-lg font-bold p-2 w-[60px] h-[60px]`}
                >
                  {el.id === state.username && (
                    <span className='absolute leading-4 px-2 shadow-sm t-0 left-[50%] translate-x-[-52%] translate-y-[-30px] line bg-green-700 text-white rounded text-[12px]'>
                      Você
                    </span>
                  )}
                  {el.id.charAt(0)}
                </span>
                <p>{el.id}</p>
              </div>
              <div className='flex flex-col items-start'>
                {el.messages.map((message, j) => (
                  <p
                    key={j}
                    className={`mb-2 rounded-ss-xl rounded-se-xl ${el.id === state.username ? 'rounded-bl-xl' : 'rounded-br-xl'} bg-slate-500 text-white p-2`}
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
