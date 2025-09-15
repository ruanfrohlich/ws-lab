import { alpha, Avatar, Box, Typography } from '@mui/material';
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
      <Avatar src={data.avatar} alt={data.name} />
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
