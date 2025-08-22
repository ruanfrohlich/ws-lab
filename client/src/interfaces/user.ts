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

export interface IUserGoogle {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface IUserContext {
  user?: IUser | null;
  logged: boolean;
}

export type TUserActions =
  | 'setUser'
  | 'updateUser'
  | 'removeUser'
  | 'updateFriendActivity';

export interface IUserAction {
  type: TUserActions;
  payload?: IUserContext & { [key: string]: unknown };
}
