import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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

LogOut.propTypes = {
  onAuthLogOut: PropTypes.func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(LogOut);
