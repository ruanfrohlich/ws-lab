import { IncomingMessage, ServerResponse } from 'http';
import database from '../database';
import { getBody } from '../utils';
import { IDBUser } from '../interfaces';

export const apiRoutes = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const endpoint = req.url?.split('/api')[1];
  const { createUser, checkUserExists } = await database();

  switch (/**NOSONAR */ endpoint) {
    case '/register': {
      if (req.method === 'POST') {
        const body = (await getBody(req)) as IDBUser;
        const hasUser = await checkUserExists(body);

        if (hasUser) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              message: 'User already exists',
            }),
            'utf-8',
          );

          return;
        }

        try {
          await createUser(body);

          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              message: 'User created successfully',
            }),
            'utf-8',
          );
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              message: 'Server error',
            }),
            'utf-8',
          );
        }
      } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            message: 'Metodo não aceito!',
          }),
          'utf-8',
        );
      }

      break;
    }
    default: {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          message: 'Endpoint not found',
        }),
        'utf-8',
      );
    }
  }
};
