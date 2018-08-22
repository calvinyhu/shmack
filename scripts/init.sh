#!/bin/bash

# Export necessary javascript variables to the secrets.js if the file does not exist.
if [ ! -f ./src/secrets.js ]; then
    echo "export const googleApiKey = 'GOOGLE_API_KEY'" >> src/secrets.js
    echo "export const yelpApiKey = 'YELP_API_KEY'" >> src/secrets.js
else
    echo "[./src/secrets.js] already exists! Continuing with npm start..."
fi
