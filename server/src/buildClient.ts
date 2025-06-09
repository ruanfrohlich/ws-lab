import { Parcel } from '@parcel/core';
import type { InitialParcelOptions } from '@parcel/types';
import { cwd } from 'process';
import { isProd, log } from './utils';
import loading from 'loading-cli';
import { publicUrl } from './utils';

interface IWatchResponse {
  success: boolean;
  error?: unknown;
}

export const BuildClient = async () => {
  const loadBuild = loading({
    text: 'Building the client',
  }).start();

  const clientRoot = cwd() + '/client';

  let parcelConfig: InitialParcelOptions = {
    entries: clientRoot + '/src/index.html',
    defaultConfig: '@parcel/config-default',
    defaultTargetOptions: {
      publicUrl,
      sourceMaps: !isProd,
    },
    mode: isProd ? 'production' : 'development',
    env: {
      NODE_ENV: isProd ? 'production' : 'development',
    },
  };

  if (!isProd) {
    parcelConfig = {
      ...parcelConfig,
      watchDir: clientRoot + '/src',
      shouldAutoInstall: true,
      hmrOptions: {
        port: parseInt(process.env.HMR_PORT ?? '3000'),
      },
    };
  }

  const bundler = new Parcel(parcelConfig);

  return new Promise<IWatchResponse>((res) => {
    bundler.watch((err, event) => {
      if (err) {
        res({
          success: false,
          error: err,
        });
      }

      if (event?.type === 'buildSuccess') {
        loadBuild.succeed();

        const bundles = event.bundleGraph.getBundles();
        console.log(`✨ Built ${bundles.length} bundles in ${event.buildTime}ms!`);
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
