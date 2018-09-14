import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from './store/actions/appActions';
import { authTryAutoLogIn } from './store/actions/authActions';
import { getUserInfo } from './store/actions/userActions';
import {
  getYourPlaces,
  getYourCuisines,
  getDefaultCuisines
} from './store/actions/homeActions';
import * as paths from './utilities/paths';
import { auth } from './utilities/firebase';
import Layout from './hoc/Layout/Layout';
import Home from './containers/Home/Home';
import About from './components/About/About';
import Auth from './containers/Auth/Auth';
import LogOut from './containers/Auth/LogOut/LogOut';
import Restaurants from './containers/Restaurants/Restaurants';
import More from './containers/More/More';
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
    onGetYourPlaces: () => dispatch(getYourPlaces()),
    onGetYourCuisines: () => dispatch(getYourCuisines()),
    onGetDefaultCuisines: () => dispatch(getDefaultCuisines())
  };
};

class App extends Component {
  componentDidMount() {
    this.props.onAuthTryAutoLogIn();
    this.props.onCheckGeoLocatePermission();

    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.onGetUserInfo();
        this.props.onGetYourPlaces();
        if (this.props.hasGeoLocatePermission) this.props.onGetYourCuisines();
      } else {
        if (this.props.hasGeoLocatePermission)
          this.props.onGetDefaultCuisines();
      }
    });
  }

  render() {
    const routes = [
      <Route exact path={paths.HOME} component={Home} key={paths.HOME} />,
      <Route
        exact
        path={paths.SEARCH}
        component={Restaurants}
        key={paths.SEARCH}
      />,
      <Route exact path={paths.MORE} component={More} key={paths.MORE} />,
      <Route exact path={paths.ABOUT} component={About} key={paths.ABOUT} />,
      <Route
        exact
        path={paths.SETTINGS}
        component={Settings}
        key={paths.SETTINGS}
      />
    ];

    if (this.props.isAuth) {
      routes.push(
        <Route
          exact
          path={paths.LOGOUT}
          component={LogOut}
          key={paths.LOGOUT}
        />
      );
      routes.push(
        <Route path={paths.AUTH} component={Auth} key={paths.AUTH} />
      );
    } else {
      routes.push(
        <Route
          exact
          path={paths.AUTH_SIGNUP}
          component={Auth}
          key={paths.AUTH_SIGNUP}
        />
      );
      routes.push(
        <Route
          exact
          path={paths.AUTH_LOGIN}
          component={Auth}
          key={paths.AUTH_LOGIN}
        />
      );
    }

    routes.push(<Redirect to={paths.HOME} key={'Redirect'} />);

    return (
      <Layout isAuth={this.props.isAuth}>
        <Switch>{routes}</Switch>
      </Layout>
    );
  }
}

// Need @withRouter to wrap App if connecting App to store
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
