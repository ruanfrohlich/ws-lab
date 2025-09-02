import { readFile } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { extname, join } from 'path';
import { publicUrl, rootPath } from '../utils';
import { stat } from 'fs/promises';
import { OutgoingHttpHeaders } from 'http2';

/**
 * Manipulador de rotas para servir arquivos estáticos do cliente
 * Determina o tipo de conteúdo baseado na extensão do arquivo e configura cache apropriado
 * @param req - Objeto de requisição HTTP (apenas url é utilizada)
 * @param res - Objeto de resposta HTTP
 */
export const clientRoutes = ({ url }: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const appRoot = join(rootPath, '../client/public');
  let contentType = '';
  let filePath = appRoot + url?.replace(publicUrl, '').replace(/\?\d*/g, '');
  const extName = extname(filePath);

  switch (true) {
    case extName === '.js':
      contentType = 'text/javascript';
      break;
    case extName === '.css':
      contentType = 'text/css';
      break;
    case extName === '.json':
      contentType = 'application/json';
      break;
    case extName === '.png':
      contentType = 'image/png';
      break;
    case /\.jpe?g/.test(extName):
      contentType = 'image/jpg';
      break;
    case extName === '.webp':
      contentType = 'image/webp';
      break;
    case extName === '.wav':
      contentType = 'audio/wav';
      break;
    case extName === '.woff':
      contentType = 'font/woff';
      break;
    case extName === '.woff2':
      contentType = 'font/woff2';
      break;
    case filePath.replace(appRoot, '') === '/robots.txt':
      contentType = 'text/plain';
      filePath = join(rootPath, 'public', 'robots.txt');
      break;
    default:
      filePath = appRoot + '/index.html';
      contentType = 'text/html';
  }

  readFile(filePath, async function (error, content) {
    if (error) {
      res.writeHead(500);
      return res.end('Server error');
    }

    const lastModified = await stat(filePath);

    const resHeaders: OutgoingHttpHeaders = {
      'content-type': contentType,
      'last-modified': new Date(lastModified.mtime).toUTCString(),
      'content-length': content.byteLength,
    };

    if (!['text/html', 'text/plain'].includes(contentType)) {
      resHeaders['cache-control'] = 'max-age=31536000';
    }

    return res.writeHead(200, resHeaders).end(content);
  });
};
