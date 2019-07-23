import React, { useReducer } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// @ts-ignore
import Fade from 'react-reveal/Fade';

import styles from './Auth.module.scss';
import { AuthProps, AuthState } from './Auth.models';
import { authenticate, clearAuthError } from 'store/actions';
import Aux from 'hoc/Auxiliary/Auxiliary';
import Button from 'components/UI/Button/Button';
import NavItem from 'components/UI/Button/NavItem/NavItem';
import Input from 'components/UI/Input/Input';
import { LOGIN, SIGNUP } from 'utilities/paths';
import { validateSignupForm } from 'utilities/utilities';

const Auth = ({ redirectPath, location, isLoading, error }: AuthProps) => {
  const initialState = {
    firstName: { value: '', isTouched: false },
    lastName: { value: '', isTouched: false },
    email: { value: '', isTouched: false },
    password: { value: '', isTouched: false },
  };
  const reducer = (state: AuthState, newState: AuthState) => ({
    ...state,
    ...newState,
  });
  const [state, setState] = useReducer(reducer, initialState);

  const dispatch = useDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: { value: event.target.value, isTouched: true },
    });
    if (error) dispatch(clearAuthError);
  };

  const handleClearError = () => dispatch(clearAuthError);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    const isSigningUp = location.pathname === SIGNUP;
    const { firstName, lastName, email, password } = state;
    let newState = {
      firstName: { ...firstName },
      lastName: { ...lastName },
      email: { ...email, isTouched: true },
      password: { ...password, isTouched: true },
    };

    if (isSigningUp) {
      newState.firstName.isTouched = true;
      newState.lastName.isTouched = true;
    } else {
      newState.firstName.isTouched = false;
      newState.lastName.isTouched = false;
    }

    const errors = validateSignupForm(newState);

    if (Object.keys(errors).length === 0) {
      const userInfo = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      };

      dispatch(authenticate(userInfo, isSigningUp));
    } else setState(newState);
  };

  const renderFormCTA = (isSigningUp: boolean) => {
    if (isSigningUp)
      return <h3>Hello! Sign up to help vote on popular menu items.</h3>;
    else return <h3>Welcome back! Log in to access to your places.</h3>;
  };

  const renderForm = (isSigningUp: boolean, errors: {}) => {
    let signingUpInputs = null;
    let formButtonName = 'Log In';
    let switchCTA = 'New user?';
    let switchLink = SIGNUP;
    let switchName = 'Sign Up';

    const { firstName, lastName, email, password } = state;

    if (isSigningUp) {
      signingUpInputs = (
        <Aux>
          <Input
            required
            medium
            margin
            floatText
            type="text"
            name="firstName"
            placeholder="First Name"
            change={handleInputChange}
            value={firstName.value}
            // @ts-ignore
            error={errors.firstName}
          />
          <Input
            required
            medium
            margin
            floatText
            type="text"
            name="lastName"
            placeholder="Last Name"
            change={handleInputChange}
            value={lastName.value}
            // @ts-ignore
            error={errors.lastName}
          />
        </Aux>
      );
      formButtonName = 'Sign Up';
      switchCTA = 'Existing user?';
      switchLink = LOGIN;
      switchName = 'Log In';
    }

    const form = (
      <form className={styles.AuthForm} onSubmit={handleFormSubmit}>
        {signingUpInputs}
        <Input
          required
          medium
          margin
          floatText
          type="text"
          name="email"
          placeholder="Email"
          change={handleInputChange}
          value={email.value}
          // @ts-ignore
          error={errors.email}
        />
        <Input
          required
          medium
          margin
          floatText
          type="password"
          name="password"
          placeholder="Password"
          change={handleInputChange}
          value={password.value}
          // @ts-ignore
          error={errors.password}
        />
        <div className={styles.FormButton}>
          <Button main bold click={handleFormSubmit}>
            {formButtonName}
          </Button>
        </div>
      </form>
    );

    const formSwitch = (
      <div className={styles.Switch}>
        <p>{switchCTA}</p>
        <NavItem bold link to={switchLink} click={handleClearError}>
          {switchName}
        </NavItem>
      </div>
    );

    return { form: form, formSwitch: formSwitch };
  };

  if (redirectPath) return <Redirect to={redirectPath} />;

  let loadingPrompt = null;
  const isSigningUp = location.pathname === SIGNUP;
  let authClasses = styles.Auth;

  if (isLoading) {
    authClasses += ' ' + styles.Hide;
    loadingPrompt = (
      <div className={styles.LoaderContainer}>
        <div className={styles.Loader}>
          {isSigningUp ? 'Signing Up...' : 'Logging In...'}
        </div>
      </div>
    );
  }

  const signUpForm = { ...state };
  const errors = validateSignupForm(signUpForm, error);
  const formCTA = renderFormCTA(isSigningUp);
  const formElements = renderForm(isSigningUp, errors);
  const form = formElements.form;
  const formSwitch = formElements.formSwitch;

  return (
    <div className={styles.AuthContainer}>
      <div className={authClasses}>
        <Fade>
          {formCTA}
          {form}
          {formSwitch}
        </Fade>
      </div>
      {loadingPrompt}
    </div>
  );
};

export default Auth;
