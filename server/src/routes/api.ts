import { IncomingMessage, ServerResponse } from 'http';
import { AES, enc } from 'crypto-js';
import database from '../database';
import { getBody } from '../utils';
import { IDBUser, IFindUser } from '../interfaces';

export const apiRoutes = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const { url, method } = req;
  const endpoint = url?.split('/api')[1];
  const { createUser, getUser } = await database();
  const appKey = process.env.APP_KEY ?? '';

  const sendResponse = (status: number, message: object) => {
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(message), 'utf-8');
  };

  switch (/**NOSONAR */ endpoint) {
    case '/user': {
      if (method !== 'POST') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const body = (await getBody(req)) as IFindUser;
      const user = await getUser(body);

      if (user) {
        return sendResponse(200, {
          found: true,
        });
      }

      return sendResponse(200, {
        found: false,
      });
    }
    case '/user/get': {
      if (method !== 'GET') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      break;
    }
    case '/register': {
      if (method !== 'POST') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const body = (await getBody(req)) as IDBUser;
      const user = await getUser(body);

      if (user) {
        return sendResponse(400, {
          message: 'User already exists',
        });
      }

      try {
        const user: IDBUser = {
          ...body,
          password: AES.encrypt(body.password, appKey).toString(),
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
    }
    case '/login': {
      if (method !== 'POST') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const body = await getBody(req);

      if (!body) {
        return sendResponse(403, {
          message: 'Body not provided',
        });
      }

      const credential = body.credential;
      const password = body.password;

      if (!credential || !password) {
        return sendResponse(401, {
          message: 'Username/E-mail or password not provided.',
        });
      }

      const user = await getUser({ email: credential, username: credential });

      if (user) {
        if (password === AES.decrypt(user.password, appKey).toString(enc.Utf8)) {
          return sendResponse(200, {
            message: 'Logged successfully',
            user,
            token: user.password,
          });
        }

        return sendResponse(401, {
          message: 'Invalid credentials',
        });
      }

      return sendResponse(401, {
        message: 'User not found',
      });
    }
    default: {
      return sendResponse(404, {
        message: 'Endpoint not found',
      });
    }
  }
};
