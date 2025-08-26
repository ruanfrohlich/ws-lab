import { Alert, Box, Button, Snackbar } from '@mui/material';
import { AppInput } from '../Input';
import { useUser } from 'contexts';
import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
import { IUserDataForm, IUserDataFormProps } from 'interfaces';
import { useServices } from 'hooks';
import { LogoutModal } from '../modals';

export const UserDataForm = (props: IUserDataFormProps) => {
  const { user } = useUser();
  const { updateUser } = useServices();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [formState, setFormState] = useState<IUserDataForm>({
    fields: {
      username: user?.username ?? '',
      email: user?.email ?? '',
      coverImage: user?.coverImage ?? '',
      profilePic: user?.profilePic ?? '',
      name: user?.name ?? '',
    },
    loading: false,
    success: false,
    error: false,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    setFormState((state) => {
      return {
        ...state,
        fields: {
          ...state.fields,
          [id]: value,
        },
      };
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setFormState((state) => {
      return { ...state, loading: true };
    });

    try {
      await updateUser(formState.fields);

      setFormState((state) => {
        return { ...state, loading: false, success: true };
      });
    } catch {
      setFormState((state) => {
        return { ...state, loading: false, error: true };
      });
    }
  };

  useEffect(() => {
    setFormState((state) => {
      return {
        ...state,
        fields: {
          ...state.fields,
          coverImage: props.cover ?? user?.coverImage ?? '',
          profilePic: props.image ?? user?.profilePic ?? '',
        },
      };
    });
  }, [props]);

  const isValid =
    formState.fields.email !== user?.email ||
    formState.fields.username !== user?.username ||
    formState.fields.profilePic !== user?.profilePic ||
    formState.fields.coverImage !== user?.coverImage ||
    formState.fields.name !== user?.name;

  return (
    <Fragment>
      {isOpenModal && (
        <LogoutModal canClose onClose={() => setIsOpenModal(false)} />
      )}
      <Snackbar
        open={formState.success}
        autoHideDuration={5000}
        onClose={() => {
          setFormState((state) => {
            return { ...state, success: false };
          });
        }}
      >
        <Alert color='success' variant='outlined' sx={{ width: '100%' }}>
          Dados atualizados com sucesso!
        </Alert>
      </Snackbar>
      <Snackbar
        open={formState.error}
        autoHideDuration={5000}
        onClose={() => {
          setFormState((state) => {
            return { ...state, error: false };
          });
        }}
      >
        <Alert color='error' variant='outlined' sx={{ width: '100%' }}>
          Tivemos um problema ao atualizar seus dados, tente novamente em alguns
          minutos!
        </Alert>
      </Snackbar>
      <Box
        component={'form'}
        noValidate
        sx={{
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
        onSubmit={handleSubmit}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <AppInput
            id='username'
            label='Username'
            error=''
            value={formState.fields.username}
            onChange={handleChange}
          />
          <AppInput
            id='name'
            label='Seu nome'
            error=''
            value={formState.fields.name}
            onChange={handleChange}
          />
          <AppInput
            id='email'
            label='E-mail'
            error=''
            value={formState.fields.email}
            onChange={handleChange}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant='contained'
            color='primary'
            type='submit'
            disabled={!isValid}
          >
            Atualizar
          </Button>
          <Button
            variant='contained'
            color='error'
            type='button'
            onClick={() => setIsOpenModal(true)}
          >
            Desconectar
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};
