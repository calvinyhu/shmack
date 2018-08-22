import React from 'react'

import Auxiliary from '../hoc/Auxiliary/Auxiliary'
import { googleApiKey } from '../secrets'

const CODE400 = 400
const EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND'
const EMAIL_EXISTS = 'EMAIL_EXISTS'
const INVALID_EMAIL = 'INVALID_EMAIL'
const INVALID_PASSWORD = 'INVALID_PASSWORD'
const MISSING_EMAIL = 'MISSING_EMAIL'
const MISSING_PASSWORD = 'MISSING_PASSWORD'
const WEAK_PASSWORD = 'WEAK_PASSWORD : Password should be at least 6 characters'

const CODE403 = 403

export const getFirebaseAuthQuery = (signup) => {
    const firebaseAuthMethod = (signup) ? 'signupNewUser' : 'verifyPassword'
    return `https://www.googleapis.com/identitytoolkit/v3/relyingparty/${firebaseAuthMethod}?key=${googleApiKey}`
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
