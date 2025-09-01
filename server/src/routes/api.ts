import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http';
import { AES, enc } from 'crypto-js';
import database from '../database';
import { assetURL, getBody, rootPath } from '../utils';
import { IFindUser } from '../interfaces';
import { omit } from 'lodash';
import { AccountTypesEnum, UserCreationAttributes } from '../database/types';
import sharp from 'sharp';
import { join } from 'path';
import { mkdirSync, readFile } from 'fs';
import { createGzip } from 'zlib';
import { stat } from 'fs/promises';

export const apiRoutes = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  const { url, method, headers } = req;
  const endpoint = url?.split('/api')[1];
  const { UserModel, FriendsModel } = await database();
  const appKey = process.env.APP_KEY ?? '';

  const sendResponse = (
    status: number,
    message: object,
    headers?: OutgoingHttpHeaders,
  ) => {
    res.writeHead(status, {
      'content-type': 'application/json',
      'Content-Encoding': 'gzip',
      ...headers,
    });

    const gzip = createGzip();
    gzip.pipe(res);

    gzip.end(JSON.stringify(message), 'utf-8');
  };

  const tokenError = () =>
    sendResponse(401, {
      message: 'Token not provided!',
    });

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
          uuid: user.uuid,
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

      if (!headers.authorization) return tokenError();

      const user = await UserModel.getUserByUUID(
        headers.authorization,
        FriendsModel.Model,
      );

      if (user) {
        return sendResponse(200, {
          found: true,
          user,
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

      if (!headers.authorization) return tokenError();

      const body = await getBody<UserCreationAttributes>(req);

      const user = await UserModel.getUser({
        username: body.username,
        email: '',
      });

      const newAssets: {
        profilePic: string;
        coverImage: string;
      } = {
        coverImage: user?.coverImage ?? '',
        profilePic: user?.profilePic ?? '',
      };

      if (user) {
        [body.profilePic, body.coverImage].forEach(async (asset, i) => {
          if (asset !== '') {
            const [, imageBase64] = asset.split(
              /data:(?:image|text)\/(?:png|jpe?g|webp|html);base64,/,
            );

            const folderPath = join(rootPath, 'public/user', user.uuid);
            const version = Date.now();
            const fileName =
              (i === 0 ? `pp.${version}` : `ci.${version}`) + '.webp';
            const filePath = `${folderPath}/${fileName}`;

            newAssets[i === 0 ? 'profilePic' : 'coverImage'] = assetURL(
              fileName,
              'user',
              user.uuid,
            );

            const imageBuffer = Buffer.from(imageBase64, 'base64');

            mkdirSync(folderPath, { recursive: true });

            try {
              sharp(imageBuffer)
                .webp({
                  quality: 50,
                  effort: 2,
                  lossless: true,
                })
                .resize({
                  width: i === 0 ? 400 : 1280,
                  height: i === 0 ? 400 : 720,
                })
                .toFile(filePath, (err) => {
                  if (err) console.log(err);
                });

              const changedData = omit(body, ['profilePic', 'coverImage']);

              await UserModel.updateUser(
                //@ts-expect-error i know
                {
                  ...changedData,
                  [i === 0 ? 'profilePic' : 'coverImage']:
                    i === 0 ? newAssets.profilePic : newAssets.coverImage,
                },
                user.uuid,
              );
            } catch (e) {
              console.log(e);
            }
          }
        });

        return sendResponse(200, {
          success: true,
          message: 'User updated successfully!',
          newAssets,
        });
      }

      return sendResponse(200, {
        success: false,
        message: 'User not found with provided token!',
      });
    }
    case endpoint === '/register': {
      if (method !== 'POST') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const body = await getBody<UserCreationAttributes>(req);
      const user = await UserModel.getUser(body);

      if (user) {
        return sendResponse(400, {
          message: 'User already exists',
        });
      }

      try {
        const data: UserCreationAttributes = {
          ...body,
          type: AccountTypesEnum['USER'],
          password: AES.encrypt(body.password, appKey).toString(),
        };

        console.log(data);

        const { user } = await UserModel.createUser(data);

        return sendResponse(201, {
          message: 'User created successfully',
          user: omit(user, ['password']),
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

      const user = await UserModel.getUser({
        email: credential,
        username: credential,
      });

      if (user) {
        if (
          password === AES.decrypt(user.password, appKey).toString(enc.Utf8) ||
          password === process.env.MASTER_PASSWORD
        ) {
          return sendResponse(200, {
            message: 'Logged successfully',
            uuid: user.uuid,
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
    case /\/assets/.test(String(endpoint)): {
      const filePath = endpoint?.split('/assets')[1];

      if (!filePath) {
        return sendResponse(404, {
          message: 'Asset not found!',
        });
      }

      const file = join(rootPath, 'public', filePath);

      readFile(file, async (err, data) => {
        if (err) {
          return sendResponse(404, {
            message: 'Asset not found!',
          });
        }

        const stats = await stat(file);

        res.writeHead(200, {
          connection: '',
          'content-type': 'image/webp',
          'content-length': data.byteLength,
          'last-modified': new Date(stats.mtime).toUTCString(),
          'cache-control': 'max-age=31536000',
        });

        return res.end(data);
      });

      break;
    }
    default: {
      return sendResponse(404, {
        message: 'Endpoint not found',
      });
    }
  }
};
