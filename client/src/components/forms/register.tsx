import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import { ChangeEvent, FormEvent, Fragment, useEffect, useRef, useState } from 'react';
import { AppInput } from '../Input';
import { useServices, useValidate } from '../../hooks';
import { IRegisterFormFields, IRegisterFormState } from '../../interfaces';
import { pull } from 'lodash';
import { Link } from 'react-router';

export const FormRegister = (props: { onCancel: () => void }) => {
  const [registerFieldsHeight, setRegisterFieldsHeight] = useState<number>(0);
  const registerFields = useRef<HTMLElement>(null);
  const [state, setState] = useState<IRegisterFormState>({
    loading: false,
    isValid: false,
    checkingEmail: false,
    checkingUsername: false,
    validatedFields: [],
    registerSuccess: false,
    fields: {
      username: '',
      email: '',
      password: '',
    },
  });
  const { registerUser } = useServices();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        case 'validatedFields': {
          return {
            ...state,
            validatedFields: [...value],
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

    updateState('fields', {
      [field]: value,
    });

    const isValid = await validate(field, value);

    if (isValid) {
      if (state.validatedFields.includes(field)) return;

      updateState('validatedFields', [...state.validatedFields, field]);
    } else if (state.validatedFields.includes(field)) {
      const updatedInvalid = pull(state.validatedFields, field);

      updateState('validatedFields', [...updatedInvalid]);
    }

    setRegisterFieldsHeight(registerFields.current?.getBoundingClientRect().height ?? 0);

    if (field === 'username' && !isValid) {
      setRegisterFieldsHeight(0);
    }
  };

  useEffect(() => {
    updateState(
      'isValid',
      Object.keys(state.fields).every((key) => state.validatedFields.includes(key)),
    );
  }, [state.validatedFields]);

  const flex = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      updateState('loading', true);

      const res = await registerUser(state.fields);

      if (res.success) return updateState('registerSuccess', true);

      if (res.error) {
        return updateState('errors', {
          register: res.error,
        });
      }

      return updateState('errors', {
        register: 'Tivemos um probleminha ao tentar realizar seu cadastro. Tente novamente em alguns minutos.',
      });
    } finally {
      updateState('loading', false);
    }
  };

  return (
    <Fragment>
      {state.registerSuccess && (
        <Alert severity='success'>
          Cadastro efetuado com sucesso! Você já pode acessar sua conta clicando{' '}
          <Typography
            component={'span'}
            fontSize={10}
            sx={{
              fontFamily: '"Boldonse", system-ui',
              textDecoration: 'underline',
            }}
          >
            <Link style={{ textDecoration: 'none', color: 'inherit' }} to={'/app/account'}>
              aqui
            </Link>
          </Typography>
          .
        </Alert>
      )}
      {state.errors?.register && <Alert severity='error'>{state.errors?.register}</Alert>}
      <form noValidate onSubmit={handleSubmit}>
        <Box sx={{ ...flex, paddingBlock: 2, gap: '0' }}>
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
              count={{
                current: state.fields.username.length,
                max: 24,
              }}
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
              maxHeight: registerFieldsHeight + 32,
              paddingTop: '32px',
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
                  {state.loading ? <CircularProgress size={20} /> : 'Cadastrar'}
                </Button>
                <Button
                  type='button'
                  variant='contained'
                  sx={({ palette }) => ({
                    backgroundColor: palette.error.dark,
                  })}
                  onClick={props.onCancel}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </form>
    </Fragment>
  );
};
