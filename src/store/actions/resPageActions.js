import * as actionTypes from './actionTypes';
import { auth, restaurants } from 'utilities/firebase';
import { postUserVote } from 'store/actions/userActions';

export const getItems = restaurantId => dispatch => {
  dispatch(getItemsStart());
  restaurants
    .doc(restaurantId)
    .get()
    .then(doc => {
      if (doc.exists) dispatch(getItemsSuccess(doc.data()));
      else dispatch(getItemsSuccess(null));
    })
    .catch(error => {
      dispatch(getItemsFail(error.response));
    });
};

export const postItem = (restaurantId, itemName) => dispatch => {
  if (!auth.currentUser) return;

  const items = restaurants.doc(restaurantId).collection('items');
  items
    .doc(itemName)
    .get()
    .then(doc => {
      if (doc.exists) dispatch(postItemFail('Item exists'));
      else {
        const data = { likes: [], dislikes: [] };
        items.doc(itemName).set(data);
        dispatch(postItemSuccess({ [itemName]: { likes: 0, dislikes: 0 } }));
      }
    });
};

export const postVote = (restaurantId, itemName, isUp) => dispatch => {
  if (!auth.currentUser) return;

  dispatch(postUserVote(restaurantId, itemName, isUp));

  const items = restaurants.doc(restaurantId).collection('items');
  items
    .doc(itemName)
    .get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();

        if (isUp) {
          const index = data.likes.indexOf(auth.currentUser.uid);
          if (index > -1) data.likes.splice(index, 1);
          else {
            data.likes.push(auth.currentUser.uid);
            data.dislikes = data.dislikes.filter(
              id => id !== auth.currentUser.uid
            );
          }
        } else {
          const index = data.dislikes.indexOf(auth.currentUser.uid);
          if (index > -1) data.dislikes.splice(index, 1);
          else {
            data.dislikes.push(auth.currentUser.uid);
            data.likes = data.likes.filter(id => id !== auth.currentUser.uid);
          }
        }

        items.doc(itemName).set(data);
        dispatch(
          postVoteSuccess({
            [itemName]: {
              likes: data.likes.length,
              dislikes: data.dislikes.length
            }
          })
        );
      }
    });
};

const getItemsStart = () => ({
  type: actionTypes.GET_ITEMS_START,
  payload: {
    isGettingItems: true,
    items: null
  }
});

const getItemsSuccess = items => ({
  type: actionTypes.GET_ITEMS_SUCCESS,
  payload: {
    isGettingItems: false,
    items: items
  }
});

const getItemsFail = error => ({
  type: actionTypes.GET_ITEMS_FAIL,
  payload: {
    isGettingItems: false,
    error
  }
});

const postItemSuccess = item => ({
  type: actionTypes.POST_ITEM_SUCCESS,
  payload: {
    item: item,
    error: null
  }
});

export const postItemFail = error => ({
  type: actionTypes.POST_ITEM_FAIL,
  payload: {
    error
  }
});

const postVoteSuccess = item => ({
  type: actionTypes.POST_VOTE_SUCCESS,
  payload: {
    item: item,
    error: null
  }
});

export const clearError = () => ({
  type: actionTypes.RESPAGE_CLEAR_ERROR,
  payload: {
    error: null
  }
});
