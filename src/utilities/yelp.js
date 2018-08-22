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
    let errorMessage = null
    switch (error) {
        case TOKEN_MISSING:
            errorMessage = (
                <Auxiliary>
                    <p>:(</p>
                    <p>Looks like your Yelp API key is missing.</p>
                    <p>Please supply one!</p>
                </Auxiliary>
            )
            break;
        case TOKEN_INVALID:
            errorMessage = (
                <Auxiliary>
                    <p>:(</p>
                    <p>Looks like your Yelp API key is invalid.</p>
                    <p>Please supply a valid one!</p>
                </Auxiliary>
            )
            break;
        default:
            errorMessage = (
                <Auxiliary>
                    <p>:(</p>
                    <p>There was an unexpected error.</p>
                    <p>Please try again later!</p>
                </Auxiliary>
            )
    }
    return errorMessage
}
