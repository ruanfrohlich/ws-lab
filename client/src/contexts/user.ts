import { ActionDispatch, createContext, useContext } from 'react';
import { IUserAction, IUserContext } from '../interfaces';

const initialState: IUserContext = {
  logged: false,
};

export const UserContext = createContext<IUserContext>(initialState);
export const UserDispatchContext = createContext<ActionDispatch<[action: IUserAction]>>(() => initialState);

export function useUser() {
  return useContext(UserContext);
}

export function useUserDispatch() {
  return useContext(UserDispatchContext);
}
