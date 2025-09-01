import { capitalize } from '@mui/material';
import { IUserGoogle } from 'interfaces';
import { deburr, toLower } from 'lodash';
import { CSSProperties } from 'react';

export { configProvider } from './configProvider';

export * from './enums';

/**
 * Traduz mensagens de erro da API para português brasileiro
 * @param error - Mensagem de erro em inglês
 * @returns Mensagem de erro traduzida
 */
export const translateError = (error: string) => {
  switch (error) {
    case 'User already exists': {
      return 'Esse usuário já está cadastrado.';
    }
    default: {
      return 'Tivemos um problema. Tente novamente em alguns minutos.';
    }
  }
};

export { appTheme } from './theme';

/**
 * Traduz nomes de rotas/páginas para português brasileiro
 * @param path - Nome da rota em inglês
 * @returns Nome da rota traduzido
 */
export const translatePathname = (path: string) => {
  switch (path) {
    case 'join': {
      return 'Entrar';
    }
    case 'account': {
      return 'Minha Conta';
    }
    default: {
      return capitalize(path);
    }
  }
};

/**
 * Traduz tipos de conta para português brasileiro
 * @param type - Tipo de conta em inglês
 * @returns Tipo de conta traduzido
 */
export const translateAccountType = (type: string) => {
  switch (type) {
    case 'user': {
      return 'Usuário';
    }
    case 'channel': {
      return 'Canal';
    }
    case 'server': {
      return 'Servidor';
    }
  }
};

export const commonRegEx = {
  email: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
  username: /^[aA-zZ0-9_-]{3,24}$/,
  password: /^(?=.*\d)(?=.*[aA-zZ])(?=.*[^\w\d\s:])([^\s]){8,}$/,
};

/**
 * Normaliza string removendo acentos e convertendo para minúsculas
 * @param str - String a ser normalizada
 * @returns String normalizada
 */
export const normalize = (str: string) => toLower(deburr(str));

/**
 * Aplica estilos CSS a um elemento DOM
 * @param el - Elemento HTML a ser estilizado
 * @param styles - Objeto com propriedades CSS
 * @returns Estilo do elemento atualizado
 */
export const appStyled = (el: HTMLElement, styles: CSSProperties) => {
  return Object.assign(el.style, styles);
};

/**
 * Decodifica um token JWT e extrai dados do usuário Google
 * @param token - Token JWT a ser decodificado
 * @returns Dados do usuário Google extraídos do token
 */
export const decodeJWT = (token: string): IUserGoogle => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
  return JSON.parse(jsonPayload);
};

/**
 * Converte um Blob em Data URL usando FileReader
 * @param blob - Blob a ser convertido
 * @returns Promise que resolve com a Data URL do blob
 */
export const getDataURL = (blob: Blob) => {
  return new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onloadend = () => res(String(reader.result));
    reader.onerror = () => rej(reader.error);
    reader.readAsDataURL(blob);
  });
};

/**
 * Gera uma senha aleatória com caracteres alfanuméricos e especiais
 * @param length - Comprimento desejado da senha
 * @returns Senha aleatória gerada
 */
export const randomPassword = (length: number) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
  let password = '';

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
};
