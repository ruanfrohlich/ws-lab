import { JSX } from 'react';

export interface ILoginFormFields {
  username: string;
  password: string;
}

export interface ILoginFormState {
  fields: ILoginFormFields;
  showPassword: boolean;
  isValid: boolean;
  loginError?: 
}
export interface IRegisterFormFields {
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
