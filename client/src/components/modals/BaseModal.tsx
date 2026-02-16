import { Box, Button, Fade, Modal } from '@mui/material';
import { Fragment, useEffect, useRef } from 'react';
import { IBaseModalProps } from 'interfaces';
import { Close } from '@mui/icons-material';

export default (props: IBaseModalProps) => {
  const modalBody = useRef<HTMLDivElement>(null);
  const modal = useRef<HTMLDivElement>(null);

  const checkFocus = (event: MouseEvent) => {
    const modalInner = modalBody.current;
    const clickedEl = event.target as HTMLDivElement;

    if (modalInner) {
      const isInner = !!clickedEl.closest(`.${modalInner.classList[1]}`);

      if (!isInner && props.onClose) {
        props.onClose();
      }
    }
  };

  useEffect(() => {
    if (props.closeFocus && modal.current) {
      modal.current.addEventListener('click', checkFocus);
    }
  }, [modal.current]);

  return (
    <Modal keepMounted open={props.isOpen}>
      <Fade in={props.isOpen}>
        <Box
          ref={modal}
          sx={{
            width: '100vw',
            height: '100vh',
            backgroundColor: 'transparent',
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
              {props.canClose && (
                <Button
                  variant='contained'
                  color='error'
                  onClick={props.onClose}
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
              {props.children}
            </Fragment>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};
