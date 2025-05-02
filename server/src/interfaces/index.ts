export type TDataType = 'chatMessage' | 'updateClientId' | 'error';

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

export interface IFindUser {
  username: string;
  email: string;
}
export interface IIncomingData {
  type: TDataType;
  clientId: string;
  content: {
    [key: string]: string;
  };
}
