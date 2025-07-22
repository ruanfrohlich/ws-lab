import { capitalize } from '@mui/material';
import unidecode from 'unidecode';

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

export const commonRegEx = {
  email: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
  username: /^[aA-zZ0-9_-]{3,24}$/,
  password: /^(?=.*\d)(?=.*[aA-zZ])(?=.*[^\w\d\s:])([^\s]){8,}$/,
};

export const normalize = (str: string) => String(unidecode(str)).toLowerCase();
