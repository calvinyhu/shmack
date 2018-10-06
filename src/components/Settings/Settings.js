import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as paths from '../../utilities/paths';

import classes from './Settings.css';
import {
  geoLocate,
  geoClear,
  toggleGeoLocPerm,
  setRedirectParent,
  checkGeoLocatePermission
} from '../../store/actions/appActions';
import Modal from '../UI/Modal/Modal';
import { MAT_ICONS } from '../../utilities/styles';

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
    onGeoLocate: () => dispatch(geoLocate()),
    onToggleGeoLocPerm: perm => dispatch(toggleGeoLocPerm(perm)),
    onClear: () => dispatch(geoClear()),
    onSetRedirectParent: parent => dispatch(setRedirectParent(parent))
  };
};

class Settings extends Component {
  componentWillUnmount() {
    this.props.onSetRedirectParent(null);
    this.props.onClear();
  }

  locationToggleHandler = () => {
    if (this.props.hasGeoLocatePermission && !this.props.isLocating)
      this.props.onToggleGeoLocPerm(false);
    else {
      this.props.onToggleGeoLocPerm(true);
      this.props.onGeoLocate();
    }
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

    let inputClasses = null;
    let loaderClasses = classes.LoaderContainer;
    if (this.props.isLocating) {
      inputClasses = classes.InputLoading;
      loaderClasses += ' ' + classes.Show;
    }

    let loader = (
      <div className={loaderClasses}>
        <div className={classes.Loader}>Locating...</div>
      </div>
    );

    return (
      <div className={classes.Settings}>
        <h5>Settings</h5>
        {/* <div className={classes.ImgContainer}>
          <div className={MAT_ICONS}>location_on</div>
        </div> */}
        <div className={classes.Setting}>
          <div className={classes.Label}>
            <div className={MAT_ICONS}>location_on</div>
            <p>Location Sharing</p>
          </div>
          <label className={classes.SwitchTrack}>
            <input
              className={inputClasses}
              type="checkbox"
              onChange={this.locationToggleHandler}
              checked={this.props.hasGeoLocatePermission}
            />
            <div className={classes.SwitchThumb}>{loader}</div>
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
