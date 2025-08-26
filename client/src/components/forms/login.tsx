import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { ILoginFormState } from 'interfaces';
import { AppInput } from '../Input';
import { commonRegEx } from 'utils';
import { useServices } from 'hooks';

export const FormLogin = () => {
  const { login } = useServices();
  const [state, setState] = useState<ILoginFormState>({
    fields: {
      password: '',
      username: '',
    },
    loading: false,
    showPassword: false,
    isValid: false,
    loginError: false,
  });

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = evt.target;

    setState((state) => {
      return {
        ...state,
        fields: {
          ...state.fields,
          [id]: value,
        },
      };
    });
  };

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    setState((state) => {
      return { ...state, loading: true, loginError: false };
    });

    const {
      fields: { username, password },
    } = state;

    const { success } = await login({
      username,
      password,
    }).finally(() => {
      setState((state) => {
        return { ...state, loading: false };
      });
    });

    if (!success) {
      setState((state) => {
        return {
          ...state,
          loginError: true,
        };
      });
    }
  };

  useEffect(() => {
    const { username, password } = state.fields;
    const patterns = commonRegEx;

    const isValid =
      (patterns.email.test(username) || patterns.username.test(username)) &&
      patterns.password.test(password);

    setState((state) => {
      return {
        ...state,
        isValid,
      };
    });
  }, [state.fields]);

  return (
    <form noValidate onSubmit={handleSubmit}>
      {state.loginError && (
        <Alert severity='error'>
          Opa! Parece que tivemos um problema ao conectar você, dá uma checada
          no seus dados de acesso ou tente novamente em alguns minutos.
        </Alert>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingBlock: 2,
          gap: 2,
        }}
      >
        <AppInput
          id='username'
          label='Username/E-mail'
          onChange={handleChange}
          error=''
          value={state.fields.username}
          autoComplete='username'
        />
        <AppInput
          id='password'
          label='Senha'
          error=''
          value={state.fields.password}
          onChange={handleChange}
          autoComplete='password'
        />
        <Button
          type='submit'
          variant='contained'
          disabled={!state.isValid}
          loading={state.loading}
        >
          {state.loading ? <CircularProgress size={20} /> : 'Entrar'}
        </Button>
      </Box>
    </form>
  );
};
