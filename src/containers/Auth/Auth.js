import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Fade from 'react-reveal/Fade';
import PropTypes from 'prop-types';

import styles from './Auth.module.scss';
import * as authActions from 'store/actions/authActions';
import Aux from 'hoc/Auxiliary/Auxiliary';
import Button from 'components/UI/Button/Button';
import NavItem from 'components/UI/Button/NavItem/NavItem';
import Input from 'components/UI/Input/Input';
import * as paths from 'utilities/paths';
import { validateSignupForm } from 'utilities/utilities';

const mapStateToProps = state => ({
  isLoading: state.auth.isLoading,
  error: state.auth.error,
  redirectPath: state.auth.redirectPath
});

const mapDispatchToProps = {
  onAuth: authActions.authenticate,
  onClearError: authActions.clearError
};

class Auth extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    redirectPath: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
    onClearError: PropTypes.func.isRequired,
    onAuth: PropTypes.func.isRequired
  };

  state = {
    firstName: { value: '', isTouched: false },
    lastName: { value: '', isTouched: false },
    email: { value: '', isTouched: false },
    password: { value: '', isTouched: false }
  };

  handleInputChange = event => {
    this.setState({
      [event.target.name]: { value: event.target.value, isTouched: true }
    });
    if (this.props.error) this.props.onClearError();
  };

  handleClearError = () => {
    this.props.onClearError();
  };

  handleFormSubmit = event => {
    if (event) event.preventDefault();

    const isSigningUp = this.props.location.pathname === paths.AUTH_SIGNUP;
    let newState = {
      firstName: { ...this.state.firstName },
      lastName: { ...this.state.lastName },
      email: { ...this.state.email, isTouched: true },
      password: { ...this.state.password, isTouched: true }
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
        firstName: this.state.firstName.value,
        lastName: this.state.lastName.value,
        email: this.state.email.value,
        password: this.state.password.value
      };

      this.props.onAuth(userInfo, isSigningUp);
    } else this.setState(newState);
  };

  renderFormCTA = isSigningUp => {
    if (isSigningUp)
      return <h3>Hello! Sign up to help vote on popular menu items.</h3>;
    else return <h3>Welcome back! Log in to access to your places.</h3>;
  };

  renderForm = (isSigningUp, errors) => {
    let signingUpInputs = null;
    let formButtonName = 'Log In';
    let switchCTA = 'New user?';
    let switchLink = paths.AUTH_SIGNUP;
    let switchName = 'Sign Up';

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
            change={this.handleInputChange}
            value={this.state.firstName.value}
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
            change={this.handleInputChange}
            value={this.state.lastName.value}
            error={errors.lastName}
          />
        </Aux>
      );
      formButtonName = 'Sign Up';
      switchCTA = 'Existing user?';
      switchLink = paths.AUTH_LOGIN;
      switchName = 'Log In';
    }

    const form = (
      <form className={styles.AuthForm} onSubmit={this.handleFormSubmit}>
        {signingUpInputs}
        <Input
          required
          medium
          margin
          floatText
          type="text"
          name="email"
          placeholder="Email"
          change={this.handleInputChange}
          value={this.state.email.value}
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
          change={this.handleInputChange}
          value={this.state.password.value}
          error={errors.password}
        />
        <div className={styles.FormButton}>
          <Button main bold click={this.handleFormSubmit}>
            {formButtonName}
          </Button>
        </div>
      </form>
    );

    const formSwitch = (
      <div className={styles.Switch}>
        <p>{switchCTA}</p>
        <NavItem bold link to={switchLink} click={this.handleClearError}>
          {switchName}
        </NavItem>
      </div>
    );

    return { form: form, formSwitch: formSwitch };
  };

  render() {
    if (this.props.redirectPath)
      return <Redirect to={this.props.redirectPath} />;

    let loadingPrompt = null;
    const isSigningUp = this.props.location.pathname === paths.AUTH_SIGNUP;
    let authClasses = styles.Auth;

    if (this.props.isLoading) {
      authClasses += ' ' + styles.Hide;
      loadingPrompt = (
        <div className={styles.LoaderContainer}>
          <div className={styles.Loader}>
            {isSigningUp ? 'Signing Up...' : 'Logging In...'}
          </div>
        </div>
      );
    }

    const signUpForm = { ...this.state };
    const errors = validateSignupForm(signUpForm, this.props.error);
    const formCTA = this.renderFormCTA(isSigningUp);
    const formElements = this.renderForm(isSigningUp, errors);
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
