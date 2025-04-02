export interface ILoginFormFields {
  username: string;
  password: string;
}
export interface IRegisterFormFields {
  username: string;
  email: string;
  password: string;
}

export interface IRegisterFormState {
  fields: IRegisterFormFields;
  isValid: boolean;
  checkingEmail: boolean;
  checkingUsername: boolean;
  errors?: {
    [key: string]: string;
  };
}

export interface IFieldProps {
  id: string;
  label: string;
}
