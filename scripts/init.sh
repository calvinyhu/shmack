#!/bin/bash

# Export necessary javascript variables to the secrets.js if the file does not exist.
if [ ! -f ./src/secrets.js ]; then
    echo "export const googleFirebaseApiKey = 'GOOGLE_FIREBASE_API_KEY'" >> src/secrets.js
    echo "export const googlePlacesApiKey = 'GOOGLE_PLACES_API_KEY'" >> src/secrets.js
    echo "export const googleGeocodingApiKey = 'GOOGLE_GEOCODING_API_KEY'" >> src/secrets.js
    echo "export const yelpApiKey = 'YELP_API_KEY'" >> src/secrets.js
else
    echo "[./src/secrets.js] already exists! Continuing with npm start..."
fi
