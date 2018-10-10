import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Fade from 'react-reveal/Fade';

import classes from './Auth.css';
import * as actions from '../../store/actions/authActions';
import * as paths from '../../utilities/paths';
import Button from '../../components/UI/Button/Button';
import NavItem from '../../components/UI/Button/NavItem/NavItem';
import Input from '../../components/UI/Input/Input';
import Aux from '../../hoc/Auxiliary/Auxiliary';

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    redirectPath: state.auth.redirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (userInfo, isSigningUp) =>
      dispatch(actions.authenticate(userInfo, isSigningUp))
  };
};

class Auth extends Component {
  state = {
    isSigningUp: this.props.location.pathname === paths.AUTH_SIGNUP,
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  componentWillReceiveProps(nextProps) {
    const nextPath = nextProps.location.pathname;
    this.setState({ isSigningUp: nextPath === paths.AUTH_SIGNUP });
  }

  shouldComponentUpdate(nextProps, _) {
    const nextPath = nextProps.location.pathname;
    return (
      nextPath !== this.props.location.pathname ||
      nextProps.loading !== this.props.loading
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
    this.props.onAuth(userInfo, this.state.isSigningUp);
  };

  handleAuthChange = () => {
    this.setState(prevState => {
      return { isSigningUp: !prevState.isSigningUp };
    });
  };

  renderFormCTA = () => {
    if (this.state.isSigningUp)
      return <h3>Hello! Sign up to help vote on popular menu items.</h3>;
    else return <h3>Welcome back! Log in to access to your places.</h3>;
  };

  renderForm = () => {
    let signingUpInputs = null;
    let formButtonName = 'Log In';
    let switchCTA = 'New user?';
    let switchLink = paths.AUTH_SIGNUP;
    let switchName = 'Sign Up';

    if (this.state.isSigningUp) {
      signingUpInputs = (
        <Aux>
          <Input
            medium
            margin
            floatText
            type="text"
            name="firstName"
            placeholder="First Name"
            change={this.handleInputChange}
          />
          <Input
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
      <form className={classes.AuthForm} onSubmit={this.handleFormSubmit}>
        {signingUpInputs}
        <Input
          medium
          margin
          floatText
          type="email"
          name="email"
          placeholder="Email"
          change={this.handleInputChange}
        />
        <Input
          medium
          margin
          floatText
          type="password"
          name="password"
          placeholder="Password"
          change={this.handleInputChange}
        />
        <div className={classes.FormButton}>
          <Button main click={this.handleFormSubmit}>
            {formButtonName}
          </Button>
        </div>
      </form>
    );

    const formSwitch = (
      <div className={classes.Switch}>
        <p>{switchCTA}</p>
        <NavItem link to={switchLink} click={this.handleAuthChange}>
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

    if (this.props.loading) {
      loadingPrompt = (
        <div className={classes.LoaderContainer}>
          <div className={classes.Loader}>
            {this.state.isSigningUp ? 'Signing Up...' : 'Logging In...'}
          </div>
        </div>
      );
    } else if (this.props.error) {
      errorMessage = (
        <div className={classes.Message}>{this.props.error.message}</div>
      );
    } else {
      const formElements = this.renderForm();
      const cta = this.renderFormCTA();
      formCTA = cta;
      form = formElements.form;
      formSwitch = formElements.formSwitch;
    }

    return (
      <div className={classes.AuthContainer}>
        <Fade>
          <div className={classes.Auth}>
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
