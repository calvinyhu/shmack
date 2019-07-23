export interface AuthProps {
  isLoading: boolean;
  redirectPath: string;
  location: Location;
  error: {};
}

export interface AuthState {
  firstName: Field;
  lastName: Field;
  email: Field;
  password: Field;
}

interface Field {
  value: string;
  isTouched: boolean;
}

export interface FormErrors {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
