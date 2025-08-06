import { createServer } from 'https';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { router } from './routes';
import { isProd, onlyAPI, publicUrl, rootPath } from './utils';
import { BuildClient } from './frontend';
import websocket from './websocket';

dotenv.config({
  path: `${rootPath}/.env.${!isProd ? 'dev' : 'prd'}`,
});

const port = process.env.PORT ?? 3001;

// HTTP Server
const serverOptions = {
  key: readFileSync(process.env.LOCALHOST_SSL_KEY ?? ''),
  cert: readFileSync(process.env.LOCALHOST_SSL_CERT ?? ''),
};

(async () => {
  const { success, error } = onlyAPI
    ? {
        success: true,
      }
    : await BuildClient();

  if (success) {
    const server = createServer(serverOptions, router).listen(port, () => {
      console.log(`🌪️  Server is listening on https://localhost:${port}${onlyAPI ? '/api' : publicUrl}`);
    });

    // WebSocket Server
    websocket(server);
  } else if (error) {
    throw error;
  }
})();
