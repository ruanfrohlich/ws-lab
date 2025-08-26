import { ActionDispatch, createContext, useContext } from 'react';
import { IUserAction, IUserContext } from 'interfaces';

export const initialState: IUserContext = {
  logged: false,
  errors: null,
  user: null,
};

export const UserContext = createContext<IUserContext>(initialState);
export const UserDispatchContext = createContext<
  ActionDispatch<[action: IUserAction]>
>(() => initialState);

export function useUser() {
  return useContext(UserContext);
}

export function useUserDispatch() {
  return useContext(UserDispatchContext);
}
