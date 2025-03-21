import { Theme } from '@emotion/react';
import { Box, Button, CircularProgress, SxProps, TextField, Typography } from '@mui/material';
import { FormEvent, useEffect, useRef, useState } from 'react';
import userMock from '../../data/user-mock.json';

interface IFormFields {
  username: string;
  email: string;
  password: string;
}

export const FormRegister = () => {
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const [alreadyExists, setAlreadyExists] = useState<boolean>(false);
  const [registerFieldsHeight, setRegisterFieldsHeight] = useState<number>(0);
  const registerFields = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState<IFormFields>({
    username: '',
    email: '',
    password: '',
  });

  const inputStyles: SxProps<Theme> = {
    backgroundColor: 'rgba(0,0,0,.6)',
  };

  const handleChange = (event: FormEvent) => {
    const { id, value } = event.currentTarget as HTMLInputElement;
    const field = id as unknown as keyof IFormFields;

    if (field === 'username' && value.length <= 3) {
      setAlreadyExists(false);
      setRegisterFieldsHeight(0);
    }

    if (field === 'username' && value.length > 3 && registerFields.current) {
      setCheckingUsername(true);

      new Promise<string>((res) => {
        const hasUser = userMock.find((el) => el.username === value);

        if (hasUser) {
          setAlreadyExists(true);
          setRegisterFieldsHeight(0);
        } else {
          setAlreadyExists(false);
          setRegisterFieldsHeight(registerFields.current?.getBoundingClientRect().height ?? 0);

          setFormData((state) => {
            return {
              ...state,
              username: value,
            };
          });
        }

        res('ok');
      }).finally(() => {
        setTimeout(() => {
          setCheckingUsername(false);
        }, 2000);
      });
    } else {
      setFormData((state) => {
        return {
          ...state,
          [id]: value,
        };
      });
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
          <TextField
            variant='outlined'
            label='Crie um username legal!'
            fullWidth
            sx={inputStyles}
            id='username'
            onChange={handleChange}
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
          {alreadyExists && (
            <Typography variant='caption' color='error'>
              Opa! Esse nome de usuário já foi parceiro(a) :(
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            transition: '600ms ease-in-out',
            maxHeight: registerFieldsHeight,
            overflow: 'hidden',
          }}
        >
          <Box sx={flex} padding={0} ref={registerFields}>
            <TextField variant='outlined' label='Senha' fullWidth sx={inputStyles} />
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
