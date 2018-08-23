import React from 'react'

import {
    GOOGLE_FIREBASE_API_KEY,
    GOOGLE_PLACES_API_KEY,
    GOOGLE_GEOCODING_API_KEY
} from '../secrets'
import { CORS } from './cors'
import Auxiliary from '../hoc/Auxiliary/Auxiliary'

const GOOGLE_MAPS_API = 'https://maps.googleapis.com/maps/api/'
const OUTPUT = 'json'

/********************************** Geocoding API *********************************/
const GEOCODING_API = 'geocode/'

export const createGoogleGeocodeLookupQuery = (location) => {
    const parameters = `key=${GOOGLE_GEOCODING_API_KEY}&address=${location}`
    return CORS + GOOGLE_MAPS_API + GEOCODING_API + `${OUTPUT}?${parameters}`
}

/********************************** Places API *********************************/
const PLACES_API = 'place/'
const FIND_PLACE = 'findplacefromtext/'
const NEARBY_SEARCH = 'nearbysearch/'

export const createGoogleFindPlaceQuery = (food, location) => {
    const input = `${food} ${location}`
    const inputType = 'textquery'
    const fields = 'photos,formatted_address,name,rating,opening_hours'
    const parameters = `key=${GOOGLE_PLACES_API_KEY}&input=${input}&inputtype=${inputType}&fields=${fields}`
    return CORS + GOOGLE_MAPS_API + PLACES_API + FIND_PLACE + `${OUTPUT}?${parameters}`
}

export const createGoogleNearbySearchQuery = (food, location, radius, type) => {
    const parameters = `key=${GOOGLE_PLACES_API_KEY}&location=${location}&radius=${radius}&keyword=${food}&type=${type}`
    return CORS + GOOGLE_MAPS_API + PLACES_API + NEARBY_SEARCH + `${OUTPUT}?${parameters}`
}

/*********************** Identity Tool Kit (Firebase) API ************************/
const CODE400 = 400
const CODE403 = 403
const EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND'
const EMAIL_EXISTS = 'EMAIL_EXISTS'
const INVALID_EMAIL = 'INVALID_EMAIL'
const INVALID_PASSWORD = 'INVALID_PASSWORD'
const MISSING_EMAIL = 'MISSING_EMAIL'
const MISSING_PASSWORD = 'MISSING_PASSWORD'
const WEAK_PASSWORD = 'WEAK_PASSWORD : Password should be at least 6 characters'

export const createFirebaseAuthQuery = (signup) => {
    const firebaseAuthMethod = (signup) ? 'signupNewUser' : 'verifyPassword'
    return `https://www.googleapis.com/identitytoolkit/v3/relyingparty/${firebaseAuthMethod}?key=${GOOGLE_FIREBASE_API_KEY}`
}

export const createFirebaseAuthData = (email, password) => {
    return {
        email: email,
        password: password,
        returnSecureToken: true
    }
}

export const handleFirebaseAuthError = (error) => {
    let message = null
    switch (error.code) {
        case CODE400:
            switch (error.message) {
                case EMAIL_NOT_FOUND: message = <p>Your email wasn't found! Did you want to sign up?</p>; break
                case EMAIL_EXISTS: message = <p>Your email already exists! Did you want to log in?</p>; break
                case INVALID_EMAIL: message = <p>Your email is invalid!</p>; break
                case INVALID_PASSWORD: message = <p>Your password is invalid!</p>; break
                case MISSING_EMAIL: message = <p>Please type in an email!</p>; break
                case MISSING_PASSWORD: message = <p>Please type in a password!</p>; break
                case WEAK_PASSWORD: message = <p>Your password is too weak!</p>; break
                default: message = <p>There was a unexpected problem with the email and password!</p>
            }
            break;
        case CODE403: message = <p>This website doesn't have permission to speak with Firebase. Please try again later!</p>; break
        default: message = <p>There was an unexpected error. Please try again later!</p>
    }
    return ( <Auxiliary> <p>:(</p> {message} </Auxiliary> )
}
