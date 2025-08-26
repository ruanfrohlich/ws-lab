import { createServer as createServerSSL } from 'https';
import { createServer } from 'http';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { router } from './routes';
import { formatMB, isProd, publicUrl, rootPath } from './utils';
import { BuildClient } from './frontend';
import websocket from './websocket';

config({
  path: `${rootPath}/.env.${!isProd ? 'dev' : 'prd'}`,
});

const port = process.env.PORT ?? 3001;

(async () => {
  const { success, error } = !isProd
    ? await BuildClient()
    : {
        success: true,
      };

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
      const { rss, heapUsed } = process.memoryUsage();
      console.log(
        `🚀  Server is listening on ${isProd ? 'http' : 'https'}://localhost:${port}${publicUrl}`,
      );
      console.log(
        `💾 Memory used: ${formatMB(heapUsed)} MB (${formatMB(rss)} RSS) `,
      );
    });

    // WebSocket Server
    websocket(server);
  } else if (error) {
    throw error;
  }
})();
