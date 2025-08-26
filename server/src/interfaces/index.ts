export type TDataType = 'chatMessage' | 'updateActivityStatus' | 'connections' | 'error';

export interface IReturnData {
  type: TDataType;
  content?: {
    [key: string]: string;
  };
}

export type TRoute = 'client' | 'api';

export interface IFindUser {
  username: string;
  email: string;
}
export interface IIncomingData {
  type: TDataType;
  content: {
    [key: string]: string;
  };
}
