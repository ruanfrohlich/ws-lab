import { readFile } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { extname, join } from 'path';
import { publicUrl, rootPath } from '../utils';
import { createGzip } from 'zlib';

export const clientRoutes = (
  { url }: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  const appRoot = join(rootPath, '../client/public');
  let contentType = '';
  let filePath = appRoot + url?.replace(publicUrl, '');

  filePath = filePath.replace(/\?\d*/g, '');

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
    default:
      filePath = appRoot + '/index.html';
      contentType = 'text/html';
  }

  readFile(filePath, function (error, content) {
    if (error) {
      res.writeHead(500);
      return res.end('Server error');
    }

    res.writeHead(200, {
      'content-type': contentType,
      'content-encoding': 'gzip',
      'cache-control': 'no-cache',
    });

    const gzip = createGzip();

    gzip.pipe(res);

    return gzip.end(content, 'utf-8');
  });
};
