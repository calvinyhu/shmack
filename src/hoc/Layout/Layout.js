import React, { PureComponent } from 'react';
import Fade from 'react-reveal/Fade';
import { connect } from 'react-redux';

import classes from './Layout.css';
import Aux from '../Auxiliary/Auxiliary';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Drawer from '../../components/UI/Drawer/Drawer';
import Button from '../../components/UI/Button/Button';
import NavItem from '../../components/UI/Button/NavItem/NavItem';
import { MAT_ICONS } from '../../utilities/styles';
import * as paths from '../../utilities/paths';
import {
  beforeInstallPrompt,
  clearDeferredPrompt
} from '../../store/actions/appActions';

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
    if (this.props.deferredPrompt) {
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
      <NavItem
        main
        borderMain
        to={paths.AUTH_SIGNUP}
        click={this.handleCloseDrawer}
      >
        Sign Up
      </NavItem>
    );

    let login = (
      <NavItem main to={paths.AUTH_LOGIN} click={this.handleCloseDrawer}>
        Login
      </NavItem>
    );

    let home = (
      <NavItem main to={paths.HOME} click={this.handleCloseDrawer}>
        <div className={MAT_ICONS}>home</div>
        Home
      </NavItem>
    );

    let about = (
      <NavItem main to={paths.ABOUT} click={this.handleCloseDrawer}>
        <div className={MAT_ICONS}>info</div>
        About
      </NavItem>
    );

    let settings = (
      <NavItem main to={paths.SETTINGS} click={this.handleCloseDrawer}>
        <div className={MAT_ICONS}>settings</div>
        Settings
      </NavItem>
    );

    let logout = (
      <NavItem main to={paths.LOGOUT} click={this.handleCloseDrawer}>
        <div className={MAT_ICONS}>logout</div>
        Log Out
      </NavItem>
    );

    let drawer = null;
    if (this.props.isAuth) {
      drawer = (
        <Drawer left isOpen={this.state.isDrawerOpen}>
          <nav>
            <div className={classes.Primary}>
              {home}
              {about}
              {settings}
            </div>
            {logout}
          </nav>
        </Drawer>
      );
    } else {
      drawer = (
        <Drawer left isOpen={this.state.isDrawerOpen}>
          <nav>
            <div className={classes.Primary}>
              <div className={classes.AuthLinks}>
                {signup}
                {login}
              </div>
              {home}
              {about}
              {settings}
            </div>
          </nav>
        </Drawer>
      );
    }

    let A2HSButton = null;
    if (this.props.deferredPrompt) {
      A2HSButton = (
        <div className={classes.A2HSButtonContainer}>
          <Button clear click={this.handleA2HS}>
            <div className={MAT_ICONS}>add_to_home_screen</div>
          </Button>
        </div>
      );
    }

    let headerClasses = classes.Header;
    if (this.props.isSearchSuccess) headerClasses += ' ' + classes.BoxShadow;
    const header = (
      <Fade>
        <header className={headerClasses}>
          <div className={classes.DrawerToggle} onClick={this.handleClick}>
            <div className={MAT_ICONS}>menu</div>
          </div>
          <h5>shmack</h5>
          {A2HSButton}
        </header>
      </Fade>
    );

    const main = <main className={classes.Main}>{this.props.children}</main>;

    return (
      <Aux>
        {backdrop}
        {drawer}
        {header}
        {main}
      </Aux>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);
