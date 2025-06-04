import { AppHelmet } from '../components';
import { Box, Typography } from '@mui/material';
import { useUser } from '../contexts';

export function Home() {
  const { user } = useUser();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingBlock: 3,
      }}
    >
      <AppHelmet description='Estudos com websocket + webRTC' />
      <Typography variant='h3' component={'h1'}>
        Bem vindo {user?.username ?? ''}
      </Typography>
    </Box>
  );
}
