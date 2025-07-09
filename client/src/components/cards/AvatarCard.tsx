import { Box, Typography } from '@mui/material';
import { IFindModalResult } from '../../interfaces';

export const AvatarCard = ({ data }: { data: IFindModalResult }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <Box
        component={'picture'}
        sx={{
          display: 'inline-block',
          position: 'relative',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          border: '1px solid white',
          overflow: 'hidden',
        }}
      >
        <Box
          component={'img'}
          src={data.avatar}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
          }}
        />
      </Box>
      <Typography color='primary'>{data.name}</Typography>
    </Box>
  );
};
