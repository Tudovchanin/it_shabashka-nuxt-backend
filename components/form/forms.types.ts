export type BaseFormData = {
  email: string;
  password: string;
};

export type SignUpFormData = BaseFormData & {
  name: string;
};

export type FormErrorData = {
  errorEmail: string | null;
  errorPassword: string | null;
  errorName?: string | null;
};
