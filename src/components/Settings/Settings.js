import React, { Component } from 'react'
import { connect } from 'react-redux'

import classes from './Settings.css'
import {
    geoStart,
    geoLocate,
    toggleGeoLocPerm
} from '../../store/actions/appActions'
import Button from '../UI/Button/Button'

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
        let errorClasses = classes.GeoErrorMessage
        if (this.props.geoError)
            errorClasses = [errorClasses, classes.ShowError].join(' ')
        let geoErrorMessage = (
            <div className={errorClasses}>
                <p>
                    You have blocked location sharing in your browser. Please allow location sharing in your browser settings.
                </p>
                <Button wide click={this.clearError}>Ok</Button>
            </div>
        )
        return (
            <div className={classes.Settings}>
                {geoErrorMessage}
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
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
