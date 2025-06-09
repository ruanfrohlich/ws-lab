import { useUser } from '../contexts';
import { AppHelmet, UserDataForm, Wrapper } from '../components';
import { Fragment } from 'react/jsx-runtime';
import { Box, Button } from '@mui/material';
import { Edit, Delete, Person } from '@mui/icons-material';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { isNull } from 'lodash';
import { configProvider, COOKIES } from '../utils';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

export const UserAccount = () => {
  const { user } = useUser();
  const { appRoot } = configProvider();
  const photoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [userImage, setUserImage] = useState<string | undefined>(user?.profilePic);
  const [coverImage, setCoverImage] = useState<string | undefined>(user?.coverImage);
  const nav = useNavigate();

  const handleRemovePhoto = () => {
    setUserImage('');
  };

  const handleInputFile = (event: ChangeEvent<HTMLInputElement>) => {
    const { files, id } = event.target;

    if (!isNull(files)) {
      const file = /\.(jpe?g|png|webp)$/i.test(files[0].name) ? files[0] : null;
      console.log(file);

      if (file) {
        try {
          const reader = new FileReader();

          reader.onloadend = function () {
            const result = reader.result?.toString() ?? '';

            if (id === 'cover-input') setCoverImage(result);
            else setUserImage(result);

            event.target.value = '';
          };

          reader.readAsDataURL(file);
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center',
  };

  useEffect(() => {
    if (!Cookies.get(COOKIES.userToken)) nav(appRoot);
  }, [user]);

  if (user) {
    return (
      <Fragment>
        <AppHelmet title='Minha Conta' description='Gerencie sua conta' />
        <Box
          component={'picture'}
          sx={{
            position: 'relative',
            display: 'inline-block',
            width: '100%',
            height: '300px',
            ':hover': {
              '.cover-btn': {
                opacity: 1,
              },
            },
          }}
        >
          <Box
            component={'img'}
            src={coverImage ?? user.coverImage ?? 'https://picsum.photos/1920/1080'}
            sx={imageStyles}
          />
          <Button
            className='cover-btn'
            variant='outlined'
            color='info'
            size='small'
            sx={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              opacity: 0,
              transition: 'opacity 250ms ease-in-out',
              zIndex: 2,
            }}
            onClick={() => coverRef.current?.click()}
          >
            Alterar capa
          </Button>
          <input ref={coverRef} type='file' id='cover-input' onChange={handleInputFile} hidden />
        </Box>
        <Wrapper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ position: 'relative' }} pb={4}>
            <input ref={photoRef} type='file' id='image-input' hidden onChange={handleInputFile} />
            <Box
              component={'picture'}
              sx={{
                display: 'block',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '50%',
                width: '150px',
                height: '150px',
                border: '1px solid gray',
                filter: 'drop-shadow(0 10px 12px rgba(255,255,255,.2))',
                backgroundColor: 'goldenrod',
              }}
            >
              {userImage || (user.profilePic && userImage !== '') ? (
                <Box
                  component={'img'}
                  src={userImage ?? user.profilePic}
                  alt='Imagem de perfil'
                  draggable='false'
                  sx={imageStyles}
                />
              ) : (
                <Person sx={imageStyles} />
              )}
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: 15,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1,
              }}
            >
              <Button
                variant='contained'
                color='info'
                size='small'
                startIcon={<Edit />}
                onClick={() => photoRef.current?.click()}
              >
                Alterar
              </Button>
              <Button variant='contained' color='error' size='small' endIcon={<Delete />} onClick={handleRemovePhoto}>
                Remover
              </Button>
            </Box>
          </Box>
          <UserDataForm image={userImage} cover={coverImage} />
        </Wrapper>
      </Fragment>
    );
  }

  return <></>;
};
