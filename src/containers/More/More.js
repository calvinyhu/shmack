import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import classes from './More.css';
import * as paths from '../../utilities/paths';
import User from '../User/User';

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuth
  };
};

class More extends Component {
  render() {
    let links = null;

    if (this.props.isAuth) {
      links = (
        <li>
          <NavLink to={paths.LOGOUT}>Log Out</NavLink>
        </li>
      );
    }

    return (
      <div className={classes.More}>
        <div className={classes.User}>
          <User />
        </div>
        <ul>
          <li>
            <NavLink to={paths.ABOUT}>About</NavLink>
          </li>
          <li>
            <NavLink to={paths.SETTINGS}>Settings</NavLink>
          </li>
          {links}
        </ul>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(More);
