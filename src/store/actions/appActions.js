import * as actionTypes from '../actions/actionTypes'

export const geoLocate = () => {
    return dispatch => {
        console.log('[ App Actions ] Locating position........')
        dispatch(geoStart())
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (response) => {
                    const position = {
                        lat: response.coords.latitude,
                        long: response.coords.longitude
                    }
                    dispatch(geoSuccess(position))
                },
                (error) => {
                    dispatch(geoError(error))
                }
            )
        } else {
            dispatch(geoFail('Sorry, this browser does not support geo location'))
        }
    }
}

export const toggleGeoLocPerm = (hasGeoLocatePermission) => {
    return {
        type: actionTypes.TOGGLE_GEO_LOC_PERM,
        hasGeoLocatePermission: hasGeoLocatePermission
    }
}

export const geoStart = () => {
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
        hasGeoLocatePermission: false,
        error: error
    }
}

const geoError = (error) => {
    return {
        type: actionTypes.GEO_ERROR,
        hasGeoLocatePermission: false,
        error: error
    }
}
