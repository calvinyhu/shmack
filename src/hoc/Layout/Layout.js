import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import Fade from 'react-reveal/Fade';

import classes from './Layout.css';
import Aux from '../Auxiliary/Auxiliary';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Drawer from '../../components/UI/Drawer/Drawer';
import { MAT_ICONS } from '../../utilities/styles';
import * as paths from '../../utilities/paths';

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

  render() {
    const backdrop = (
      <Backdrop
        isOpen={this.state.isDrawerOpen}
        click={this.handleCloseDrawer}
      />
    );

    let drawer = null;
    if (this.props.isAuth) {
      drawer = (
        <Drawer left isOpen={this.state.isDrawerOpen}>
          <nav>
            <div className={classes.Primary}>
              <NavLink to={paths.HOME} onClick={this.handleCloseDrawer}>
                Home
              </NavLink>
              <NavLink to={paths.ABOUT} onClick={this.handleCloseDrawer}>
                About
              </NavLink>
              <NavLink to={paths.SETTINGS} onClick={this.handleCloseDrawer}>
                Settings
              </NavLink>
            </div>
            <NavLink to={paths.LOGOUT} onClick={this.handleCloseDrawer}>
              Log Out
            </NavLink>
          </nav>
        </Drawer>
      );
    } else {
      drawer = (
        <Drawer left isOpen={this.state.isDrawerOpen}>
          <nav>
            <div className={classes.Primary}>
              <div className={classes.AuthLinks}>
                <NavLink
                  className={classes.SignUp}
                  to={paths.AUTH_SIGNUP}
                  onClick={this.handleCloseDrawer}
                >
                  Sign Up
                </NavLink>
                <NavLink to={paths.AUTH_LOGIN} onClick={this.handleCloseDrawer}>
                  Login
                </NavLink>
              </div>
              <NavLink to={paths.HOME} onClick={this.handleCloseDrawer}>
                Home
              </NavLink>
              <NavLink to={paths.ABOUT} onClick={this.handleCloseDrawer}>
                About
              </NavLink>
              <NavLink to={paths.SETTINGS} onClick={this.handleCloseDrawer}>
                Settings
              </NavLink>
            </div>
          </nav>
        </Drawer>
      );
    }

    const header = (
      <Fade>
        <header className={classes.Header}>
          <div className={classes.DrawerToggle} onClick={this.handleClick}>
            <div className={MAT_ICONS}>menu</div>
          </div>
          <h5>shmack</h5>
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

export default Layout;
