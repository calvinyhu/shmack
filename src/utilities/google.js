import { GOOGLE_PLACES_API_KEY, GOOGLE_GEOCODING_API_KEY } from '../secrets';
import { CORS } from './cors';

const GOOGLE_MAPS_API = 'https://maps.googleapis.com/maps/api/';
const OUTPUT = 'json';

/********************************** Geocoding API *********************************/
const GEOCODING_API = 'geocode/';

export const createGoogleGeocodeLookupQuery = location => {
  const parameters = `key=${GOOGLE_GEOCODING_API_KEY}&address=${location}`;
  return CORS + GOOGLE_MAPS_API + GEOCODING_API + `${OUTPUT}?${parameters}`;
};

/********************************** Places API *********************************/
// 0.5 miles
export const NEAR_BY_RADIUS = 1000;
const PLACES_API = 'place/';
const PLACE_DETAILS = 'details/';
const FIND_PLACE = 'findplacefromtext/';
const NEARBY_SEARCH = 'nearbysearch/';
const PLACE_PHOTO = 'photo';

export const createGoogleFindPlaceQuery = (food, location) => {
  const input = `${food} ${location}`;
  const inputType = 'textquery';
  const fields = 'photos,formatted_address,name,rating,opening_hours';
  const parameters = `key=${GOOGLE_PLACES_API_KEY}&input=${input}&inputtype=${inputType}&fields=${fields}`;
  return (
    CORS + GOOGLE_MAPS_API + PLACES_API + FIND_PLACE + `${OUTPUT}?${parameters}`
  );
};

export const createGooglePlaceDetailsQuery = placeid => {
  const fields = 'name,photo,rating,price_level,place_id';
  const parameters = `key=${GOOGLE_PLACES_API_KEY}&placeid=${placeid}&fields=${fields}`;
  return (
    CORS +
    GOOGLE_MAPS_API +
    PLACES_API +
    PLACE_DETAILS +
    `${OUTPUT}?${parameters}`
  );
};

export const createGoogleNearbySearchQuery = (food, location, radius, type) => {
  const parameters = `key=${GOOGLE_PLACES_API_KEY}&location=${location}&radius=${radius}&keyword=${food}&type=${type}`;
  return (
    CORS +
    GOOGLE_MAPS_API +
    PLACES_API +
    NEARBY_SEARCH +
    `${OUTPUT}?${parameters}`
  );
};

export const createGooglePlacePhotoQuery = (photoreference, maxwidth) => {
  const parameters = `key=${GOOGLE_PLACES_API_KEY}&photoreference=${photoreference}&maxwidth=${maxwidth}`;
  return GOOGLE_MAPS_API + PLACES_API + PLACE_PHOTO + `?${parameters}`;
};

export const convertPrice = value => {
  let signs = [];
  for (let i = 0; i < value; i++) signs.push('dollar-sign');
  return signs;
};

export const convertRating = rating => {
  if (!rating) return [];
  if (rating > 5) rating = 5;
  if (rating < 0) rating = 0;
  let stars = [];
  let filled;
  for (filled = 0; filled < rating - 1; filled++) stars.push('fas fa-star');
  let remainder = rating - filled;
  remainder = remainder.toFixed(1);
  if (remainder >= 0.8) stars.push('fas fa-star');
  else if (remainder >= 0.3) stars.push('fas fa-star-half-alt');
  for (let empty = stars.length; empty < 5; empty++) stars.push('far fa-star');
  return stars;
};
