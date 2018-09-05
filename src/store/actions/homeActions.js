import * as actionTypes from '../actions/actionTypes'
import { auth, usersRef } from '../../utilities/firebase'
import * as labels from '../../utilities/database'

export const getYourPlaces = () => {
    return dispatch => {
        dispatch(getYourPlacesStart())
        const user = usersRef.doc(auth.currentUser.uid)
        const preferencesRef = user.collection(labels.PREFERENCES)
        preferencesRef.doc(labels.YOUR_PLACES).get()
            .then(doc => {
                if (doc.exists)
                    dispatch(getYourPlacesSuccess(doc.data()))
                else
                    dispatch(getYourPlacesEmpty())
            })
            .catch(error => {
                dispatch(getYourPlacesFail(error.response))
            })
    }
}

export const postYourPlaces = (places) => {
    return dispatch => {
        dispatch(postYourPlacesStart())
        const user = usersRef.doc(auth.currentUser.uid)
        const preferencesRef = user.collection(labels.PREFERENCES)
        preferencesRef.doc(labels.YOUR_PLACES).set(places)
            .then(_ => {
                dispatch(postYourPlacesSuccess(places))
            }).catch(error => {
                dispatch(postYourPlacesFail(error.response))
            });
    }
}

const getYourPlacesStart = () => {
    return {
        type: actionTypes.HOME_GET_YOUR_PLACES_START,
        getting: true,
        error: null
    }
}

const getYourPlacesSuccess = (yourPlaces) => {
    return {
        type: actionTypes.HOME_GET_YOUR_PLACES_SUCCESS,
        yourPlaces: yourPlaces,
        getting: false
    }
}

const getYourPlacesFail = (error) => {
    return {
        type: actionTypes.HOME_GET_YOUR_PLACES_FAIL,
        getting: false,
        error: error
    }
}

const getYourPlacesEmpty = () => {
    return {
        type: actionTypes.HOME_GET_YOUR_PLACES_SUCCESS,
        getting: false
    }
}

const postYourPlacesStart = () => {
    return {
        type: actionTypes.HOME_POST_YOUR_PLACES_START,
        posting: true,
        error: null
    }
}

const postYourPlacesSuccess = (yourPlaces) => {
    return {
        type: actionTypes.HOME_POST_YOUR_PLACES_SUCCESS,
        yourPlaces: yourPlaces,
        posting: false
    }
}

const postYourPlacesFail = (error) => {
    return {
        type: actionTypes.HOME_POST_YOUR_PLACES_FAIL,
        posting: false,
        error: error
    }
}
