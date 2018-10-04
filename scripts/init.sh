#!/bin/bash

# Export necessary javascript variables to the secrets.js if the file does not exist.
if [ ! -f ./src/secrets.js ]; then
    echo "export const GOOGLE_FIREBASE_API_KEY = 'GOOGLE_FIREBASE_API_KEY'" >> src/secrets.js
    echo "export const GOOGLE_PLACES_API_KEY = 'GOOGLE_PLACES_API_KEY'" >> src/secrets.js
    echo "export const GOOGLE_GEOCODING_API_KEY = 'GOOGLE_GEOCODING_API_KEY'" >> src/secrets.js
else
    echo "[./src/secrets.js] already exists! Continuing with npm start..."
fi
