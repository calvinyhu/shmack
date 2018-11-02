import React, { PureComponent } from 'react';
import Fade from 'react-reveal/Fade';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import throttle from 'raf-throttle';

import styles from './Layout.module.scss';
import {
  beforeInstallPrompt,
  clearDeferredPrompt
} from 'store/actions/appActions';
import Aux from 'hoc/Auxiliary/Auxiliary';
import Backdrop from 'components/UI/Backdrop/Backdrop';
import DragDrawer from '../../components/UI/DragDrawer/DragDrawer';
import Button from 'components/UI/Button/Button';
import Rf from 'components/UI/Icon/Rf/Rf';
import NavItem from 'components/UI/Button/NavItem/NavItem';
import * as paths from '../../utilities/paths';
import { auth } from '../../utilities/firebase';
import profile_placeholder from '../../assets/images/profile_placeholder.jpeg';

const mapStateToProps = state => {
  return {
    isSearchSuccess: state.restaurants.isSearchSuccess,
    deferredPrompt: state.app.deferredPrompt,
    firstName: state.user.firstName
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onBeforeInstallPrompt: event => dispatch(beforeInstallPrompt(event)),
    onClearDeferredPrompt: () => dispatch(clearDeferredPrompt())
  };
};

class Layout extends PureComponent {
  static propTypes = {
    isAuth: PropTypes.bool.isRequired,
    deferredPrompt: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    onClearDeferredPrompt: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.drawerRef = React.createRef();
  }

  startX = 0;
  prevOffsetX = 0;
  maxOffsetX = 0;

  state = {
    isDrawerOpen: false,
    offsetX: null,
    percent: 0
  };

  componentDidMount() {
    if (this.drawerRef.current) {
      this.maxOffsetX = -this.drawerRef.current.drawerRef.current.clientWidth;
      this.setState({ offsetX: this.maxOffsetX });
    }
  }

  handleClick = () => {
    this.setState(prevState => {
      return {
        isDrawerOpen: !prevState.isDrawerOpen,
        offsetX: prevState.offsetX === 0 ? this.maxOffsetX : 0
      };
    });
  };

  handleCloseDrawer = () =>
    this.setState({ isDrawerOpen: false, offsetX: this.maxOffsetX });

  handleTouchStart = event => {
    this.prevOffsetX = this.state.offsetX;
    this.startX = event.touches[0].clientX;
  };

  handleTouchMove = event => {
    throttle(this.animateDrawer(event.touches[0].clientX));
  };

  animateDrawer = clientX => {
    let offsetX = clientX - this.startX + this.prevOffsetX;
    offsetX = offsetX > 0 ? 0 : offsetX;
    offsetX = offsetX < this.maxOffsetX ? this.maxOffsetX : offsetX;
    const percent = 1 - offsetX / this.maxOffsetX;
    this.setState({ offsetX, percent });
  };

  handleTouchEnd = () => {
    const percent = 1 - this.state.offsetX / this.maxOffsetX;
    if (this.state.isDrawerOpen) {
      if (percent <= 0.8)
        this.setState({ offsetX: this.maxOffsetX, isDrawerOpen: false });
      else this.setState({ offsetX: 0, isDrawerOpen: true });
    } else {
      if (percent >= 0.2) this.setState({ offsetX: 0, isDrawerOpen: true });
      else this.setState({ offsetX: this.maxOffsetX, isDrawerOpen: false });
    }
  };

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
        percent={this.state.percent}
      />
    );

    const signup = (
      <NavItem clear to={paths.SIGNUP} click={this.handleCloseDrawer}>
        Sign Up
      </NavItem>
    );

    const login = (
      <NavItem clear to={paths.LOGIN} click={this.handleCloseDrawer}>
        Login
      </NavItem>
    );

    const user = (
      <NavItem clear tall to={paths.USER} click={this.handleCloseDrawer}>
        <div className={styles.ProfilePicture}>
          <img
            src={
              auth.currentUser && auth.currentUser.photoURL
                ? auth.currentUser.photoURL
                : profile_placeholder
            }
            alt="Profile"
          />
        </div>
        <div className={styles.ProfileName}>
          <h5>Hi, {this.props.firstName ? this.props.firstName : 'there'}</h5>
          <p>View Profile</p>
        </div>
      </NavItem>
    );

    const home = (
      <NavItem clear to={paths.HOME} click={this.handleCloseDrawer}>
        <Rf sm>home</Rf>
        Home
      </NavItem>
    );

    const search = (
      <NavItem clear to={paths.SEARCH} click={this.handleCloseDrawer}>
        <Rf sm>search</Rf>
        Search
      </NavItem>
    );

    const myPlaces = (
      <NavItem clear to={paths.MY_PLACES} click={this.handleCloseDrawer}>
        <Rf sm>map-pin</Rf>
        My Places
      </NavItem>
    );

    const about = (
      <NavItem clear to={paths.ABOUT} click={this.handleCloseDrawer}>
        <Rf sm>info</Rf>
        About
      </NavItem>
    );

    const settings = (
      <NavItem clear to={paths.SETTINGS} click={this.handleCloseDrawer}>
        <Rf sm>sliders</Rf>
        Settings
      </NavItem>
    );

    const logout = (
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
            <Rf sm>smartphone</Rf>
            <p>Add to Home Screen</p>
          </Button>
        </div>
      );
    }

    let nav = null;
    if (this.props.isAuth) {
      nav = (
        <nav>
          <div className={styles.Primary}>
            {user}
            {home}
            {search}
            {myPlaces}
            {about}
            {settings}
            {A2HSButton}
          </div>
          {logout}
        </nav>
      );
    } else {
      nav = (
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
      );
    }

    const dragDrawer = (
      <DragDrawer
        ref={this.drawerRef}
        isOpen={this.state.isDrawerOpen}
        offsetX={this.state.offsetX}
        maxOffsetX={this.maxOffsetX}
        touchStart={this.handleTouchStart}
        touchMove={this.handleTouchMove}
        touchEnd={this.handleTouchEnd}
      >
        {nav}
      </DragDrawer>
    );

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
        {dragDrawer}
      </Aux>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);
