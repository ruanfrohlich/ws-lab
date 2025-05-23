import { readFile } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { extname, relative } from 'path';
import { cwd } from 'process';

export const clientRoutes = ({ url, method }: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const appRoot = relative(cwd(), 'client/public');
  let contentType = '';
  let filePath = appRoot + url?.replace('/app', '');

  filePath = filePath.replace(/\?\d*/g, '');

  const extName = extname(filePath);

  switch (extName) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.jpeg':
      contentType = 'image/jpg';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
    default:
      filePath = appRoot + '/index.html';
      contentType = 'text/html';
  }

  console.log(filePath);

  readFile(filePath, function (error, content) {
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  });
};
