import React, { PureComponent } from 'react';
import Fade from 'react-reveal/Fade';
import { connect } from 'react-redux';
import Rf from 'components/UI/Icon/Rf/Rf';
import PropTypes from 'prop-types';

import styles from './Layout.module.scss';
import {
  beforeInstallPrompt,
  clearDeferredPrompt
} from 'store/actions/appActions';
import Aux from 'hoc/Auxiliary/Auxiliary';
import Backdrop from 'components/UI/Backdrop/Backdrop';
import Drawer from 'components/UI/Drawer/Drawer';
import Button from 'components/UI/Button/Button';
import NavItem from 'components/UI/Button/NavItem/NavItem';
import * as paths from 'utilities/paths';

const mapStateToProps = state => {
  return {
    deferredPrompt: state.app.deferredPrompt,
    isSearchSuccess: state.restaurants.isSearchSuccess
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onBeforeInstallPrompt: event => dispatch(beforeInstallPrompt(event)),
    onClearDeferredPrompt: () => dispatch(clearDeferredPrompt())
  };
};

class Layout extends PureComponent {
  state = {
    isDrawerOpen: false
  };

  handleClick = () => {
    this.setState(prevState => {
      return { isDrawerOpen: !prevState.isDrawerOpen };
    });
  };

  handleCloseDrawer = () => this.setState({ isDrawerOpen: false });

  handleA2HS = () => {
    if (this.props.deferredPrompt.prompt) {
      this.props.deferredPrompt.prompt();
      this.props.onClearDeferredPrompt();
    }
  };

  render() {
    const backdrop = (
      <Backdrop
        isOpen={this.state.isDrawerOpen}
        click={this.handleCloseDrawer}
      />
    );

    let signup = (
      <NavItem clear to={paths.AUTH_SIGNUP} click={this.handleCloseDrawer}>
        Sign Up
      </NavItem>
    );

    let login = (
      <NavItem clear to={paths.AUTH_LOGIN} click={this.handleCloseDrawer}>
        Login
      </NavItem>
    );

    let home = (
      <NavItem clear to={paths.HOME} click={this.handleCloseDrawer}>
        <Rf sm>home</Rf>
        Home
      </NavItem>
    );

    let search = (
      <NavItem clear to={paths.SEARCH} click={this.handleCloseDrawer}>
        <Rf sm>search</Rf>
        Search
      </NavItem>
    );

    let about = (
      <NavItem clear to={paths.ABOUT} click={this.handleCloseDrawer}>
        <Rf sm>info</Rf>
        About
      </NavItem>
    );

    let settings = (
      <NavItem clear to={paths.SETTINGS} click={this.handleCloseDrawer}>
        <Rf sm>sliders</Rf>
        Settings
      </NavItem>
    );

    let logout = (
      <NavItem clear to={paths.LOGOUT} click={this.handleCloseDrawer}>
        <Rf sm>logout</Rf>
        Log Out
      </NavItem>
    );

    let A2HSButton = null;
    if (this.props.deferredPrompt.prompt) {
      A2HSButton = (
        <div className={styles.A2HSButton}>
          <Button clear leftAlign click={this.handleA2HS}>
            <Rf sm>phone</Rf>
            <p>Add to Home Screen</p>
          </Button>
        </div>
      );
    }

    let drawer = null;
    if (this.props.isAuth) {
      drawer = (
        <Drawer left isOpen={this.state.isDrawerOpen}>
          <nav>
            <div className={styles.Primary}>
              {home}
              {search}
              {about}
              {settings}
              {A2HSButton}
            </div>
            {logout}
          </nav>
        </Drawer>
      );
    } else {
      drawer = (
        <Drawer left isOpen={this.state.isDrawerOpen}>
          <nav>
            <div className={styles.Primary}>
              <div className={styles.AuthLinks}>
                {signup}
                {login}
              </div>
              {home}
              {search}
              {about}
              {settings}
              {A2HSButton}
            </div>
          </nav>
        </Drawer>
      );
    }

    const header = (
      <Fade>
        <header className={styles.Header}>
          <div className={styles.DrawerToggle}>
            <Button clear circle click={this.handleClick}>
              <Rf sm>menu</Rf>
            </Button>
          </div>
          <h5>shmack</h5>
        </header>
      </Fade>
    );

    const main = <main className={styles.Main}>{this.props.children}</main>;

    return (
      <Aux>
        {header}
        {main}
        {backdrop}
        {drawer}
      </Aux>
    );
  }
}

Layout.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  deferredPrompt: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  onClearDeferredPrompt: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);
