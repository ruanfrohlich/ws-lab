import { AppHelmet } from '../components';
import { Box, Typography } from '@mui/material';

export function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        paddingBlock: 3,
      }}
    >
      <AppHelmet title='Home' description='Estudos com websocket + webRTC' />
      <Typography variant='h3' component={'h1'}>
        Home
      </Typography>
    </Box>
  );
}
