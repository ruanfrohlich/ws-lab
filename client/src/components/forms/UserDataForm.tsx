import { Box, Button } from '@mui/material';
import { AppInput } from '../Input';
import { useUser, useUserDispatch } from '../../contexts';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { IUser, IUserDataForm, IUserDataFormProps } from '../../interfaces';
import { userService } from '../../services';

export const UserDataForm = (props: IUserDataFormProps) => {
  const { user } = useUser();
  const dispatch = useUserDispatch();

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
      const { success } = await userService().updateUser(formState.fields);

      if (success) {
        dispatch({
          type: 'setUser',
          payload: {
            logged: true,
            user: {
              ...user,
              ...(formState.fields as IUser),
            },
          },
        });
      }
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
    <Box
      component={'form'}
      noValidate
      sx={{
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
      onSubmit={handleSubmit}
    >
      <Box component={'div'}>
        <AppInput id='username' label='Username' error='' value={formState.fields.username} onChange={handleChange} />
      </Box>
      <Button variant='contained' color='primary' type='submit'>
        Atualizar
      </Button>
    </Box>
  );
};
