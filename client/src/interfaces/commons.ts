import { ReactNode } from 'react';

export interface IBaseModalProps {
  children: ReactNode;
  canClose: boolean;
  onClose?: () => void;
  closeFocus?: boolean;
  isOpen?: boolean;
}
