import { Box } from '@mui/material';
import { IRegisterFormState } from '../interfaces';
import { Fragment } from 'react';
import { useServices } from './services';

export const useValidate = (updateState: (el: keyof IRegisterFormState, value: unknown) => void) => {
  const { findUser } = useServices();

  const validate = async (field: string, value: string) => {
    if (value !== '' && value.length > 3) {
      switch (field) {
        case 'name': {
          return true;
        }
        case 'email': {
          if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            updateState('checkingEmail', true);

            const hasUser = await findUser({ username: '', email: value });

            if (hasUser) {
              updateState('checkingEmail', false);
              updateState('errors', {
                email: 'O e-mail digitado já tem cadastro ≧◠‿◠≦✌',
              });

              return false;
            }

            updateState('checkingEmail', false);
            updateState('errors', { email: '' });

            return true;
          }

          updateState('checkingEmail', false);
          updateState('errors', {
            email: 'A gente precisa do seu e-mail válido pra seguir com o cadastro.',
          });

          return false;
        }
        case 'username': {
          if (/^[aA-zZ0-9_-]{3,24}$/g.test(value)) {
            updateState('checkingUsername', true);

            const hasUser = await findUser({ username: value, email: '' });

            if (hasUser) {
              updateState('checkingUsername', false);
              updateState('errors', {
                username: 'Opa! Esse username já foi abocanhado ( ͡╥ ͜ʖ ͡╥)',
              });

              return false;
            }

            updateState('checkingUsername', false);
            updateState('errors', { username: '' });

            return true;
          }

          updateState('errors', {
            username: 'Opa, verifica teu username ai :/',
          });

          return false;
        }
        case 'password': {
          if (value.length < 8) return false;

          if (/^(?=.*\d)(?=.*[aA-zZ])(?=.*[^\w\d\s:])([^\s]){8,}$/gm.test(value)) {
            updateState('errors', { password: '' });
            return true;
          }

          updateState('errors', {
            password: (
              <Fragment>
                Por favor, verifique a senha digitada. Precisa cumprir as seguintes regras:
                <Box component={'ul'}>
                  <li>Ter no mínimo 8 caracteres</li>
                  <li>1 letra maiúscula</li>
                  <li>1 letra minúscula</li>
                  <li>1 número</li>
                  <li>1 caractere especial</li>
                </Box>
              </Fragment>
            ),
          });

          return false;
        }
      }
    } else {
      updateState('errors', { [field]: '' });
    }
  };

  return {
    validate,
  };
};
