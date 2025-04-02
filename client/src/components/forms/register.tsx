import { Box, Button, CircularProgress } from '@mui/material';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import userMock from '../../data/user-mock.json';
import { AppInput } from '../Input';
import { useValidate } from '../../hooks';
import { IRegisterFormFields, IRegisterFormState } from '../../interfaces';

export const FormRegister = () => {
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const [registerFieldsHeight, setRegisterFieldsHeight] = useState<number>(0);
  const registerFields = useRef<HTMLElement>(null);

  const [state, setState] = useState<IRegisterFormState>({
    isValid: false,
    checkingEmail: false,
    checkingUsername: false,
    fields: {
      username: '',
      email: '',
      password: '',
    },
  });

  const updateState = (el: keyof IRegisterFormState, value: any) => {
    setState((state) => {
      switch (el) {
        case 'errors': {
          return {
            ...state,
            errors: {
              ...state.errors,
              ...value,
            },
          };
        }
        case 'fields': {
          return {
            ...state,
            fields: {
              ...state.fields,
              ...value,
            },
          };
        }
        default: {
          return {
            ...state,
            [el]: value,
          };
        }
      }
    });
  };

  const { validate } = useValidate(updateState);

  const handleChange = async ({ target }: ChangeEvent) => {
    const { id, value } = target as HTMLInputElement;
    const field = id as keyof IRegisterFormFields;

    setState(({ fields, ...state }) => {
      return {
        ...state,
        fields: {
          ...fields,
          [field]: value,
        },
      };
    });

    const isValid = await validate(field, value);

    console.log(isValid);

    if (field === 'username' && isValid) {
      setRegisterFieldsHeight(registerFields.current?.getBoundingClientRect().height ?? 0);
    } else {
      setRegisterFieldsHeight(0);
    }
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
              opacity: state.checkingUsername ? '1' : '0',
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

            <Box
              sx={{
                position: 'relative',
              }}
            >
              <AppInput
                id='email'
                label='E-mail'
                onChange={handleChange}
                value={state.fields.email}
                error={state.errors?.email ?? ''}
              />
              <CircularProgress
                size={20}
                sx={{
                  position: 'absolute',
                  top: 17,
                  right: 20,
                  opacity: state.checkingEmail ? '1' : '0',
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
              }}
              padding={0}
            >
              <Button type='submit' variant='contained' fullWidth disabled={!state.isValid}>
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
