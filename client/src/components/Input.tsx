import { Theme } from '@emotion/react';
import { Box, Button, SxProps, TextField, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { ChangeEvent, useState } from 'react';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface IAppInputProps {
  id: string;
  label: string;
  error: string;
  value: string;
  count?: {
    current: number;
    max: number;
  };
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
}

export const AppInput = (props: IAppInputProps) => {
  const { id, error, label, value, onChange, count } = props;
  const inputStyles: SxProps<Theme> = {
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,.6)',
  };
  const [pwVisible, setPwVisible] = useState<boolean>(false);

  const attributes: { [key: string]: unknown } = {
    id,
    label,
    value,
    onChange,
  };

  if (id === 'password') {
    attributes.type = pwVisible ? 'text' : 'password';
  }

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
              color: count.current > count.max ? red[500] : 'white',
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
        {id === 'password' && (
          <Button
            sx={{
              position: 'absolute',
              top: '50%',
              right: 8,
              transform: 'translateY(-50%)',
            }}
            onClick={() => setPwVisible(!pwVisible)}
            title={pwVisible ? 'Esconder senha' : 'Exibir senha'}
          >
            {pwVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </Button>
        )}
      </Box>
      {error && (
        <Typography variant='caption' color='error'>
          {error}
        </Typography>
      )}
    </Box>
  );
};
