import { Box, Typography } from '@mui/material';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import { AppHelmet } from 'components';
import { appStyled } from 'utils';

export const Error = (props: { type: 'notFound' | 'appError' }) => {
  const errorBG = new URL(
    'url:../assets/images/404.jpg?as=webp',
    import.meta.url,
  );

  if (props.type === 'appError') {
    appStyled(document.body, {
      margin: 0,
    });
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        paddingTop: props.type === 'notFound' ? '15%' : '0',
        alignItems: 'center',
        height: props.type === 'notFound' ? 'calc(100vh - 30px)' : '100vh',
        backgroundImage: `url(${errorBG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <AppHelmet
        title={
          props.type === 'notFound'
            ? 'Página não encontrada'
            : 'Tivemos um problema'
        }
        description='Tivemos um problema ao tentar exibir essa página.'
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
          borderRadius: 4,
          padding: 2,
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      >
        {props.type === 'appError'
          ? 'Opa! Tivemos um problema ao tentar exibir essa página (ᴗ˳ᴗ)'
          : 'Opa! Essa página ainda não foi criada (ᴗ˳ᴗ)'}
      </Typography>
    </Box>
  );
};
