import * as actionTypes from '../actions/actionTypes'

export const geoLocate = () => {
    return dispatch => {
        dispatch(geoStart())
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoLocation => {
                const position = {
                    lat: geoLocation.coords.latitude,
                    long: geoLocation.coords.longitude
                }
                dispatch(geoSuccess(position))
            })
        } else {
            console.log('This browser does not support geo location')
            dispatch(geoFail('This browser does not support geo location'))
        }
    }
}

export const toggleGeoLocPerm = (hasGeoLocatePermission) => {
    return {
        type: actionTypes.TOGGLE_GEO_LOC_PERM,
        hasGeoLocatePermission: hasGeoLocatePermission
    }
}

const geoStart = () => {
    return {
        type: actionTypes.GEO_START,
        error: null
    }
}

const geoSuccess = (geoLocation) => {
    return {
        type: actionTypes.GEO_SUCCESS,
        geoLocation: geoLocation
    }
}

const geoFail = (error) => {
    return {
        type: actionTypes.GEO_FAIL,
        error: error
    }
}
