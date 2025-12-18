import { Button, Typography } from '@mui/material';
import BaseModal from './BaseModal';
import { useServices } from 'hooks';
import { IBaseModalProps } from 'interfaces';

export const LogoutModal = (
  props: Pick<IBaseModalProps, 'canClose' | 'onClose' | 'isOpen'>,
) => {
  const { logout } = useServices();

  return (
    <BaseModal {...props}>
      <Typography>Tem certeza que deseja desconectar sua conta?</Typography>
      <Button variant='contained' color='error' onClick={logout}>
        Desconectar
      </Button>
    </BaseModal>
  );
};
