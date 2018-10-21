import validator from 'validator';

export const updateObject = (oldObject, newObject) => {
  return {
    ...oldObject,
    ...newObject
  };
};

export const isEmpty = value => {
  return value === '';
};

export const validateSignupForm = signupForm => {
  const errors = {};
  const isFirstNameTouched = signupForm.firstName.isTouched;
  const isLastNameTouched = signupForm.lastName.isTouched;
  const isEmailTouched = signupForm.email.isTouched;
  const isPasswordTouched = signupForm.password.isTouched;

  if (isFirstNameTouched && validator.isEmpty(signupForm.firstName.value))
    errors.firstName = 'First Name is required';

  if (isLastNameTouched && validator.isEmpty(signupForm.lastName.value))
    errors.lastName = 'Last Name is required';

  if (isEmailTouched && !validator.isEmail(signupForm.email.value))
    errors.email = 'Invalid email';
  if (isEmailTouched && validator.isEmpty(signupForm.email.value))
    errors.email = 'Email is required';

  if (
    isPasswordTouched &&
    !validator.isLength(signupForm.password.value, { min: 6 })
  )
    errors.password = 'Password needs to be at least 6 characters';
  if (isPasswordTouched && validator.isEmpty(signupForm.password.value))
    errors.password = 'Password is required';

  return errors;
};
