import axios from 'axios'

import * as actionTypes from '../actions/actionTypes'
import { auth, usersRef } from '../../utilities/firebase'
import * as labels from '../../utilities/database'
import { createGeoLocYelpSearchQuery, yelpConfig } from '../../utilities/yelp'

export const getYourPlaces = () => {
    return dispatch => {
        dispatch(getYourPlacesStart())
        const user = usersRef.doc(auth.currentUser.uid)
        const preferencesRef = user.collection(labels.PREFERENCES)
        preferencesRef.doc(labels.YOUR_PLACES).get()
            .then(doc => {
                if (doc.exists) {
                    dispatch(getYourPlacesSuccess(doc.data()))
                } else
                    dispatch(getYourPlacesEmpty())
            })
            .catch(error => {
                dispatch(getYourPlacesFail(error.response))
            })
    }
}

export const getYourCuisines = (hasGeoLocatePermission) => {
    return dispatch => {
        dispatch(getYourCusinesStart())
        const user = usersRef.doc(auth.currentUser.uid)
        const preferencesRef = user.collection(labels.PREFERENCES)
        preferencesRef.doc(labels.YOUR_CUISINES).get()
            .then(doc => {
                if (doc.exists && hasGeoLocatePermission) {
                    navigator.geolocation.getCurrentPosition(
                        (response) => {
                            const position = {
                                lat: response.coords.latitude,
                                long: response.coords.longitude
                            }
                            const queries = Object.keys(doc.data()).map(
                                cuisine => createGeoLocYelpSearchQuery(
                                    cuisine, position.lat, position.long
                                )
                            )
                            const promises = queries.map(
                                query => axios.get(query, yelpConfig)
                            )
                            axios.all(promises)
                                .then(axios.spread((...responses) => 
                                    dispatch(getYourCuisinesSuccess(
                                        doc.data(), responses
                                    ))
                                ))
                        },
                        (error) => {

                        }
                    )
                } else
                    dispatch(getYourCuisinesEmpty())
            })
            .catch(error => {
                dispatch(getYourCuisinesFail(error.response))
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
                dispatch(getYourPlaces())
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

const getYourCusinesStart = () => {
    return {
        type: actionTypes.HOME_GET_YOUR_CUISINES_START,
        gettingCuisines: true,
        cuisinesError: null
    }
}

const getYourPlacesSuccess = (yourPlaces) => {
    return {
        type: actionTypes.HOME_GET_YOUR_PLACES_SUCCESS,
        yourPlaces: yourPlaces,
        getting: false
    }
}

const getYourCuisinesSuccess = (yourCuisineCategories, yourCuisines) => {
    return {
        type: actionTypes.HOME_GET_YOUR_CUISINES_SUCCESS,
        yourCuisineCategories: yourCuisineCategories,
        yourCuisines: yourCuisines,
        gettingCuisines: false
    }
}

const getYourPlacesFail = (error) => {
    return {
        type: actionTypes.HOME_GET_YOUR_PLACES_FAIL,
        getting: false,
        error: error
    }
}

const getYourCuisinesFail = (error) => {
    return {
        type: actionTypes.HOME_GET_YOUR_CUISINES_FAIL,
        gettingCuisines: false,
        cuisinesError: error
    }
}

const getYourPlacesEmpty = () => {
    return {
        type: actionTypes.HOME_GET_YOUR_PLACES_SUCCESS,
        getting: false
    }
}

const getYourCuisinesEmpty = () => {
    return {
        type: actionTypes.HOME_GET_YOUR_CUISINES_SUCCESS,
        gettingCuisines: false
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
