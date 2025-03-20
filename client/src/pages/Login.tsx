import { AppHelmet, AppLink, FormLogin } from '../components';
import { Box, Grid2 as Grid, Typography } from '@mui/material';
import heroLogin from '../assets/images/hero-login.jpg';

export const Login = () => {
  return (
    <Box>
      <AppHelmet title='Login' description='' />
      <Grid container spacing={4}>
        <Grid size={6}>
          <Box
            sx={{
              paddingBlock: '15%',
              height: '100%',
              maxWidth: '480px',
              margin: '0 30px 0 auto ',
            }}
          >
            <Typography
              component={'h1'}
              fontSize={48}
              sx={{
                fontFamily: '"Boldonse", system-ui',
              }}
            >
              Entrar
            </Typography>
            <Typography
              sx={{
                marginBottom: 2,
              }}
            >
              Acesse sua conta ou crie uma{' '}
              <Typography
                component={'span'}
                fontSize={12}
                sx={{
                  fontFamily: '"Boldonse", system-ui',
                  textDecoration: 'underline',
                }}
              >
                gratuitamente
              </Typography>{' '}
              agora mesmo!
            </Typography>
            <FormLogin />
            <Typography variant='body1'>
              Não possui conta?{' '}
              <AppLink to={'register'} hover>
                Cadastre-se
              </AppLink>
            </Typography>
          </Box>
        </Grid>
        <Grid
          size={6}
          sx={{
            overflow: 'hidden',
            height: 'calc(100vh - 30px)',
          }}
        >
          <Box
            component={'picture'}
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              aspectRatio: 560 / 920,
            }}
          >
            <Box
              component={'img'}
              src={heroLogin}
              alt={'Imagem divulgação'}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
