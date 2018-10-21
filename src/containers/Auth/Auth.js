import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Fade from 'react-reveal/Fade';

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
    firstName: '',
    lastName: '',
    email: 'email',
    password: ''
  };

  shouldComponentUpdate(nextProps, _) {
    const nextPath = nextProps.location.pathname;
    return (
      nextPath !== this.props.location.pathname ||
      nextProps.isLoading !== this.props.isLoading
    );
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleFormSubmit = event => {
    if (event) event.preventDefault();
    const userInfo = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    };
    const isSigningUp = this.props.location.pathname === paths.AUTH_SIGNUP;
    this.props.onAuth(userInfo, isSigningUp);
  };

  renderFormCTA = isSigningUp => {
    if (isSigningUp)
      return <h3>Hello! Sign up to help vote on popular menu items.</h3>;
    else return <h3>Welcome back! Log in to access to your places.</h3>;
  };

  renderForm = isSigningUp => {
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
      const formElements = this.renderForm(isSigningUp);
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
