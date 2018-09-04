import  * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../utilities/utilities';

const initialState = {
    hasGeoLocatePermission: false,
    geoLocation: null,
    error: null
}

const geoStart = (state, action) => {
    return updateObject(state, {
        error: action.error
    })
}

const geoSuccess = (state, action) => {
    return updateObject(state, {
        geoLocation: action.geoLocation
    })
}

const geoFail = (state, action) => {
    return updateObject(state, {
        error: action.error
    })
}

const geoError = (state, action) => {
    return updateObject(state, {
        hasGeoLocatePermission: action.hasGeoLocatePermission,
        error: action.error
    })
}

const geoToggle = (state, action) => {
    return updateObject(state, {
        hasGeoLocatePermission: action.hasGeoLocatePermission
    })
}

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GEO_START: return geoStart(state, action)
        case actionTypes.GEO_SUCCESS: return geoSuccess(state, action)
        case actionTypes.GEO_FAIL: return geoFail(state, action)
        case actionTypes.GEO_ERROR: return geoError(state, action)
        case actionTypes.TOGGLE_GEO_LOC_PERM: return geoToggle(state, action)
        default: return state
    }
}

export default appReducer
