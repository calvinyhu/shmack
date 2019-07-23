import React, { useEffect } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  authTryAutoLogIn,
  beforeInstallPrompt,
  checkForVerificationCode,
  checkGeoLocatePermission,
} from 'store/actions';
import { RootState } from 'store/reducers';
import Layout from 'hoc/Layout/Layout';
import Auth from 'containers/Auth/Auth';
import User from 'containers/User/User';
import Home from 'containers/Home/Home';
import Search from 'containers/Search/Search';
import MyPlaces from 'containers/MyPlaces/MyPlaces';
import LogOut from 'containers/Auth/LogOut/LogOut';
import Settings from 'containers/Settings/Settings';
import About from 'components/About/About';
import {
  USER,
  MY_PLACES,
  LOGOUT,
  SEARCH,
  ABOUT,
  SETTINGS,
  SIGNUP,
  LOGIN,
  HOME,
} from 'utilities/paths';

interface AppProps {
  location: Location;
}

const App = ({ location }: AppProps) => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkGeoLocatePermission());
    dispatch(authTryAutoLogIn());
    dispatch(checkForVerificationCode(location.search));

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      dispatch(beforeInstallPrompt());
    });
  });

  let routes;

  if (isAuth) {
    routes = (
      <Switch>
        <Route exact path={USER} component={User} />
        <Route exact path={HOME} component={Home} />
        <Route exact path={SEARCH} component={Search} />
        <Route exact path={MY_PLACES} component={MyPlaces} />
        <Route exact path={ABOUT} component={About} />
        <Route exact path={SETTINGS} component={Settings} />
        <Route exact path={LOGOUT} component={LogOut} />
        <Route exact path={LOGIN} component={Auth} />
        <Route exact path={SIGNUP} component={Auth} />
        <Redirect to={HOME} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route exact path={HOME} component={Home} />
        <Route exact path={SEARCH} component={Search} />
        <Route exact path={ABOUT} component={About} />
        <Route exact path={SETTINGS} component={Settings} />
        <Route exact path={SIGNUP} component={Auth} />
        <Route exact path={LOGIN} component={Auth} />
        <Redirect to={HOME} />
      </Switch>
    );
  }

  return <Layout isAuth={isAuth}>{routes}</Layout>;
};

// Need @withRouter to wrap App if connecting App to store
export default withRouter(App as any);
