export interface IUserRegister {
  username: string;
  email: string;
  password: string;
}

export type TFriendStatus = 'send' | 'accepted' | 'rejected';
export type TFriendActivityStatus = 'online' | 'away' | 'offline' | 'busy';
export interface IUser {
  id: number;
  name: string;
  username: string;
  email: string;
  uuid: string;
  profilePic: string;
  coverImage: string;
  friends: Array<{
    id: number;
    status: TFriendStatus;
    activityStatus: TFriendActivityStatus;
    user: Pick<IUser, 'id' | 'username' | 'name' | 'uuid' | 'profilePic'>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface IUserContext {
  user?: IUser | null;
  logged: boolean;
}

export type TUserActions = 'setUser' | 'updateUser' | 'removeUser';

export interface IUserAction {
  type: TUserActions;
  payload?: IUserContext;
}
