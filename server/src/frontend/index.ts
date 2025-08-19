import { Parcel } from '@parcel/core';
import type { InitialParcelOptions } from '@parcel/types';
import { clientRoot, isProd, publicUrl } from '../utils';
import loading from 'loading-cli';
import { join } from 'path';
import { existsSync, rmSync } from 'fs';

interface IWatchResponse {
  success: boolean;
  error?: unknown;
}

export const BuildClient = async (): Promise<IWatchResponse> => {
  [join(clientRoot, 'public'), join(clientRoot, '.parcel-cache')].forEach(
    (folder) => {
      if (existsSync(folder)) {
        rmSync(folder, {
          recursive: true,
        });
      }
    },
  );

  const loadBuild = loading({
    text: 'Building the client',
  }).start();

  const mode = isProd ? 'production' : 'development';

  let parcelConfig: InitialParcelOptions = {
    entries: join(clientRoot, 'src/index.html'),
    defaultConfig: '@parcel/config-default',
    env: {
      TEST: 'test',
    },
    defaultTargetOptions: {
      publicUrl,
      sourceMaps: !isProd,
      distDir: join(clientRoot, 'public'),
    },
    mode,
    cacheDir: join(clientRoot, '.parcel-cache'),
    shouldContentHash: false,
  };

  if (!isProd) {
    parcelConfig = {
      ...parcelConfig,
      watchDir: join(clientRoot, 'src/'),
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
        loadBuild.fail(err.message);

        res({
          success: false,
          error: JSON.stringify(err, null, 2),
        });
      }

      if (event?.type === 'buildSuccess') {
        const bundles = event.bundleGraph.getBundles();

        loadBuild.succeed(
          `Built ${bundles.length} bundles in ${event.buildTime}ms!`,
        );

        res({
          success: true,
        });
      } else if (event?.type === 'buildFailure') {
        loadBuild.fail(event.diagnostics[0].message);

        res({
          success: false,
          error: err,
        });
      }
    });
  });
};
