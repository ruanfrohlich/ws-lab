import { Alert, Box, Button } from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Form, useNavigate } from 'react-router';
import { ILoginFormState } from '../../interfaces';
import { AppInput } from '../Input';
import { commonRegEx } from '../../utils';
import { userService } from '../../services';
import { useUserDispatch } from '../../contexts';

export const FormLogin = () => {
  const { login } = userService();
  const nav = useNavigate();
  const [state, setState] = useState<ILoginFormState>({
    fields: {
      password: '',
      username: '',
    },
    showPassword: false,
    isValid: false,
    loginError: false,
  });

  const userDispatch = useUserDispatch();

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
    const {
      fields: { username, password },
    } = state;

    const res = await login({
      username,
      password,
    });

    if (res.logged && res.user) {
      userDispatch({
        type: 'setUser',
        payload: {
          logged: true,
          user: res.user,
        },
      });

      return nav('/app');
    }

    return setState((state) => {
      return {
        ...state,
        loginError: true,
      };
    });
  };

  useEffect(() => {
    const { username, password } = state.fields;
    const patterns = commonRegEx;

    const isValid =
      (patterns.email.test(username) || patterns.username.test(username)) && patterns.password.test(password);

    setState((state) => {
      return {
        ...state,
        isValid,
      };
    });
  }, [state.fields]);

  return (
    <Form noValidate onSubmit={handleSubmit}>
      {state.loginError && (
        <Alert severity='error'>
          Opa! Parece que tivemos um problema ao conectar você, dá uma checada no seus dados de acesso ou tente
          novamente em alguns minutos.
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
        <Button type='submit' variant='contained' disabled={!state.isValid}>
          Entrar
        </Button>
      </Box>
    </Form>
  );
};
