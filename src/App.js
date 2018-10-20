import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as appActions from 'store/actions/appActions';
import * as restaurantActions from 'store/actions/restaurantsActions';
import * as authActions from 'store/actions/authActions';
import Layout from 'hoc/Layout/Layout';
import Auth from 'containers/Auth/Auth';
import Restaurants from 'containers/Restaurants/Restaurants';
import LogOut from 'containers/Auth/LogOut/LogOut';
import About from 'components/About/About';
import Settings from 'components/Settings/Settings';
import * as paths from 'utilities/paths';
import { NEAR_BY_RADIUS } from 'utilities/google';

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth,
  hasGeoLocatePermission: state.app.hasGeoLocatePermission
});

const mapDispatchToProps = dispatch => ({
  onCheckGeoLocatePermission: () =>
    dispatch(appActions.checkGeoLocatePermission()),
  onBeforeInstallPrompt: event =>
    dispatch(appActions.beforeInstallPrompt(event)),
  onAuthTryAutoLogIn: () => dispatch(authActions.authTryAutoLogIn()),
  onGetNearBy: (food, location, radius) =>
    dispatch(restaurantActions.restaurantSearch(food, location, radius))
});

class App extends Component {
  componentDidMount() {
    this.props.onAuthTryAutoLogIn();
    this.props.onCheckGeoLocatePermission();
    this.props.onGetNearBy('', '', NEAR_BY_RADIUS);

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      this.props.onBeforeInstallPrompt(event);
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
