import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http';
import { relative } from 'path';
import { cwd } from 'process';
import { createBrotliCompress, createGzip } from 'zlib';

const acceptedOrigins = [
  'https://localhost:3005',
  'https://ws-lab-server.onrender.com',
];

/**
 * Registra uma mensagem no console com timestamp formatado para português brasileiro
 * @param message - A mensagem a ser registrada
 */
export const log = (message: string) => {
  message = `(${new Date().toLocaleString('pt-BR')}) - ${message}.`;
  console.log(message);
};

/**
 * Verifica se uma origem é permitida para requisições CORS
 * @param origin - A origem a ser verificada
 * @returns true se a origem for permitida, undefined caso contrário
 */
export const originIsAllowed = (origin: string) => {
  if (acceptedOrigins.includes(origin)) return true;
};

/**
 * Envia uma resposta HTTP comprimida usando Brotli ou Gzip baseado no cabeçalho Accept-Encoding
 * @param config - Configuração da resposta
 * @param config.status - Código de status HTTP
 * @param config.encodingHeader - Cabeçalho Accept-Encoding do cliente
 * @param config.res - Objeto de resposta do servidor
 * @param config.resHeaders - Cabeçalhos da resposta
 * @param config.content - Conteúdo a ser enviado
 */
export const compressedReponse = (config: {
  status: number;
  encodingHeader: string;
  res: ServerResponse;
  resHeaders: OutgoingHttpHeaders;
  content: unknown;
}) => {
  const accept = (encode: string) =>
    config.encodingHeader.indexOf(encode) !== -1;

  switch (true) {
    case accept('br'): {
      const br = createBrotliCompress();
      config.res.writeHead(config.status, {
        ...config.resHeaders,
        'content-encoding': 'br',
      });
      br.pipe(config.res);
      return br.end(config.content, 'utf-8');
    }
    case accept('gzip'): {
      const gzip = createGzip();
      config.res.writeHead(config.status, {
        ...config.resHeaders,
        'content-encoding': 'gzip',
      });
      gzip.pipe(config.res);
      return gzip.end(config.content, 'utf-8');
    }
    default: {
      config.res.writeHead(config.status, config.resHeaders);
      return config.res.end(config.content, 'utf-8');
    }
  }
};

/**
 * Extrai e parseia o corpo de uma requisição HTTP como JSON
 * @template T - Tipo esperado do corpo da requisição
 * @param req - Objeto de requisição HTTP
 * @returns Promise que resolve com o corpo parseado ou rejeita em caso de erro
 */
export const getBody = <T>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    const data: Buffer[] = [];

    req
      .on('data', (chunk: Buffer) => {
        data.push(chunk);
      })
      .on('end', () => {
        const body = Buffer.concat(data).toString();

        if (body) resolve(JSON.parse(body));
        else reject(null);
      });
  });
};

/**
 * Gera uma URL completa para acessar assets (recursos estáticos ou de usuário)
 * @param assetName - Nome do arquivo do asset
 * @param type - Tipo do asset ('user' para assets de usuário ou 'static' para assets estáticos)
 * @param userToken - Token/UUID do usuário (obrigatório para type 'user')
 * @returns URL completa para o asset ou string vazia se parâmetros inválidos
 */
export const assetURL = (
  assetName: string,
  type: 'user' | 'static',
  userToken?: string,
) => {
  switch (type) {
    case 'user': {
      if (!userToken) return '';

      return String(
        process.env.SITE_URL?.concat(
          '/api/assets/user/',
          userToken,
          '/',
          assetName,
        ),
      );
    }
    default: {
      return String(process.env.SITE_URL?.concat('/api/assets'));
    }
  }
};

export const onlyServer = process.argv.includes('--no-client');
export const isProd = process.argv.includes('--prod');
export const publicUrl = isProd ? '/ws-lab' : '/app';
export const rootPath = cwd(); // path to /server
export const clientRoot = relative(rootPath, '../client');
/**
 * Converte bytes para megabytes com duas casas decimais
 * @param num - Número em bytes
 * @returns Valor convertido em megabytes
 */
export const formatMB = (num: number) => {
  return Math.round((num / 1024 / 1024) * 100) / 100;
};
export { useCache } from './cache';
