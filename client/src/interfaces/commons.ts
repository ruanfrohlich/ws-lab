import { ReactNode } from 'react';

export interface IBaseModalProps {
  children: ReactNode;
  canClose: boolean;
  onClose?: () => void;
}
