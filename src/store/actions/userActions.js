import axios from 'axios';

import {
    createGetUserInfoQuery,
    createPostUserInfoQuery
} from '../../utilities/firebase'

export const getUserInfo = () => {
    axios.get(createGetUserInfoQuery())
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
}

export const postUserInfo = () => {
    axios.post(createPostUserInfoQuery())
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
}
