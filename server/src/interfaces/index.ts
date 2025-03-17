export type TDataType = 'chatMessage' | 'updateClientId';

export interface IReturnData {
  type: TDataType;
  clientId?: string;
  content?: {
    [key: string]: string;
  };
}

export type TRoute = 'client' | 'api';

export interface IDBUser {
  username: string;
  email: string;
  password: string;
}
export interface IIncomingData {
  type: TDataType;
  clientId: string;
  content: {
    [key: string]: string;
  };
}
