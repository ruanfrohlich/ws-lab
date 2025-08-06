import { AppHelmet, AppLink, FormLogin, FormRegister } from '../components';
import { Box, Grid2 as Grid, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { useUser } from '../contexts';
import { useNavigate } from 'react-router';

export const LoginRegister = () => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const { logged } = useUser();
  const nav = useNavigate();

  const imageHero = new URL('url:../assets/images/hero-login.jpg', import.meta.url).toString();

  const handleRegister = () => setIsRegister(!isRegister);

  useEffect(() => {
    if (logged && !isRegister) nav('/app');
  }, [logged]);

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
              {isRegister ? 'Cadastre-se' : 'Entrar'}
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
                sx={({ palette }) => ({
                  fontFamily: '"Boldonse", system-ui',
                  textDecoration: 'underline',
                  color: palette.secondary.main,
                })}
              >
                gratuitamente
              </Typography>{' '}
              agora mesmo!
            </Typography>
            {isRegister ? (
              <Fragment>
                <FormRegister onCancel={() => setIsRegister(false)} />
                <Typography variant='body1'>
                  Já possui conta?{' '}
                  <AppLink to={''} onClick={handleRegister}>
                    Entrar
                  </AppLink>
                </Typography>
              </Fragment>
            ) : (
              <Fragment>
                <FormLogin />
                <Typography variant='body1'>
                  Não possui conta?{' '}
                  <AppLink to={''} onClick={handleRegister}>
                    <Box component={'span'} sx={({ palette: { secondary } }) => ({ color: secondary.main })}>
                      Cadastre-se
                    </Box>
                  </AppLink>
                </Typography>
              </Fragment>
            )}
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
              src={imageHero}
              alt={'Imagem decoração'}
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
