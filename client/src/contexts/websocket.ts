import { IWebsocketAction, IWebsocketContext } from 'interfaces';
import { ActionDispatch, createContext, useContext } from 'react';

const initialState: IWebsocketContext = {
  connected: false,
};

export const WebsocketContext = createContext<IWebsocketContext>(initialState);
export const WebsocketDispatchContext = createContext<
  ActionDispatch<[action: IWebsocketAction]>
>(() => initialState);

export function useWebsocket() {
  return useContext(WebsocketContext);
}

export function useWebsocketDispatch() {
  return useContext(WebsocketDispatchContext);
}
