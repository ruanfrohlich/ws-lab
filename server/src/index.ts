import { createServer as createServerSSL } from 'https';
import { createServer } from 'http';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { router } from './routes';
import { isProd, onlyAPI, publicUrl, rootPath } from './utils';
import { BuildClient } from './frontend';
import websocket from './websocket';

config({
  path: `${rootPath}/.env.${!isProd ? 'dev' : 'prd'}`,
});

const port = process.env.PORT ?? 3001;

(async () => {
  const { success, error } = onlyAPI
    ? {
        success: true,
      }
    : await BuildClient();

  if (success) {
    const server = isProd
      ? createServer(router)
      : createServerSSL(
          {
            key: readFileSync(process.env.LOCALHOST_SSL_KEY ?? ''),
            cert: readFileSync(process.env.LOCALHOST_SSL_CERT ?? ''),
          },
          router,
        );

    server.listen(port, () => {
      console.log(
        `🌪️  Server is listening on ${isProd ? 'http' : 'https'}://localhost:${port}${onlyAPI ? '/api' : publicUrl}`,
      );
    });

    // WebSocket Server
    websocket(server);
  } else if (error) {
    throw error;
  }
})();
