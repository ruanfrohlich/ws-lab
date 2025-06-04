export interface IUserRegister {
  username: string;
  email: string;
  password: string;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
}

export interface IUserContext {
  user?: IUser;
  logged: boolean;
}

export type TUserActions = 'setUser' | 'updateUser' | 'removeUser';

export interface IUserAction {
  type: TUserActions;
  payload?: IUserContext;
}
