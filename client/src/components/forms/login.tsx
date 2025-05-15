import { Box, Button } from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Form } from 'react-router';
import { ILoginFormState } from '../../interfaces';
import { AppInput } from '../Input';
import { commonRegEx } from '../../utils';

export const FormLogin = () => {
  const [state, setState] = useState<ILoginFormState>({
    fields: {
      password: '',
      username: '',
    },
    showPassword: false,
    isValid: false,
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

    console.log('Login submitted');
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
        />
        <AppInput id='password' label='Senha' error='' value={state.fields.password} onChange={handleChange} />
        <Button type='submit' variant='contained' disabled={!state.isValid}>
          Entrar
        </Button>
      </Box>
    </Form>
  );
};
