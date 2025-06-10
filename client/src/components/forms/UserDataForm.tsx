import { Box, Button } from '@mui/material';
import { AppInput } from '../Input';
import { useUser } from '../../contexts';
import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react';
import { IUserDataForm, IUserDataFormProps } from '../../interfaces';
import { useServices } from '../../hooks';
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
    },
    loading: false,
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
    } finally {
      setFormState((state) => {
        return { ...state, loading: false };
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

  return (
    <Fragment>
      {isOpenModal && <LogoutModal canClose onClose={() => setIsOpenModal(false)} />}
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
          <AppInput id='username' label='Username' error='' value={formState.fields.username} onChange={handleChange} />
          <AppInput id='email' label='E-mail' error='' value={formState.fields.email} onChange={handleChange} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant='contained' color='primary' type='submit'>
            Atualizar
          </Button>
          <Button variant='contained' color='error' type='button' onClick={() => setIsOpenModal(true)}>
            Desconectar
          </Button>
        </Box>
      </Box>
    </Fragment>
  );
};
