import { Box, Button } from '@mui/material';
import { Fragment } from 'react';
import { IBaseModalProps } from '../../interfaces';
import { Close } from '@mui/icons-material';

export default ({ children, onClose, canClose }: IBaseModalProps) => {
  return (
    <Box
      sx={{
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,.8)',
        width: '100vw',
        height: '100vh',
        animation: '250ms ease-in-out fadeIn',
        zIndex: 1002,
      }}
    >
      <Box
        sx={({ palette }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
          border: '1px solid white',
          borderRadius: '15px',
          backgroundColor: palette.primary.dark,
          padding: '20px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        })}
      >
        <Fragment>
          {canClose && (
            <Button
              variant='contained'
              color='error'
              onClick={onClose}
              startIcon={<Close />}
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: 0,
                width: '30px',
                minWidth: 'auto',
                height: '30px',
                padding: 0,
                margin: 0,
                borderRadius: '50%',
                transform: 'translate(8px, -14px)',
                span: {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  margin: 0,
                },
              }}
            >
              Fechar modal
            </Button>
          )}
          {children}
        </Fragment>
      </Box>
    </Box>
  );
};
