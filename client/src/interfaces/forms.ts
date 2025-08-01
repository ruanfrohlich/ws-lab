import { JSX } from 'react';
import { IUser } from './user';

export interface ILoginFormFields {
  username: string;
  password: string;
}

export interface IUserDataFormProps {
  image?: string;
  cover?: string;
}

export interface IUserDataForm {
  fields: Pick<IUser, 'username' | 'email' | 'profilePic' | 'coverImage' | 'name'>;
  loading: boolean;
  success: boolean;
  error: boolean;
}

export interface ILoginFormState {
  fields: ILoginFormFields;
  showPassword: boolean;
  isValid: boolean;
  loginError?: boolean;
  loading: boolean;
}
export interface IRegisterFormFields {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface IRegisterFormState {
  loading: boolean;
  fields: IRegisterFormFields;
  isValid: boolean;
  checkingEmail: boolean;
  checkingUsername: boolean;
  validatedFields: string[];
  registerSuccess: boolean;
  errors?: {
    [key: string]: string & JSX.Element;
  };
}

export interface IFieldProps {
  id: string;
  label: string;
}
