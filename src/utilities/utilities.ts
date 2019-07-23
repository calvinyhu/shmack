import validator from 'validator';
import { FormErrors, AuthState } from 'containers/Auth/Auth.models';

export const updateObject = (oldObject: any, newObject: any) => {
  return {
    ...oldObject,
    ...newObject,
  };
};

export const isEmpty = (value: string) => {
  return value === '';
};

export const validateSignupForm = (
  signupForm: AuthState,
  serverError: any = {},
) => {
  const errors: FormErrors = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };
  const isFirstNameTouched = signupForm.firstName.isTouched;
  const isLastNameTouched = signupForm.lastName.isTouched;
  const isEmailTouched = signupForm.email.isTouched;
  const isPasswordTouched = signupForm.password.isTouched;

  if (isFirstNameTouched && validator.isEmpty(signupForm.firstName.value))
    errors.firstName = 'Required';

  if (isLastNameTouched && validator.isEmpty(signupForm.lastName.value))
    errors.lastName = 'Required';

  if (isEmailTouched && !validator.isEmail(signupForm.email.value))
    errors.email = 'Invalid';
  if (isEmailTouched && validator.isEmpty(signupForm.email.value))
    errors.email = 'Required';

  if (
    isPasswordTouched &&
    !validator.isLength(signupForm.password.value, { min: 6 })
  )
    errors.password = 'Needs at least 6 chars';
  if (isPasswordTouched && validator.isEmpty(signupForm.password.value))
    errors.password = 'Required';

  if (serverError) {
    switch (serverError.code) {
      case 'auth/email-already-in-use':
        errors.email = 'Already in use';
        break;
      case 'auth/user-not-found':
        errors.email = 'Not found';
        break;
      case 'auth/wrong-password':
        errors.password = 'Incorrect';
        break;
      default:
        break;
    }
  }

  return errors;
};
