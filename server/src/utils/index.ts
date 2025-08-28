import { IncomingMessage } from 'http';
import { relative } from 'path';
import { cwd } from 'process';

const acceptedOrigins = [
  'https://localhost:3005',
  'https://ws-lab-server.onrender.com',
];

export const log = (message: string) => {
  message = `(${new Date().toLocaleString('pt-BR')}) - ${message}.`;
  console.log(message);
};

export const originIsAllowed = (origin: string) => {
  if (acceptedOrigins.includes(origin)) return true;
};

export const getBody = <T>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    const data: Buffer[] = [];

    req
      .on('data', (chunk: Buffer) => {
        data.push(chunk);
      })
      .on('end', () => {
        const body = Buffer.concat(data).toString();

        if (body) resolve(JSON.parse(body));
        else reject(null);
      });
  });
};

export const onlyServer = process.argv.includes('--no-client');
export const isProd = process.argv.includes('--prod');
export const publicUrl = isProd ? '/ws-lab' : '/app';
export const rootPath = cwd(); // path to /server
export const clientRoot = relative(rootPath, '../client');
export const formatMB = (num: number) => {
  return Math.round((num / 1024 / 1024) * 100) / 100;
};
