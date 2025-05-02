import { IncomingMessage, ServerResponse } from 'http';
import sha256 from 'crypto-js/hmac-sha256';
import database from '../database';
import { getBody } from '../utils';
import { IDBUser, IFindUser } from '../interfaces';

export const apiRoutes = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const { url, method } = req;
  const endpoint = url?.split('/api')[1];
  const { createUser, checkUserExists } = await database();

  const sendResponse = (status: number, message: object) => {
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(message), 'utf-8');
  };

  switch (/**NOSONAR */ endpoint) {
    case '/user': {
      if (method === 'POST') {
        const body = (await getBody(req)) as IFindUser;

        const hasUser = await checkUserExists(body);

        if (hasUser) {
          return sendResponse(200, {
            exists: true,
          });
        }

        return sendResponse(200, {
          exists: false,
        });
      } else {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }
    }
    case '/register': {
      if (method === 'POST') {
        const body = (await getBody(req)) as IDBUser;
        const hasUser = await checkUserExists(body);

        if (hasUser) {
          return sendResponse(400, {
            message: 'User already exists',
          });
        }

        try {
          const user: IDBUser = {
            ...body,
            password: sha256(body.password, process.env.APP_KEY as string).toString(),
          };

          await createUser(user);

          return sendResponse(201, {
            message: 'User created successfully',
          });
        } catch (e) {
          console.log(e);

          return sendResponse(500, {
            message: 'Server error',
          });
        }
      } else {
        return sendResponse(405, {
          message: 'Metodo não aceito!',
        });
      }
    }
    default: {
      return sendResponse(404, {
        message: 'Endpoint not found',
      });
    }
  }
};
