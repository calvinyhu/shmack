import axios from 'axios';

import {
  USER_GET_INFO_START,
  USER_GET_INFO_SUCCESS,
  USER_POST_INFO_START,
  USER_POST_INFO_SUCCESS,
  USER_POST_INFO_FAIL,
  USER_GET_PLACES_START,
  USER_GET_PLACES_SUCCESS,
  USER_GET_PLACES_FAIL,
  USER_GET_VOTES,
  USER_POST_VOTES,
} from './';
import {
  UserGetInfoStartAction,
  UserGetInfoSuccessAction,
  UserPostInfoStartAction,
  UserPostInfoSuccessAction,
  UserPostInfoFailAction,
  UserGetPlacesStartAction,
  UserGetPlacesSuccessAction,
  UserGetPlacesFailAction,
  UserGetVotesAction,
  UserPostVotesAction,
} from './userActions.models';
import { auth, users, CIDS } from '../../utilities/firebase';
import { createGooglePlaceDetailsQuery } from '../../utilities/google';
import { Dispatch } from 'redux';

export const getUserInfo = () => (dispatch: Dispatch) => {
  if (!auth.currentUser) return;

  dispatch(getUserInfoStart());
  users
    .doc(auth.currentUser.uid)
    .get()
    .then(doc => {
      if (!doc.exists) return;
      const userInfo = doc.data();
      dispatch(getUserInfoSuccess(userInfo));
    });
};

export const postUserInfo = (info: object) => (dispatch: Dispatch) => {
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

export const getUserVotes = (restaurantId: string) => (dispatch: Dispatch) => {
  if (!auth.currentUser) return;

  const restaurants = users
    .doc(auth.currentUser.uid)
    .collection(CIDS.RESTAURANTS);
  const restaurant = restaurants.doc(restaurantId);

  restaurant.get().then(doc => {
    if (doc.exists) dispatch(getUserVotesSuccess(doc.data()));
  });
};

export const postUserVote = (
  restaurantId: string,
  itemName: string,
  isUp: boolean,
) => (dispatch: Dispatch) => {
  if (!auth.currentUser) return;

  const restaurants = users
    .doc(auth.currentUser.uid)
    .collection(CIDS.RESTAURANTS);
  const restaurant = restaurants.doc(restaurantId);

  restaurant.get().then(doc => {
    let data = undefined;
    if (doc.exists) {
      // restaurant exists, therefore likes and dislikes exist
      data = doc.data();

      if (!data) return;

      if (isUp) {
        const index = data.likes.indexOf(itemName);
        if (index > -1) data.likes.splice(index, 1);
        else {
          data.likes.push(itemName);
          data.dislikes = data.dislikes.filter((id: string) => id !== itemName);
        }
      } else {
        const index = data.dislikes.indexOf(itemName);
        if (index > -1) data.dislikes.splice(index, 1);
        else {
          data.dislikes.push(itemName);
          data.likes = data.likes.filter((id: string) => id !== itemName);
        }
      }

      restaurant.update(data);
    } else {
      data = { likes: [], dislikes: [] };
      // @ts-ignore
      if (isUp) data.likes.push(itemName);
      // @ts-ignore
      else data.dislikes.push(itemName);
      restaurant.set(data);
    }
    dispatch(postUserVotesSuccess(data));
  });
};

export const getPlaces = () => (dispatch: Dispatch) => {
  dispatch(getPlacesStart());

  const uid = auth && auth.currentUser ? auth.currentUser.uid : undefined;
  const message = 'Failed to get user places';

  if (!uid) {
    dispatch(getPlacesFail({ message }));
    return;
  }

  const restaurants = users.doc(uid).collection(CIDS.RESTAURANTS);

  restaurants
    .get()
    .then(querySnapshot => {
      const queries: Promise<any>[] = [];
      const places: [] = [];

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
            // @ts-ignore
            places.push(result);
          });
          dispatch(getPlacesSuccess(places));
        })
        .catch(error => {
          dispatch(getPlacesFail({ message }));
        });
    })
    .catch(error => {
      dispatch(getPlacesFail({ message }));
    });
};

const getUserInfoStart = (): UserGetInfoStartAction => ({
  type: USER_GET_INFO_START,
  payload: {
    isGettingUserInfo: true,
    error: {},
  },
});

const getUserInfoSuccess = (
  userInfo: firebase.firestore.DocumentData | undefined,
): UserGetInfoSuccessAction => ({
  type: USER_GET_INFO_SUCCESS,
  payload: {
    isGettingUserInfo: false,
    firstName: userInfo ? userInfo.firstName : undefined,
    lastName: userInfo ? userInfo.lastName : undefined,
    error: {},
  },
});

const postUserInfoStart = (): UserPostInfoStartAction => ({
  type: USER_POST_INFO_START,
  payload: {
    isPostingUserInfo: true,
    error: {},
  },
});

const postUserInfoSuccess = (userInfo: object): UserPostInfoSuccessAction => ({
  type: USER_POST_INFO_SUCCESS,
  payload: {
    isPostingUserInfo: false,
    isPostSuccess: true,
    // @ts-ignore
    firstName: userInfo.firstName,
    // @ts-ignore
    lastName: userInfo.lastName,
    error: {},
  },
});

const postUserInfoFail = (error: object): UserPostInfoFailAction => ({
  type: USER_POST_INFO_FAIL,
  payload: {
    isPostingUserInfo: false,
    isPostSuccess: false,
    error,
  },
});

const getPlacesStart = (): UserGetPlacesStartAction => ({
  type: USER_GET_PLACES_START,
  payload: {
    isGettingPlaces: true,
    error: {},
  },
});

const getPlacesSuccess = (places: []): UserGetPlacesSuccessAction => ({
  type: USER_GET_PLACES_SUCCESS,
  payload: {
    isGettingPlaces: false,
    places,
  },
});

const getPlacesFail = (error: object): UserGetPlacesFailAction => ({
  type: USER_GET_PLACES_FAIL,
  payload: {
    isGettingPlaces: false,
    error,
  },
});

const getUserVotesSuccess = (
  votes: firebase.firestore.DocumentData | undefined,
): UserGetVotesAction => ({
  type: USER_GET_VOTES,
  payload: {
    votes,
  },
});

const postUserVotesSuccess = (
  votes: firebase.firestore.DocumentData | undefined,
): UserPostVotesAction => ({
  type: USER_POST_VOTES,
  payload: {
    votes,
  },
});
