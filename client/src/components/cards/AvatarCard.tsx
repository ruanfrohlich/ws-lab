import { alpha, Box, Typography } from '@mui/material';
import { IFindModalResult } from 'interfaces';
import { translateAccountType } from 'utils';

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography color='primary'>{data.name}</Typography>
        <Typography
          lineHeight={0.8}
          fontSize={14}
          sx={({ palette }) => ({
            color: alpha(palette.secondary.main, 0.6),
          })}
        >
          {translateAccountType(data.type)}
        </Typography>
      </Box>
    </Box>
  );
};
