import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from './store/actions/appActions';
import { authTryAutoLogIn } from './store/actions/authActions';
import { getUserInfo, getUserPlaces } from './store/actions/userActions';
import * as paths from './utilities/paths';
import { auth } from './utilities/firebase';
import Layout from './hoc/Layout/Layout';
import About from './components/About/About';
import Auth from './containers/Auth/Auth';
import LogOut from './containers/Auth/LogOut/LogOut';
import Restaurants from './containers/Restaurants/Restaurants';
import Settings from './components/Settings/Settings';

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuth,
    hasGeoLocatePermission: state.app.hasGeoLocatePermission
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCheckGeoLocatePermission: () =>
      dispatch(actions.checkGeoLocatePermission()),
    onAuthTryAutoLogIn: () => dispatch(authTryAutoLogIn()),
    onGetUserInfo: () => dispatch(getUserInfo()),
    onGetUserPlaces: () => dispatch(getUserPlaces()),
    onBeforeInstallPrompt: event => dispatch(actions.beforeInstallPrompt(event))
  };
};

// TODO: Add user features

class App extends Component {
  componentDidMount() {
    this.props.onAuthTryAutoLogIn();
    this.props.onCheckGeoLocatePermission();

    auth.onAuthStateChanged(user => {
      if (user) {
        // this.props.onGetUserInfo();
        // this.props.onGetUserPlaces();
      }
    });

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      this.props.onBeforeInstallPrompt(event);
      return false;
    });
  }

  render() {
    let routes = null;

    if (this.props.isAuth) {
      routes = (
        <Switch>
          <Route exact path={paths.HOME} component={Restaurants} />
          <Route exact path={paths.ABOUT} component={About} />
          <Route exact path={paths.SETTINGS} component={Settings} />
          <Route exact path={paths.LOGOUT} component={LogOut} />
          <Route path={paths.AUTH} component={Auth} />
          <Redirect to={paths.HOME} />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Route exact path={paths.HOME} component={Restaurants} />
          <Route exact path={paths.ABOUT} component={About} />
          <Route exact path={paths.SETTINGS} component={Settings} />
          <Route exact path={paths.AUTH_SIGNUP} component={Auth} />
          <Route exact path={paths.AUTH_LOGIN} component={Auth} />
          <Redirect to={paths.HOME} />
        </Switch>
      );
    }

    return <Layout isAuth={this.props.isAuth}>{routes}</Layout>;
  }
}

// Need @withRouter to wrap App if connecting App to store
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
