import { Theme } from '@emotion/react';
import { Box, Button, SxProps, TextField } from '@mui/material';
import { Form } from 'react-router';

export const FormLogin = () => {
  const inputStyles: SxProps<Theme> = {
    backgroundColor: 'rgba(0,0,0,.6)',
  };

  return (
    <Form action='/login' noValidate>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingBlock: 2,
          gap: 2,
        }}
      >
        <TextField variant='outlined' label='Username/E-mail' fullWidth sx={inputStyles} />
        <TextField variant='outlined' label='Senha' fullWidth sx={inputStyles} />
        <Button type='submit' variant='contained'>
          Entrar
        </Button>
      </Box>
    </Form>
  );
};
