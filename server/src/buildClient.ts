import { Parcel } from '@parcel/core';
import { cwd } from 'process';
import { log } from './utils';

interface IWatchResponse {
  success: boolean;
  error?: unknown;
}

export const BuildClient = async () => {
  const clientRoot = cwd() + '/client';

  let bundler = new Parcel({
    entries: clientRoot + '/src/index.html',
    defaultConfig: '@parcel/config-default',
    watchDir: clientRoot + '/src',
    defaultTargetOptions: {
      publicUrl: '/app',
    },
    hmrOptions: {
      port: parseInt(process.env.PORT ?? '3000'),
    },
  });

  return new Promise<IWatchResponse>((res, rej) => {
    bundler.watch((err, event) => {
      if (err) {
        res({
          success: false,
          error: err,
        });
      }

      if (event?.type === 'buildSuccess') {
        let bundles = event.bundleGraph.getBundles();
        log(`✨ Built ${bundles.length} bundles in ${event.buildTime}ms!`);
        res({
          success: true,
        });
      } else if (event?.type === 'buildFailure') {
        log(JSON.stringify(event.diagnostics));
        res({
          success: false,
          error: err,
        });
      }
    });
  });
};
