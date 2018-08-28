import React from 'react'

import { YELP_API_KEY } from '../secrets'
import { CORS } from './cors'
import Aux from '../hoc/Auxiliary/Auxiliary'

const YELP_API = 'https://api.yelp.com/v3/'
const BUSINESSES_API = CORS + YELP_API + '/businesses/search?'

const TOKEN_MISSING = 'TOKEN_MISSING'
const TOKEN_INVALID = 'TOKEN_INVALID'

export const yelpConfig = {
    headers: {
        Authorization: `Bearer ${YELP_API_KEY}`
    }
}

export const createYelpQuery = (food, location) => {
    return BUSINESSES_API + `term=${food}&location=${location}`
}

export const handleYelpError = (error) => {
    let message = null
    switch (error) {
        case TOKEN_MISSING: message = <p>Looks like your Yelp API key is missing. Please supply one!</p>; break
        case TOKEN_INVALID: message = <p>Looks like your Yelp API key is invalid. Please supply a valid one!</p>; break
        default: message = <p>There was an unexpected error. Please try again later!</p>
    }
    return ( <Aux> <p>:(</p> {message} </Aux> )
}
