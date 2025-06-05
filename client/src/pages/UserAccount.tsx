import { Box } from '@mui/material';
import { useUser } from '../contexts';
import { AppHelmet } from '../components';

export const UserAccount = () => {
  const { user } = useUser();

  return (
    <Box component={'main'}>
      <AppHelmet title='Minha Conta' description='Gerencie sua conta' />
      <pre>
        <code className='language-javascript'>{JSON.stringify(user, null, 2).toString()}</code>
      </pre>
    </Box>
  );
};
