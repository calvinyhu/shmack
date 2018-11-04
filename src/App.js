import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as appActions from 'store/actions/appActions';
import * as authActions from 'store/actions/authActions';
import Layout from 'hoc/Layout/Layout';
import Auth from 'containers/Auth/Auth';
import User from 'containers/User/User';
import Home from 'containers/Home/Home';
import Search from 'containers/Search/Search';
import MyPlaces from 'containers/MyPlaces/MyPlaces';
import LogOut from 'containers/Auth/LogOut/LogOut';
import Settings from 'containers/Settings/Settings';
import About from 'components/About/About';
import * as paths from 'utilities/paths';

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth,
  hasGeoLocatePermission: state.app.hasGeoLocatePermission
});

const mapDispatchToProps = {
  onCheckGeoLocatePermission: appActions.checkGeoLocatePermission,
  onBeforeInstallPrompt: appActions.beforeInstallPrompt,
  onAuthTryAutoLogIn: authActions.authTryAutoLogIn,
  onCheckForVerificationCode: authActions.checkForVerificationCode
};

class App extends Component {
  componentDidMount() {
    this.props.onAuthTryAutoLogIn();
    this.props.onCheckGeoLocatePermission();
    this.props.onCheckForVerificationCode(this.props.location.search);

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      this.props.onBeforeInstallPrompt(event);
    });
  }

  render() {
    let routes;

    if (this.props.isAuth) {
      routes = (
        <Switch>
          <Route exact path={paths.USER} component={User} />
          <Route exact path={paths.HOME} component={Home} />
          <Route exact path={paths.SEARCH} component={Search} />
          <Route exact path={paths.MY_PLACES} component={MyPlaces} />
          <Route exact path={paths.ABOUT} component={About} />
          <Route exact path={paths.SETTINGS} component={Settings} />
          <Route exact path={paths.LOGOUT} component={LogOut} />
          <Route exact path={paths.LOGIN} component={Auth} />
          <Route exact path={paths.SIGNUP} component={Auth} />
          <Redirect to={paths.HOME} />
        </Switch>
      );
    } else {
      routes = (
        <Switch>
          <Route exact path={paths.HOME} component={Home} />
          <Route exact path={paths.SEARCH} component={Search} />
          <Route exact path={paths.ABOUT} component={About} />
          <Route exact path={paths.SETTINGS} component={Settings} />
          <Route exact path={paths.SIGNUP} component={Auth} />
          <Route exact path={paths.LOGIN} component={Auth} />
          <Redirect to={paths.HOME} />
        </Switch>
      );
    }

    return <Layout isAuth={this.props.isAuth}>{routes}</Layout>;
  }
}

App.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  onAuthTryAutoLogIn: PropTypes.func.isRequired,
  onCheckGeoLocatePermission: PropTypes.func.isRequired,
  onBeforeInstallPrompt: PropTypes.func.isRequired
};

// Need @withRouter to wrap App if connecting App to store
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
