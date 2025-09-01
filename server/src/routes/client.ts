import { readFile } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { extname, join } from 'path';
import { publicUrl, rootPath } from '../utils';
import { createGzip, createBrotliCompress } from 'node:zlib';
import { stat } from 'fs/promises';
import { OutgoingHttpHeaders } from 'http2';
import { chunk, fromPairs } from 'lodash';

export const clientRoutes = (
  { url, rawHeaders }: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => {
  const appRoot = join(rootPath, '../client/public');
  let contentType = '';
  let filePath = appRoot + url?.replace(publicUrl, '');
  const reqHeaders = fromPairs(chunk(rawHeaders, 2));

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

  readFile(filePath, async function (error, content) {
    if (error) {
      res.writeHead(500);
      return res.end('Server error');
    }

    const lastModified = await stat(filePath);

    const headers: OutgoingHttpHeaders = {
      'content-type': contentType,
      'last-modified': new Date(lastModified.mtime).toUTCString(),
      'content-length': content.byteLength,
    };

    if (contentType !== 'text/html') {
      headers['cache-control'] = 'max-age=31536000';
    }

    const encodings = reqHeaders['Accept-Encoding'] as string;
    const accept = (encode: string) => encodings.indexOf(encode) !== -1;

    switch (true) {
      case accept('br'): {
        const br = createBrotliCompress();
        headers['content-encoding'] = 'br';
        res.writeHead(200, headers);
        br.pipe(res);
        return br.end(content, 'utf-8');
      }
      case accept('gzip'): {
        const gzip = createGzip();
        headers['content-encoding'] = 'gzip';
        res.writeHead(200, headers);
        gzip.pipe(res);
        return gzip.end(content, 'utf-8');
      }
      default: {
        res.writeHead(200, headers);
        return res.end(content, 'utf-8');
      }
    }
  });
};
