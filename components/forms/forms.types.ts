export type BaseFormData = {
  email: string;
  password: string;
  name?: string;
};


export type FormErrorData = {
  errorEmail: string | null;
  errorPassword: string | null;
  errorName?: string | null;
};
