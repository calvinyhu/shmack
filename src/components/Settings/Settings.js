import React, { Component } from 'react'
import { connect } from 'react-redux'

import classes from './Settings.css'
import {
    geoStart,
    geoLocate,
    toggleGeoLocPerm
} from '../../store/actions/appActions'
import Modal from '../UI/Modal/Modal'

const mapStateToProps = (state) => {
    return {
        hasGeoLocatePermission: state.app.hasGeoLocatePermission,
        geoError: state.app.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onGeoLocate: () => dispatch(geoLocate()),
        onToggleGeoLocPerm: (perm) => dispatch(toggleGeoLocPerm(perm)),
        onClearError: () => dispatch(geoStart())
    }
}

class Settings extends Component {
    locationToggleHandler = () => {
        if (this.props.hasGeoLocatePermission)
            this.props.onToggleGeoLocPerm(false)
        else {
            this.props.onToggleGeoLocPerm(true)
            this.props.onGeoLocate()
        }
    }

    clearError = () => this.props.onClearError()

    render() {
        let geoErrorMessage = (
            <Modal
                isOpen={this.props.geoError}
                click={this.clearError}
                close={this.clearError}
                btnMsg={'Okay!'}>
                You have blocked location sharing in your browser. Please allow
                location sharing in your browser settings.
            </Modal>
        )
        return (
            <div className={classes.Settings}>
                <h5>Settings</h5>
                <div className={classes.Setting}>
                    <div className={classes.Label}>Location</div>
                    <label className={classes.SwitchTrack}>
                        <input
                            type='checkbox'
                            onChange={this.locationToggleHandler}
                            checked={this.props.hasGeoLocatePermission} />
                        <div className={classes.SwitchThumb}></div>
                    </label>
                </div>
                {geoErrorMessage}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
