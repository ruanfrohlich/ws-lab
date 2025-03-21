import { capitalize } from '@mui/material';

export { configProvider } from './configProvider';

export const translatePathname = (path: string) => {
  switch (path) {
    case 'join': {
      return 'Entrar';
    }
    case 'test': {
      return 'Teste';
    }
    default: {
      capitalize(path);
    }
  }
};
