import React from 'react'
import axios from 'axios'

import Auxiliary from '../hoc/Auxiliary/Auxiliary'
import { yelpApiKey } from '../secrets';

const TOKEN_MISSING = 'TOKEN_MISSING'
const TOKEN_INVALID = 'TOKEN_INVALID'

const cors = 'https://cors-anywhere.herokuapp.com/'
const yelp = 'https://api.yelp.com/v3/'
const base = cors + yelp
const businesses = base + '/businesses/search?'
const config = {
    headers: {
        Authorization: `Bearer ${yelpApiKey}`
    }
}

export const searchYelp = (food, location, onSearchEnd) => {
    const query = `term=${food}&location=${location}`
    axios.get(businesses + query, config)
        .then(response => {
            onSearchEnd({
                restaurants: response.data.businesses,
                loading: false,
                error: null
            })
        })
        .catch(error => {
            onSearchEnd({
                restaurants: null,
                loading: false,
                error: error.response
            })
        })
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
