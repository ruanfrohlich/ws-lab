import { Theme } from '@emotion/react';
import { Box, SxProps, TextField, Typography } from '@mui/material';
import { ChangeEvent } from 'react';

interface IAppInputProps {
  id: string;
  label: string;
  error: string;
  value: string;
  onChange: (evt: ChangeEvent) => void;
}

export const AppInput = (props: IAppInputProps) => {
  const { id, error, label, value, onChange } = props;
  const inputStyles: SxProps<Theme> = {
    backgroundColor: 'rgba(0,0,0,.6)',
  };

  return (
    <Box>
      <TextField
        variant='outlined'
        type={props.id === 'password' ? 'password' : 'text'}
        fullWidth
        sx={inputStyles}
        aria-invalid={!!error}
        {...{
          id,
          label,
          value,
          onChange,
        }}
      />
      {error && (
        <Typography variant='caption' color='error'>
          {error}
        </Typography>
      )}
    </Box>
  );
};
