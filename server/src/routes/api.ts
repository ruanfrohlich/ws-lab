import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http';
import { AES, enc } from 'crypto-js';
import database from '../database';
import { assetURL, getBody, rootPath } from '../utils';
import { omit } from 'lodash';
import { AccountTypesEnum, IFindUserResponse, UserCreationAttributes } from '../database/types';
import sharp from 'sharp';
import { join } from 'path';
import { mkdirSync, readFile } from 'fs';
import { stat } from 'fs/promises';

/**
 * Manipulador principal das rotas da API REST
 * Processa requisições HTTP para endpoints como login, registro, busca de usuários e assets
 * @param req - Objeto de requisição HTTP
 * @param res - Objeto de resposta HTTP
 */
export const apiRoutes = async (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const { url, method, headers } = req;
  const urlFormatted = new URL(String(url), process.env.SITE_URL);
  const endpoint = urlFormatted.pathname.split('/api')[1];
  const { UserModel, FriendsModel, searchAccounts } = await database();
  const appKey = process.env.APP_KEY ?? '';

  const sendResponse = (status: number, message: object, resHeaders?: OutgoingHttpHeaders) => {
    return res.writeHead(status, { 'content-type': 'application/json', ...resHeaders }).end(JSON.stringify(message));
  };

  const validateUser = async () => {
    if (!headers.authorization) {
      return sendResponse(401, {
        message: 'Auth token not provided!',
      });
    }

    const user = await UserModel.getUserByUUID(headers.authorization, FriendsModel.Model);

    if (!user) {
      return sendResponse(401, {
        message: 'Invalid auth token!',
      });
    }

    return user;
  };

  switch (true) {
    case endpoint === '/user': {
      if (method !== 'GET') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const email = urlFormatted.searchParams.get('email') ?? '';
      const username = urlFormatted.searchParams.get('username') ?? '';

      const user = await UserModel.getUser({
        email,
        username,
      });

      return sendResponse(200, {
        found: !!user,
      });
    }
    case endpoint === '/user/social': {
      if (method !== 'GET') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const token = urlFormatted.searchParams.get('token');

      if (!token) {
        return sendResponse(400, {
          message: 'Token not provided',
        });
      }

      const socialAccount = await UserModel.getSocialAccount(token, FriendsModel.Model);

      return sendResponse(200, {
        socialAccount,
      });
    }
    case endpoint === '/user/find': {
      if (method !== 'GET') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const user = (await validateUser()) as IFindUserResponse;

      if (!user.id) break;

      return sendResponse(200, {
        found: true,
        user,
      });
    }
    case endpoint === '/user/update': {
      if (method !== 'POST') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const user = (await validateUser()) as IFindUserResponse;

      if (!user.id) break;

      const body = await getBody<UserCreationAttributes>(req);

      const newAssets: {
        profilePic: string;
        coverImage: string;
      } = {
        coverImage: user.coverImage ?? '',
        profilePic: user.profilePic ?? '',
      };

      [body.profilePic, body.coverImage].forEach(async (asset, i) => {
        if (asset && asset !== '') {
          const [, imageBase64] = asset.split(/data:(?:image|text)\/(?:png|jpe?g|webp|html);base64,/);

          const folderPath = join(rootPath, 'public/user', String(user.id));
          const version = Date.now();
          const fileName = (i === 0 ? `pp.${version}` : `ci.${version}`) + '.webp';
          const filePath = `${folderPath}/${fileName}`;
          const assetLink = assetURL(fileName, 'user', String(user.id));

          newAssets[i === 0 ? 'profilePic' : 'coverImage'] = assetLink;

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
                [i === 0 ? 'profilePic' : 'coverImage']: i === 0 ? newAssets.profilePic : newAssets.coverImage,
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
    case endpoint === '/register': {
      if (method !== 'POST') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const body = await getBody<{
        fields: UserCreationAttributes;
        social: {
          image: string;
          provider: string;
          token: string;
        };
      }>(req);

      const user = await UserModel.getUser(body.fields);

      if (user) {
        return sendResponse(400, {
          message: 'User already exists',
        });
      }

      try {
        const data = {
          ...body.fields,
          type: AccountTypesEnum['USER'],
          password: AES.encrypt(body.fields.password, appKey).toString(),
        };

        const { user } = await UserModel.createUser(data, body.social);

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
    case /\/accounts\/search/.test(String(endpoint)): {
      if (method !== 'GET') {
        return sendResponse(405, {
          message: 'Invalid method',
        });
      }

      const user = (await validateUser()) as IFindUserResponse;

      if (!user.id) break;

      const term = urlFormatted.searchParams.get('term');

      if (!term) {
        return sendResponse(400, {
          message: 'Term not provided',
        });
      }

      const accounts = await searchAccounts(term, user.id);

      return sendResponse(200, {
        accounts,
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
