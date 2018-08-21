import React from 'react'
import axios from '../axios'

import Auxiliary from '../hoc/Auxiliary/Auxiliary'

const TOKEN_INVALID = 'TOKEN_INVALID'

export const searchYelp = (food, location, onSearchEnd) => {
    const query = `/businesses/search?term=${food}&location=${location}`
    axios.get(query)
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
