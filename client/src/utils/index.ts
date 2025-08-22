import { capitalize } from '@mui/material';
import { IUserGoogle } from 'interfaces';
import { deburr, toLower } from 'lodash';
import { CSSProperties } from 'react';

export { configProvider } from './configProvider';
export * from './enums';
export const translateError = (error: string) => {
  console.log(error);

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

export const normalize = (str: string) => toLower(deburr(str));

export const appStyled = (el: HTMLElement, styles: CSSProperties) => {
  return Object.assign(el.style, styles);
};

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

export const getDataURL = (blob: Blob) => {
  return new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onloadend = () => res(String(reader.result));
    reader.onerror = () => rej(reader.error);
    reader.readAsDataURL(blob);
  });
};
