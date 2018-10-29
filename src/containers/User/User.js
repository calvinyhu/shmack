import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './User.module.scss';

class User extends Component {
  static propTypes = {};

  render() {
    return <div className={styles.User}>User</div>;
  }
}

export default User;
