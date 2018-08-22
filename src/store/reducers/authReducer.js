import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../../utilities/utilities';

const initialState = {
    token: '',
    userId: '',
    loading: false,
    error: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return updateObject(state, {
                loading: action.loading
            })
        case actionTypes.AUTH_SUCCESS:
            return updateObject(state, {
                token: action.token,
                userId: action.userId,
                loading: action.loading
            })
        case actionTypes.AUTH_FAIL:
            return updateObject(state, {
                loading: action.loading,
                error: action.error
            })
        case actionTypes.AUTH_LOGOUT:
            return updateObject(state, {
                token: action.token,
                userId: action.userId
            })
        default: return state
    }
}

export default authReducer
