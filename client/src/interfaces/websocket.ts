export interface ISocketData {
  type: 'chatMessage' | 'updateClientId';
  clientId: string;
  content: {
    from: string;
    to: string;
    user: {
      name: string;
    };
    message: string;
  };
}

export interface IWSState {
  socket?: WebSocket;
  connected: boolean;
  username?: string;
  clientId: string;
  message?: string;
  messagesHistory?: string[];
  openChats: string[];
  myMouse?: {
    x: number;
    y: number;
  };
  mouses?: {
    id: string;
    coordinates: {
      x: number;
      y: number;
    };
  };
  receivedMessages: Array<{
    id: string;
    avatarColor?: string;
    user?: {
      name: string;
    };
    messages: string[];
  }>;
  receiver: {
    id: string;
  };
}
