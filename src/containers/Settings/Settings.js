import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Fade from 'react-reveal/Fade';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Settings.module.scss';
import {
  geoLocate,
  geoClear,
  toggleGeoLocPerm,
  setRedirectParent,
  checkGeoLocatePermission
} from 'store/actions/appActions';
import Backdrop from 'components/UI/Backdrop/Backdrop';
import Modal from 'components/UI/Modal/Modal';
import Rf from 'components/UI/Icon/Rf/Rf';
import * as paths from 'utilities/paths';

const mapStateToProps = state => {
  return {
    hasGeoLocatePermission: state.app.hasGeoLocatePermission,
    isLocating: state.app.isLocating,
    isError: state.app.isError,
    geoError: state.app.geoError,
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
  static propTypes = {
    isLocating: PropTypes.bool.isRequired,
    hasGeoLocatePermission: PropTypes.bool.isRequired,
    redirectParent: PropTypes.string,
    geoLocation: PropTypes.object,
    geoError: PropTypes.object,
    onSetRedirectParent: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    onToggleGeoLocPerm: PropTypes.func.isRequired,
    onGeoLocate: PropTypes.func.isRequired
  };

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
    if (this.props.geoLocation.lat) {
      switch (this.props.redirectParent) {
        case paths.HOME:
          return <Redirect to={paths.HOME} />;
        case paths.SEARCH:
          return <Redirect to={paths.SEARCH} />;
        default:
          break;
      }
    }

    const backdrop = (
      <Backdrop isOpen={this.props.isError} click={this.clear} />
    );

    const geoError = (
      <Modal
        isOpen={this.props.isError}
        click={this.clear}
        close={this.clear}
        btnMsg={'Okay'}
      >
        {this.props.geoError.message ? this.props.geoError.message : ''}
      </Modal>
    );

    const inputClasses = classnames({
      [styles.InputLoading]: this.props.isLocating
    });

    const loaderClasses = classnames({
      [styles.LoaderContainer]: true,
      [styles.Show]: this.props.isLocating
    });

    let loader = (
      <div className={loaderClasses}>
        <div className={styles.Loader}>Locating...</div>
      </div>
    );

    return (
      <div className={styles.Settings}>
        <Fade>
          <h5>Settings</h5>
          <div className={styles.Setting}>
            <div className={styles.Label}>
              <Rf sm>nav</Rf>
              <p>Location Sharing</p>
            </div>
            <label className={styles.SwitchTrack}>
              <input
                className={inputClasses}
                type="checkbox"
                onChange={this.locationToggleHandler}
                checked={this.props.hasGeoLocatePermission}
              />
              <div className={styles.SwitchThumb}>{loader}</div>
            </label>
          </div>
        </Fade>
        {backdrop}
        {geoError}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
