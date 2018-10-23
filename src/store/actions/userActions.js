import * as actionTypes from './actionTypes';
import { auth, users } from 'utilities/firebase';

export const postUserInfo = info => dispatch => {
  if (!auth.currentUser) return;

  dispatch(postUserInfoStart());
  users
    .doc(auth.currentUser.uid)
    .set(info)
    .then(_ => {
      dispatch(postUserInfoSuccess(info));
    })
    .catch(error => {
      dispatch(postUserInfoFail(error.response));
    });
};

export const getUserVotes = restaurantId => dispatch => {
  if (!auth.currentUser) return;

  const restaurants = users.doc(auth.currentUser.uid).collection('restaurants');
  const restaurant = restaurants.doc(restaurantId);

  restaurant.get().then(doc => {
    if (doc.exists) dispatch(getUserVotesSuccess(doc.data()));
  });
};

export const postUserVote = (restaurantId, itemName, isUp) => dispatch => {
  if (!auth.currentUser) return;

  const restaurants = users.doc(auth.currentUser.uid).collection('restaurants');
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

const postUserInfoStart = () => ({
  type: actionTypes.USER_POST_INFO_START,
  payload: {
    posting: true,
    error: null
  }
});

const postUserInfoSuccess = userInfo => ({
  type: actionTypes.USER_POST_INFO_SUCCESS,
  payload: {
    posting: false,
    postSuccess: true,
    error: null
  }
});

const postUserInfoFail = error => ({
  type: actionTypes.USER_POST_INFO_FAIL,
  payload: {
    posting: false,
    postSuccess: false,
    error: error
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
