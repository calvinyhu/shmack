import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as authActions from '../../../store/actions/authActions';
import * as userActions from '../../../store/actions/userActions';
import * as homeActions from '../../../store/actions/homeActions';

const mapDispatchToProps = dispatch => {
  return {
    onAuthLogOut: () => dispatch(authActions.authLogOut()),
    onUserLogOut: () => dispatch(userActions.userLogOut()),
    onHomeLogOut: () => dispatch(homeActions.homeLogOut())
  };
};

class LogOut extends Component {
  componentDidMount() {
    this.props.onAuthLogOut();
    this.props.onUserLogOut();
    this.props.onHomeLogOut();
  }

  render() {
    return <Redirect to="/" />;
  }
}

export default connect(
  null,
  mapDispatchToProps
)(LogOut);
