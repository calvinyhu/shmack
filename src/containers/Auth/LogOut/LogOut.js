import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as authActions from 'store/actions/authActions';

const mapDispatchToProps = {
  onAuthLogOut: authActions.authLogOut
};

class LogOut extends Component {
  componentDidMount() {
    this.props.onAuthLogOut();
  }

  render() {
    return <Redirect to="/" />;
  }
}

export default connect(
  null,
  mapDispatchToProps
)(LogOut);
