import { Theme } from '@emotion/react';
import { Box, Button, CircularProgress, SxProps, TextField, Typography } from '@mui/material';
import { FormEvent, useRef, useState } from 'react';
import userMock from '../../data/user-mock.json';

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

  const [formState, setFormState] = useState<IFormState>({
    fields: {
      username: '',
      email: '',
      password: '',
    },
  });

  const handleChange = (event: FormEvent) => {
    const { id, value } = event.currentTarget as HTMLInputElement;
    const field = id as unknown as keyof IFormFields;

    // if (field === 'username' && value.length <= 3) {
    //   setRegisterFieldsHeight(0);
    // }

    // if (field === 'username' && value.length > 3 && registerFields.current) {
    //   setCheckingUsername(true);

    //   new Promise<string>((res) => {
    //     const isValid = !/[^a-zA-Z0-9]/g.test(value);

    //     if (isValid) {
    //       const hasUser = userMock.find((el) => el.username === value);

    //       if (hasUser) {
    //         setRegisterFieldsHeight(0);

    //         setFormState(({ errors, ...state }) => {
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

    //         setFormState(({ fields, ...state }) => {
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
    //   setFormState(({ fields, ...state }) => {
    //     return {
    //       ...state,
    //       fields: {
    //         ...fields,
    //         [field]: value,
    //       },
    //     };
    //   });
    // }

    setFormState(({ fields, ...state }) => {
      return {
        ...state,
        fields: {
          ...fields,
          [field]: value,
        },
      };
    });
  };

  const flex = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  const Field = ({ id, ...props }: IFieldProps) => {
    const fieldName = id as keyof IFormFields;
    const error = formState.errors?.[fieldName];

    const inputStyles: SxProps<Theme> = {
      backgroundColor: 'rgba(0,0,0,.6)',
    };

    return (
      <Box>
        <TextField
          id={id}
          variant='outlined'
          label={props.label}
          type={fieldName === 'password' ? 'password' : 'text'}
          fullWidth
          sx={inputStyles}
          onChange={handleChange}
          value={formState.fields[fieldName]}
        />
        {error && (
          <Typography variant='caption' color='error'>
            {error}
          </Typography>
        )}
      </Box>
    );
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
          <Field id='username' label='Crie um username legal!' />
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
            <Field id='password' label='Senha' />
            <Field id='email' label='E-mail' />
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
