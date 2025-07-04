import { IBaseModalProps } from '../../interfaces';
import BaseModal from './BaseModal';

export const FindModal = ({ onClose }: Pick<IBaseModalProps, 'onClose'>) => {
  return (
    <BaseModal canClose={false} closeFocus {...{ onClose }}>
      Find Modal
    </BaseModal>
  );
};
