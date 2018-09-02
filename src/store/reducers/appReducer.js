import  * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../utilities/utilities';

const initialState = {
    hasGeoLocatePermission: true,
    geoLocation: null,
    error: null
}

const geoStart = (state, action) => {
    return updateObject(state, {
        error: action.error
    })
}

const geoSuccess = (state, action) => {
    console.log(action.geoLocation)
    return updateObject(state, {
        geoLocation: action.geoLocation
    })
}

const geoFail = (state, action) => {
    return updateObject(state, {
        error: action.error
    })
}

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GEO_START: return geoStart(state, action)
        case actionTypes.GEO_SUCCESS: return geoSuccess(state, action)
        case actionTypes.GEO_FAIL: return geoFail(state, action)
        default: return state
    }
}

export default appReducer
