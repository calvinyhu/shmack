import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as paths from '../../utilities/paths';

import classes from './Settings.css';
import {
  geoStart,
  geoLocate,
  toggleGeoLocPerm,
  setRedirectPath
} from '../../store/actions/appActions';
import Modal from '../UI/Modal/Modal';

const mapStateToProps = state => {
  return {
    hasGeoLocatePermission: state.app.hasGeoLocatePermission,
    geoError: state.app.error,
    redirectPath: state.app.redirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGeoLocate: () => dispatch(geoLocate()),
    onToggleGeoLocPerm: perm => dispatch(toggleGeoLocPerm(perm)),
    onClearError: () => dispatch(geoStart()),
    onSetRedirectPath: path => dispatch(setRedirectPath(path))
  };
};

class Settings extends Component {
  state = {
    isRedirectingToHome: false
  };

  componentWillUnmount() {
    if (this.props.redirectPath !== null) this.props.onSetRedirectPath(null);
  }

  locationToggleHandler = () => {
    if (this.props.hasGeoLocatePermission) this.props.onToggleGeoLocPerm(false);
    else {
      this.props.onToggleGeoLocPerm(true);
      this.props.onGeoLocate();

      // FIXME: Do not redirect if geolocation fails, only redirect if it succeeds
      if (this.props.redirectPath === paths.HOME)
        this.setState({ isRedirectingToHome: true });
    }
  };

  clearError = () => this.props.onClearError();

  render() {
    if (this.state.isRedirectingToHome) return <Redirect to={paths.HOME} />;

    let geoError = (
      <Modal
        isOpen={this.props.geoError}
        click={this.clearError}
        close={this.clearError}
        btnMsg={'Okay!'}
      >
        {this.props.geoError}
      </Modal>
    );

    return (
      <div className={classes.Settings}>
        <h5>Settings</h5>
        <div className={classes.Setting}>
          <div className={classes.Label}>Location Sharing</div>
          <label className={classes.SwitchTrack}>
            <input
              type="checkbox"
              onChange={this.locationToggleHandler}
              checked={this.props.hasGeoLocatePermission}
            />
            <div className={classes.SwitchThumb} />
          </label>
        </div>
        {geoError}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
