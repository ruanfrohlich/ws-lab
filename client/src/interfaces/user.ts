export interface IUserRegister {
  name: string;
  username: string;
  email: string;
  password: string;
}

export type TFriendStatus = 'send' | 'accepted' | 'rejected';
export type TFriendActivityStatus = 'online' | 'away' | 'offline' | 'busy';

export interface IFriends {
  id: number;
  status: TFriendStatus;
  activityStatus: TFriendActivityStatus;
  user: Pick<IUser, 'id' | 'username' | 'name' | 'uuid' | 'profilePic'>;
}
export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  uuid: string;
  profilePic: string;
  coverImage: string;
  friends: Array<IFriends>;
  createdAt: string;
  updatedAt: string;
}

export interface IUserContext {
  user?: IUser | null;
  logged?: boolean;
  errors?: string[] | null;
}

export type TUserActions =
  | 'setUser'
  | 'updateUser'
  | 'removeUser'
  | 'updateFriendActivity'
  | 'setError';

export interface IUserAction {
  type: TUserActions;
  payload?: IUserContext & { [key: string]: unknown };
}
