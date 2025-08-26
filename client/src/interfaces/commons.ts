import { ReactNode } from 'react';

export interface IBaseModalProps {
  children: ReactNode;
  canClose: boolean;
  onClose?: () => void;
  closeFocus?: boolean;
  isOpen?: boolean;
}

export interface IFindModalResult {
  slug: string;
  name: string;
  avatar: string;
  type: string;
}
