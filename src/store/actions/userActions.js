import axios from 'axios';

import * as actionTypes from './actionTypes';
import { auth, users, CIDS } from '../../utilities/firebase';
import { createGooglePlaceDetailsQuery } from '../../utilities/google';

export const getUserInfo = () => dispatch => {
  if (!auth.currentUser) return;

  dispatch(getUserInfoStart());
  users
    .doc(auth.currentUser.uid)
    .get()
    .then(doc => {
      if (!doc.exists) return;
      dispatch(getUserInfoSuccess(doc.data()));
    });
};

export const postUserInfo = info => dispatch => {
  if (!auth.currentUser) return;

  dispatch(postUserInfoStart());
  users
    .doc(auth.currentUser.uid)
    .set(info, { merge: true })
    .then(_ => {
      dispatch(postUserInfoSuccess(info));
    })
    .catch(error => {
      dispatch(postUserInfoFail(error.response));
    });
};

export const getUserVotes = restaurantId => dispatch => {
  if (!auth.currentUser) return;

  const restaurants = users
    .doc(auth.currentUser.uid)
    .collection(CIDS.RESTAURANTS);
  const restaurant = restaurants.doc(restaurantId);

  restaurant.get().then(doc => {
    if (doc.exists) dispatch(getUserVotesSuccess(doc.data()));
  });
};

export const postUserVote = (restaurantId, itemName, isUp) => dispatch => {
  if (!auth.currentUser) return;

  const restaurants = users
    .doc(auth.currentUser.uid)
    .collection(CIDS.RESTAURANTS);
  const restaurant = restaurants.doc(restaurantId);

  restaurant.get().then(doc => {
    let data = null;
    if (doc.exists) {
      // restaurant exists, therefore likes and dislikes exist
      data = doc.data();

      if (isUp) {
        const index = data.likes.indexOf(itemName);
        if (index > -1) data.likes.splice(index, 1);
        else {
          data.likes.push(itemName);
          data.dislikes = data.dislikes.filter(id => id !== itemName);
        }
      } else {
        const index = data.dislikes.indexOf(itemName);
        if (index > -1) data.dislikes.splice(index, 1);
        else {
          data.dislikes.push(itemName);
          data.likes = data.likes.filter(id => id !== itemName);
        }
      }

      restaurant.update(data);
    } else {
      data = { likes: [], dislikes: [] };
      if (isUp) data.likes.push(itemName);
      else data.dislikes.push(itemName);
      restaurant.set(data);
    }
    dispatch(postUserVotesSuccess(data));
  });
};

export const getPlaces = () => dispatch => {
  dispatch(getPlacesStart());

  const restaurants = users
    .doc(auth.currentUser.uid)
    .collection(CIDS.RESTAURANTS);

  restaurants
    .get()
    .then(querySnapshot => {
      const queries = [];
      const places = [];

      querySnapshot.forEach(doc => {
        const query = createGooglePlaceDetailsQuery(doc.id);
        const placePromise = axios.get(query);
        queries.push(placePromise);
      });

      axios
        .all(queries)
        .then(responses => {
          responses.forEach(response => {
            const result = response.data.result;
            places.push(result);
          });
          dispatch(getPlacesSuccess(places));
        })
        .catch(error => {
          const message = 'Failed to get user places';
          dispatch(getPlacesFail({ message }));
        });
    })
    .catch(error => {
      const message = 'Failed to get user places';
      dispatch(getPlacesFail({ message }));
    });
};

const getUserInfoStart = () => ({
  type: actionTypes.USER_GET_INFO_START,
  payload: {
    isGettingUserInfo: true,
    error: {}
  }
});

const getUserInfoSuccess = userInfo => ({
  type: actionTypes.USER_GET_INFO_SUCCESS,
  payload: {
    isGettingUserInfo: false,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    error: {}
  }
});

const postUserInfoStart = () => ({
  type: actionTypes.USER_POST_INFO_START,
  payload: {
    isPostingUserInfo: true,
    error: {}
  }
});

const postUserInfoSuccess = userInfo => ({
  type: actionTypes.USER_POST_INFO_SUCCESS,
  payload: {
    isPostingUserInfo: false,
    isPostSuccess: true,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    error: {}
  }
});

const postUserInfoFail = error => ({
  type: actionTypes.USER_POST_INFO_FAIL,
  payload: {
    isPostingUserInfo: false,
    isPostSuccess: false,
    error
  }
});

const getPlacesStart = () => ({
  type: actionTypes.USER_GET_PLACES_START,
  payload: {
    isGettingPlaces: true,
    error: {}
  }
});

const getPlacesSuccess = places => ({
  type: actionTypes.USER_GET_PLACES_SUCCESS,
  payload: {
    isGettingPlaces: false,
    places
  }
});

const getPlacesFail = error => ({
  type: actionTypes.USER_GET_PLACES_FAIL,
  payload: {
    isGettingPlaces: false,
    error
  }
});

const getUserVotesSuccess = votes => ({
  type: actionTypes.USER_GET_VOTES,
  payload: {
    votes
  }
});

const postUserVotesSuccess = votes => ({
  type: actionTypes.USER_POST_VOTES,
  payload: {
    votes
  }
});
