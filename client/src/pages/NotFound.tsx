import { Typography } from '@mui/material';

export const NotFound = () => {
  return (
    <Typography
      variant='h1'
      component={'h1'}
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      404 {':('}
    </Typography>
  );
};
