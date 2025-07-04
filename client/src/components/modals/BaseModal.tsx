import { Box, Button } from '@mui/material';
import { Fragment, useEffect, useRef } from 'react';
import { IBaseModalProps } from '../../interfaces';
import { Close } from '@mui/icons-material';

export default ({ children, onClose, canClose, closeFocus }: IBaseModalProps) => {
  const modalBody = useRef<HTMLDivElement>(null);
  const modal = useRef<HTMLDivElement>(null);

  const checkFocus = (event: MouseEvent) => {
    const modalInner = modalBody.current;
    const clickedEl = event.target as HTMLDivElement;

    if (modalInner) {
      const isInner = !!clickedEl.closest(`.${modalInner.classList[1]}`);

      if (!isInner && onClose) {
        onClose();
      }
    }
  };

  useEffect(() => {
    if (closeFocus && modal.current) {
      modal.current.addEventListener('click', checkFocus);
    }
  }, []);

  return (
    <Box
      ref={modal}
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
        ref={modalBody}
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
