import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { GOOGLE_FIREBASE_API_KEY } from '../secrets';

// Initialize firebase
firebase.initializeApp({
  apiKey: GOOGLE_FIREBASE_API_KEY,
  authDomain: 'shmackem.firebaseapp.com',
  projectId: 'shmackem'
});

/******************* Authentication (Identity Tool Kit API) *******************/
// Add firebase auth service
export const auth = firebase.auth();

/******************************* Firestore ************************************/
// The behavior for Date objects stored in Firestore is going to change
// AND YOUR APP MAY BREAK.
// To hide this warning and ensure your app does not break, you need to add the
// following code to your app before calling any other Cloud Firestore methods:
export const firestore = firebase.firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);

// Collection Ids
export const CIDS = {
  USERS: 'users',
  RESTAURANTS: 'restaurants',
  ITEMS: 'items'
};

// User Collection Fields
export const USER_FIELDS = {
  EMAIL: 'email',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  LOCATION: 'location',
  PROFILE_PICTURE: 'profilePicture'
};

// Root Collections
export const users = firestore.collection(CIDS.USERS);
export const restaurants = firestore.collection(CIDS.RESTAURANTS);
