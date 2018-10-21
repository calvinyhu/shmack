import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Fade from 'react-reveal/Fade';
import validator from 'validator';

import styles from './Auth.module.scss';
import * as actions from 'store/actions/authActions';
import Aux from 'hoc/Auxiliary/Auxiliary';
import Button from 'components/UI/Button/Button';
import NavItem from 'components/UI/Button/NavItem/NavItem';
import Input from 'components/UI/Input/Input';
import * as paths from 'utilities/paths';

const mapStateToProps = state => ({
  isLoading: state.auth.isLoading,
  error: state.auth.error,
  redirectPath: state.auth.redirectPath
});

const mapDispatchToProps = {
  onAuth: actions.authenticate
};

class Auth extends Component {
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
  };

  handleFormSubmit = event => {
    if (event) event.preventDefault();
    const userInfo = {
      firstName: this.state.firstName.value,
      lastName: this.state.lastName.value,
      email: this.state.email.value,
      password: this.state.password.value
    };
    const isSigningUp = this.props.location.pathname === paths.AUTH_SIGNUP;
    this.props.onAuth(userInfo, isSigningUp);
  };

  validate = () => {
    const errors = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
    const isFirstNameTouched = this.state.firstName.isTouched;
    const isLastNameTouched = this.state.lastName.isTouched;
    const isEmailTouched = this.state.email.isTouched;
    const isPasswordTouched = this.state.password.isTouched;

    if (isFirstNameTouched && validator.isEmpty(this.state.firstName.value))
      errors.firstName = 'First Name is required';

    if (isLastNameTouched && validator.isEmpty(this.state.lastName.value))
      errors.lastName = 'Last Name is required';

    if (isEmailTouched && !validator.isEmail(this.state.email.value))
      errors.email = 'Invalid email';
    if (isEmailTouched && validator.isEmpty(this.state.email.value))
      errors.email = 'Email is required';

    if (
      isPasswordTouched &&
      !validator.isLength(this.state.password.value, { min: 6 })
    )
      errors.password = 'Password needs to be at least 6 characters';
    if (isPasswordTouched && validator.isEmpty(this.state.password.value))
      errors.password = 'Password is required';

    return errors;
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
          error={errors.password}
        />
        <div className={styles.FormButton}>
          <Button main click={this.handleFormSubmit}>
            {formButtonName}
          </Button>
        </div>
      </form>
    );

    const formSwitch = (
      <div className={styles.Switch}>
        <p>{switchCTA}</p>
        <NavItem link to={switchLink}>
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
    let errorMessage = null;
    let formCTA = null;
    let form = null;
    let formSwitch = null;
    const isSigningUp = this.props.location.pathname === paths.AUTH_SIGNUP;

    if (this.props.isLoading) {
      loadingPrompt = (
        <div className={styles.LoaderContainer}>
          <div className={styles.Loader}>
            {isSigningUp ? 'Signing Up...' : 'Logging In...'}
          </div>
        </div>
      );
    } else if (this.props.error) {
      errorMessage = (
        <div className={styles.Message}>{this.props.error.message}</div>
      );
    } else {
      const errors = this.validate();
      const formElements = this.renderForm(isSigningUp, errors);
      const cta = this.renderFormCTA(isSigningUp);
      formCTA = cta;
      form = formElements.form;
      formSwitch = formElements.formSwitch;
    }

    return (
      <div className={styles.AuthContainer}>
        <Fade>
          <div className={styles.Auth}>
            {loadingPrompt}
            {errorMessage}
            {formCTA}
            {form}
            {formSwitch}
          </div>
        </Fade>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
