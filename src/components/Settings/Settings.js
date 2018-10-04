import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as paths from '../../utilities/paths';

import classes from './Settings.css';
import {
  geoStart,
  geoLocate,
  toggleGeoLocPerm,
  setRedirectParent,
  checkGeoLocatePermission
} from '../../store/actions/appActions';
import Modal from '../UI/Modal/Modal';

const mapStateToProps = state => {
  return {
    hasGeoLocatePermission: state.app.hasGeoLocatePermission,
    isLocating: state.app.isLocating,
    geoError: state.app.error,
    geoLocation: state.app.geoLocation,
    redirectParent: state.app.redirectParent
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCheckGeoLocatePermission: () => dispatch(checkGeoLocatePermission()),
    onGeoLocate: redirectParent => dispatch(geoLocate(redirectParent)),
    onToggleGeoLocPerm: perm => dispatch(toggleGeoLocPerm(perm)),
    onClear: () => dispatch(geoStart()),
    onSetRedirectParent: parent => dispatch(setRedirectParent(parent))
  };
};

class Settings extends Component {
  componentWillUnmount() {
    this.props.onSetRedirectParent(null);
    this.props.onClear();
  }

  locationToggleHandler = () => {
    if (this.props.hasGeoLocatePermission) this.props.onToggleGeoLocPerm(false);
    else this.props.onGeoLocate();
  };

  clear = () => this.props.onClear();

  render() {
    if (this.props.redirectParent === paths.HOME && this.props.geoLocation)
      return <Redirect to={paths.HOME} />;

    let geoError = (
      <Modal
        isOpen={this.props.geoError}
        click={this.clear}
        close={this.clear}
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
