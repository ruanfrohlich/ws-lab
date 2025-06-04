import { IncomingMessage } from 'http';

const acceptedOrigins = ['https://localhost:3005'];

export const log = (message: string) => {
  message = `(${new Date().toLocaleString('pt-BR')}) - ${message}.`;
  console.log(message);
};

export const originIsAllowed = (origin: string) => {
  if (acceptedOrigins.includes(origin)) return true;
};

export const getBody = (req: IncomingMessage): Promise<{ [key: string]: any } | null> => {
  return new Promise((resolve) => {
    const data: Buffer[] = [];

    req
      .on('data', (chunk: Buffer) => {
        data.push(chunk);
      })
      .on('end', () => {
        const body = Buffer.concat(data).toString();

        if (body) resolve(JSON.parse(body));
        else resolve(null);
      });
  });
};
