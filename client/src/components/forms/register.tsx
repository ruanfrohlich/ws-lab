import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import userMock from '../../data/user-mock.json';
import { AppInput } from '../Input';

interface IFormFields {
  username: string;
  email: string;
  password: string;
}

interface IFormState {
  fields: IFormFields;
  errors?: {
    [key: string]: string;
  };
}
interface IFieldProps {
  id: string;
  label: string;
}

export const FormRegister = () => {
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const [registerFieldsHeight, setRegisterFieldsHeight] = useState<number>(0);
  const registerFields = useRef<HTMLElement>(null);

  const [state, setState] = useState<IFormState>({
    fields: {
      username: '',
      email: '',
      password: '',
    },
  });

  const handleChange = ({ target }: ChangeEvent) => {
    const { id, value } = target as HTMLInputElement;
    const isValid = !/[^a-zA-Z0-9]/g.test(value);

    // if (id === 'username' && value.length > 3 && registerFields.current) {
    //   setCheckingUsername(true);

    //   new Promise<string>((res) => {
    //     if (isValid) {
    //       const hasUser = userMock.find((el) => el.username === value);

    //       if (hasUser) {
    //         setRegisterFieldsHeight(0);

    //         setState(({ errors, ...state }) => {
    //           return {
    //             ...state,
    //             errors: {
    //               ...errors,
    //               username: 'Opa! Esse nome de usuário já foi parceiro(a) :(',
    //             },
    //           };
    //         });
    //       } else {
    //         setRegisterFieldsHeight(registerFields.current?.getBoundingClientRect().height ?? 0);

    //         setState(({ fields, ...state }) => {
    //           return {
    //             ...state,
    //             fields: {
    //               ...fields,
    //             },
    //           };
    //         });
    //       }
    //     }

    //     res('ok');
    //   }).finally(() => {
    //     setTimeout(() => {
    //       setCheckingUsername(false);
    //     }, 2000);
    //   });
    // } else {
    //   setState(({ fields, ...state }) => {
    //     return {
    //       ...state,
    //       fields: {
    //         ...fields,
    //         [id]: value,
    //       },
    //     };
    //   });
    // }

    setState(({ fields, ...state }) => {
      return {
        ...state,
        fields: {
          ...fields,
          [id]: value,
        },
      };
    });
  };

  const flex = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  const handleSubmit = () => console.log('form enviado');

  return (
    <form noValidate onSubmit={handleSubmit}>
      <Box sx={{ ...flex, paddingBlock: 2 }}>
        <Box
          sx={{
            position: 'relative',
          }}
        >
          <AppInput
            id='username'
            value={state.fields.username}
            onChange={handleChange}
            label='Crie um username especial'
            error={state.errors?.username ?? ''}
          />
          <CircularProgress
            size={20}
            sx={{
              position: 'absolute',
              top: 17,
              right: 20,
              opacity: checkingUsername ? '1' : '0',
            }}
          />
        </Box>
        <Box
          sx={{
            transition: '600ms ease-in-out',
            maxHeight: registerFieldsHeight,
            overflow: 'hidden',
          }}
        >
          <Box sx={flex} padding={0} ref={registerFields}>
            <AppInput
              id='password'
              label='Senha'
              onChange={handleChange}
              error={state.errors?.password ?? ''}
              value={state.fields.password}
            />
            <AppInput
              id='email'
              label='E-mail'
              onChange={handleChange}
              value={state.fields.email}
              error={state.errors?.email ?? ''}
            />
            <Box
              sx={{
                display: 'flex',
                gap: 2,
              }}
              padding={0}
            >
              <Button type='submit' variant='contained' fullWidth>
                Cadastrar
              </Button>
              <Button
                type='button'
                variant='contained'
                sx={({ palette }) => ({
                  backgroundColor: palette.error.dark,
                })}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </form>
  );
};
