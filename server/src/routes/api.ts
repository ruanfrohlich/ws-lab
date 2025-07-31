import { IncomingMessage, ServerResponse } from 'http';
import { AES, enc } from 'crypto-js';
import database from '../database';
import { getBody } from '../utils';
import { IDBUser, IFindUser } from '../interfaces';
import { omit } from 'lodash';

export const apiRoutes = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const { url, method, headers } = req;
  const endpoint = url?.split('/api')[1];
  const { UserModel } = await database();
  const appKey = process.env.APP_KEY ?? '';

  const sendResponse = (status: number, message: object) => {
    res.writeHead(status, { 'content-type': 'application/json' });
    res.end(JSON.stringify(message), 'utf-8');
  };

  const checkAuthorization = () => {
    if (!headers.authorization) {
      return sendResponse(401, {
        message: 'Token not provided!',
      });
    }
  };

  switch (true) {
    case endpoint === '/user': {
      if (method !== 'POST') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const body = await getBody<IFindUser>(req);
      const user = await UserModel.getUser(body);

      if (user) {
        return sendResponse(200, {
          found: true,
        });
      }

      return sendResponse(200, {
        found: false,
      });
    }
    case endpoint === '/user/find': {
      if (method !== 'GET') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      if (!headers.authorization) {
        return sendResponse(401, {
          message: 'Token not provided!',
        });
      }

      const user = await UserModel.getUserByUUID(headers.authorization);

      if (user) {
        return sendResponse(200, {
          found: true,
          user: omit(user, ['password']),
        });
      }

      return sendResponse(200, {
        found: false,
      });
    }
    case endpoint === '/user/update': {
      if (method !== 'POST') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      checkAuthorization();

      const body = (await getBody(req)) as unknown as IDBUser;
      const user = await UserModel.updateUser(body, String(headers.authorization));

      if (user) {
        return sendResponse(200, {
          success: true,
        });
      }

      return sendResponse(200, {
        success: false,
      });
    }
    case endpoint === '/register': {
      if (method !== 'POST') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const body = await getBody<IDBUser>(req);
      const user = await UserModel.getUser(body);

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

        await UserModel.createUser(user);

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
    case endpoint === '/login': {
      if (method !== 'POST') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const body = await getBody<{
        credential: string;
        password: string;
      }>(req);

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

      const user = await UserModel.getUser({ email: credential, username: credential });

      if (user) {
        if (password === AES.decrypt(user.password, appKey).toString(enc.Utf8)) {
          return sendResponse(200, {
            message: 'Logged successfully',
            user: omit(user, ['password']),
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
