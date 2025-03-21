import { Box, Typography } from '@mui/material';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import notFound from '../assets/images/404.jpg';

export const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '15%',
        alignItems: 'center',
        height: 'calc(100vh - 30px)',
        backgroundImage: `url(${notFound})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        sx={{
          width: 150,
          height: 150,
        }}
      >
        <CodeOffIcon
          sx={{
            width: '100%',
            height: '100%',
            filter: 'drop-shadow(0px 10px 4px #424242);',
          }}
        />
      </Box>
      <Typography
        variant='h4'
        component={'h1'}
        sx={{
          textAlign: 'center',
          borderRadius: 6,
          padding: 2,
          backgroundColor: 'black',
        }}
      >
        Ops! Essa página ainda não foi criada (esses devs viu...)
      </Typography>
    </Box>
  );
};
