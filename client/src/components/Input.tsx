import { Theme } from '@emotion/react';
import { Box, SxProps, TextField, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

interface IAppInputProps {
  id: string;
  label: string;
  error: string;
  value: string;
  count?: {
    current: number;
    max: number;
  };
  onChange: (evt: ChangeEvent) => void;
}

export const AppInput = (props: IAppInputProps) => {
  const { id, error, label, value, onChange, count } = props;
  const inputStyles: SxProps<Theme> = {
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,.6)',
    '::before': {
      position: 'absolute',
      content: 'test',
      top: 6,
      left: 0,
    },
  };

  const attributes: { [key: string]: unknown } = {
    id,
    label,
    value,
    onChange,
  };

  return (
    <Box>
      <Box sx={{ position: 'relative' }}>
        {count && (
          <Box
            component={'span'}
            sx={{
              position: 'absolute',
              right: '2px',
              bottom: '-20px',
              fontSize: '12px',
            }}
          >
            {count.current} / {count.max}
          </Box>
        )}
        <TextField
          variant='outlined'
          type={props.id === 'password' ? 'password' : 'text'}
          fullWidth
          sx={inputStyles}
          aria-invalid={!!error}
          {...attributes}
        />
      </Box>
      {error && (
        <Typography variant='caption' color='error'>
          {error}
        </Typography>
      )}
    </Box>
  );
};
