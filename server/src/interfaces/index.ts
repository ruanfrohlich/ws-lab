export type TDataType = 'chatMessage' | 'updateClientId';

export interface IReturnData {
  type: TDataType;
  clientId?: string;
  content?: {
    [key: string]: string;
  };
}

export type TRoute = 'client' | 'api';

export interface IIncomingData {
  type: TDataType;
  clientId: string;
  content: {
    [key: string]: string;
  };
}
