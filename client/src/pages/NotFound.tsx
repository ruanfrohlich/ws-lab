import { Box, Typography } from '@mui/material';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import notFound from 'url:../assets/images/404.jpg';
import { AppHelmet } from '../components';

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
      <AppHelmet
        title='Página não encontrada'
        description='A página solicitada não existe ou não está mais disponível.'
      />
      <Box
        mb={8}
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
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      >
        Opa! Essa página ainda não foi criada (ᴗ˳ᴗ)
      </Typography>
    </Box>
  );
};
