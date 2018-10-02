import * as actionTypes from '../actions/actionTypes';
import { auth, usersRef, resRef } from '../../utilities/firebase';
import * as labels from '../../utilities/database';
import { getUserPlaces } from '../actions/userActions';

export const getItems = restaurantId => {
  return dispatch => {
    dispatch(getItemsStart());
    resRef
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
};

export const postItem = (restaurantId, itemName) => {
  return dispatch => {
    auth.onAuthStateChanged(user => {
      if (user) {
        // Post to user
        let item = {
          [restaurantId]: {
            [itemName]: { votedUp: false, votedDown: false }
          }
        };
        const user = usersRef.doc(auth.currentUser.uid);
        const editsRef = user.collection(labels.EDITS);
        editsRef.doc(labels.PLACES).set(item, { merge: true });

        // Post to restaurants
        item = {
          [itemName]: { likes: 0, dislikes: 0 }
        };
        resRef
          .doc(restaurantId)
          .set(item, { merge: true })
          .then(dispatch(postItemSuccess(itemName)));
      }
    });
  };
};

// TODO: Send a request to vote to firebase and let firebase have a single function to manage up votes and down votes
export const postVote = (
  restaurantId,
  itemName,
  likes,
  dislikes,
  direction,
  value
) => {
  return dispatch => {
    if (auth.currentUser) {
      // Post to user
      let item = null;
      if (direction === 'up') {
        item = {
          [restaurantId]: {
            [itemName]: { votedUp: value, votedDown: false }
          }
        };
      } else {
        item = {
          [restaurantId]: {
            [itemName]: { votedUp: false, votedDown: value }
          }
        };
      }
      const user = usersRef.doc(auth.currentUser.uid);
      const editsRef = user.collection(labels.EDITS);
      editsRef
        .doc(labels.PLACES)
        .set(item, { merge: true })
        .then(dispatch(getUserPlaces()));

      // Post to restaurants
      resRef
        .doc(restaurantId)
        .update({
          [itemName]: { likes: likes, dislikes: dislikes }
        })
        .then(dispatch(getItems(restaurantId)));
    }
  };
};

const getItemsStart = () => {
  return {
    type: actionTypes.GET_ITEMS_START,
    isGettingItems: true,
    items: null
  };
};

const getItemsSuccess = items => {
  return {
    type: actionTypes.GET_ITEMS_SUCCESS,
    isGettingItems: false,
    items: items
  };
};

const getItemsFail = resPageError => {
  return {
    type: actionTypes.GET_ITEMS_FAIL,
    isGettingItems: false,
    resPageError: resPageError
  };
};

const postItemSuccess = itemName => {
  return {
    type: actionTypes.POST_ITEM_SUCCESS,
    itemName: itemName
  };
};

// const postVoteSuccess = (itemName, likes, dislikes) => {
//   return {
//     type: actionTypes.POST_VOTE_SUCCESS,
//     itemName: itemName,
//     likes: likes,
//     dislikes: dislikes
//   };
// };
