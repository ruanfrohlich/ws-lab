import Cache from 'file-system-cache';
import { relative } from 'path';
import { rootPath } from '.';

export const useCache = async () => {
  const cache = Cache({
    basePath: relative(rootPath, './.cache'),
    hash: 'RSA-SHA1',
    ns: 'ws_lab',
  });

  const get = async <T>(item: string): Promise<T | null> => {
    const result = await cache.get(item);

    if (result) {
      return result;
    }

    return null;
  };

  const set = async <T>(item: string, content: T) => {
    await cache.set(item, content);
  };

  const del = async (item: string) => {
    await cache.remove(item);
  };

  return {
    get,
    set,
    del,
  };
};
