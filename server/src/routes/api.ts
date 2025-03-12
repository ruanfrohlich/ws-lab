import { IncomingMessage, ServerResponse } from 'http';

export const apiRoutes = (
  { url, method }: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  if (url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        message: 'Ok',
      }),
      'utf-8',
    );
  }
};
