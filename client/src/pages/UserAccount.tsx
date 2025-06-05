import { Box } from '@mui/material';
import { useUser } from '../contexts';
import { AppHelmet } from '../components';

export const UserAccount = () => {
  const { user } = useUser();

  if (user) {
    return (
      <Box component={'main'}>
        <AppHelmet title='Minha Conta' description='Gerencie sua conta' />
        <pre>
          <code>{JSON.stringify(user, null, 2)}</code>
        </pre>
      </Box>
    );
  }

  return <></>;
};
