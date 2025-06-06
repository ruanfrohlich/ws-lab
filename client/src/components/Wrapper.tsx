import { Theme } from '@emotion/react';
import { Box, SxProps } from '@mui/material';
import { ReactNode } from 'react';

export const Wrapper = ({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) => {
  return (
    <Box
      component={'div'}
      sx={{
        position: 'relative',
        width: '100%',
        padding: 5,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
