import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import { GOOGLE_FIREBASE_API_KEY } from '../secrets'
import * as labels from './database'

// Initialize firebase
firebase.initializeApp({
    apiKey: GOOGLE_FIREBASE_API_KEY,
    authDomain: 'shmackem.firebaseapp.com',
    projectId: 'shmackem'
})

/******************* Authentication (Identity Tool Kit API) *******************/
// Add firebase auth service
export const auth = firebase.auth()

/******************************* Firestore ************************************/
// The behavior for Date objects stored in Firestore is going to change
// AND YOUR APP MAY BREAK.
// To hide this warning and ensure your app does not break, you need to add the
// following code to your app before calling any other Cloud Firestore methods:
export const firestore = firebase.firestore()
const settings = {/* your settings... */ timestampsInSnapshots: true }
firestore.settings(settings)
export const usersRef = firestore.collection(labels.USERS)
