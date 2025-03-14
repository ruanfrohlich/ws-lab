import { Parcel } from '@parcel/core';
import { cwd } from 'process';
import { log } from './utils';

interface IWatchResponse {
  success: boolean;
}

export const BuildClient = async () => {
  const clientRoot = cwd() + '/client';
  let bundler = new Parcel({
    entries: clientRoot + '/src/index.html',
    defaultConfig: '@parcel/config-default',
    watchDir: clientRoot + '/src',
    hmrOptions: {
      port: parseInt(process.env.PORT ?? '3000'),
    },
  });
  const subscription = await bundler.watch((err, event) => {
    if (err) {
      throw err;
    }

    if (event?.type === 'buildSuccess') {
      let bundles = event.bundleGraph.getBundles();
      log(`✨ Built ${bundles.length} bundles in ${event.buildTime}ms!`);
    } else if (event?.type === 'buildFailure') {
      log(JSON.stringify(event.diagnostics));
    }
  });

  return subscription;
};
