import axios from 'axios'
import { yelpApiKey } from './secrets'

const corsUrl = 'https://cors-anywhere.herokuapp.com/'
const yelpUrl = 'https://api.yelp.com/v3/'

const instance = axios.create({
    baseURL: corsUrl + yelpUrl
})

instance.defaults.headers.Authorization = `Bearer ${yelpApiKey}`

export default instance
