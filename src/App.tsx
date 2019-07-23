import React, { useEffect } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import * as appActions from 'store/actions/appActions';
import * as authActions from 'store/actions/authActions';
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
import * as paths from 'utilities/paths';

interface AppProps {
  location: Location;
}

const App = ({ location }: AppProps) => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appActions.checkGeoLocatePermission());
    dispatch(authActions.authTryAutoLogIn());
    dispatch(authActions.checkForVerificationCode(location.search));

    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      dispatch(appActions.beforeInstallPrompt());
    });
  });

  let routes;

  if (isAuth) {
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

  return <Layout isAuth={isAuth}>{routes}</Layout>;
};

// Need @withRouter to wrap App if connecting App to store
export default withRouter(App as any);
