import { IncomingMessage, ServerResponse } from 'http';
import { log } from '../utils';
import { clientRoutes } from './client';
import { apiRoutes } from './api';

export const router = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  const { url } = req;

  log(`Request received for ${url}`);

  const path = () => {
    if (url?.startsWith('/app')) return 'client';
    if (url?.startsWith('/api')) return 'api';
  };

  switch (path()) {
    case 'client': {
      clientRoutes(req, res);
      break;
    }
    case 'api': {
      apiRoutes(req, res);
      break;
    }
    default: {
      res.writeHead(404, 'Not found');
      res.end();
    }
  }
};
