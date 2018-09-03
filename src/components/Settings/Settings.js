import React, { Component } from 'react'
import { connect } from 'react-redux'

import classes from './Settings.css'
import { geoLocate, toggleGeoLocPerm } from '../../store/actions/appActions'

const mapStateToProps = (state) => {
    return {
        hasGeoLocatePermission: state.app.hasGeoLocatePermission
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onGeoLocate: () => dispatch(geoLocate()),
        onToggleGeoLocPerm: (perm) => dispatch(toggleGeoLocPerm(perm))
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

    render() {
        return (
            <div className={classes.Settings}>
                <h5>Settings</h5>
                <div className={classes.Setting}>
                    <div className={classes.Label}>Location</div>
                    <label className={classes.SwitchTrack}>
                        <input 
                            type='checkbox'
                            onClick={this.locationToggleHandler}
                            onChange={this.locationToggleHandler}
                            checked={this.props.hasGeoLocatePermission}/>
                        <div className={classes.SwitchThumb}></div>
                    </label>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
