import React from 'react'

import Auxiliary from '../hoc/Auxiliary/Auxiliary'
import { yelpApiKey } from '../secrets';

const TOKEN_MISSING = 'TOKEN_MISSING'
const TOKEN_INVALID = 'TOKEN_INVALID'

const cors = 'https://cors-anywhere.herokuapp.com/'
const yelp = 'https://api.yelp.com/v3/'
const base = cors + yelp
const businesses = base + '/businesses/search?'

export const yelpConfig = {
    headers: {
        Authorization: `Bearer ${yelpApiKey}`
    }
}

export const getYelpQuery = (food, location) => {
    return businesses + `term=${food}&location=${location}`
}

export const handleYelpError = (error) => {
    let message = null
    switch (error) {
        case TOKEN_MISSING: message = <p>Looks like your Yelp API key is missing. Please supply one!</p>; break
        case TOKEN_INVALID: message = <p>Looks like your Yelp API key is invalid. Please supply a valid one!</p>; break
        default: message = <p>There was an unexpected error. Please try again later!</p>
    }
    return ( <Auxiliary> <p>:(</p> {message} </Auxiliary> )
}
