import Cache from 'file-system-cache';
import { relative } from 'path';
import { rootPath } from '.';

/**
 * Configuração e utilitários para cache em sistema de arquivos
 * @returns Objeto com métodos para interagir com o cache
 */
export const useCache = async () => {
  const cache = Cache({
    basePath: relative(rootPath, './.cache'),
    hash: 'RSA-SHA1',
    ns: 'ws_lab',
  });

  /**
   * Recupera um item do cache
   * @template T - Tipo esperado do item no cache
   * @param item - Chave do item no cache
   * @returns Item do cache ou null se não encontrado
   */
  const get = async <T>(item: string): Promise<T | null> => {
    const result = await cache.get(item);

    if (result) {
      return result;
    }

    return null;
  };

  /**
   * Armazena um item no cache
   * @template T - Tipo do item a ser armazenado
   * @param item - Chave do item no cache
   * @param content - Conteúdo a ser armazenado
   */
  const set = async <T>(item: string, content: T) => {
    await cache.set(item, content);
  };

  /**
   * Remove um item do cache
   * @param item - Chave do item a ser removido
   */
  const del = async (item: string) => {
    await cache.remove(item);
  };

  return {
    get,
    set,
    del,
  };
};
