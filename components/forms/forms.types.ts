export type BaseFormData = {
  email: string;
  password: string;
  name?: string;
};


export type FormErrorData = {
  error_email: string | null;
  error_password: string | null;
  error_name?: string | null;
};
