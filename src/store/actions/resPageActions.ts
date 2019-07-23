import {
  GET_ITEMS_START,
  GET_ITEMS_SUCCESS,
  GET_ITEMS_FAIL,
  POST_ITEM_SUCCESS,
  POST_ITEM_FAIL,
  POST_VOTE_SUCCESS,
  RESPAGE_CLEAR_ERROR,
} from './';
import {
  GetItemsStartAction,
  GetItemsSuccessAction,
  GetItemsFailAction,
  PostItemSuccessAction,
  PostItemFailAction,
  PostVoteSuccessAction,
  ResPageClearErrorAction,
} from './resPageActions.models';
import { auth, restaurants, CIDS } from 'utilities/firebase';
import { Dispatch } from 'redux';

export const getItems = (restaurantId: string) => (dispatch: Dispatch) => {
  dispatch(getItemsStart());
  restaurants
    .doc(restaurantId)
    .get()
    .then(doc => {
      if (doc.exists) dispatch(getItemsSuccess(doc.data()));
      else dispatch(getItemsSuccess(undefined));
    })
    .catch(_ => {
      const message = 'Failed getting items';
      dispatch(getItemsFail({ message }));
    });
};

export const postItem = (restaurantId: string, itemName: string) => (
  dispatch: Dispatch,
) => {
  if (!auth.currentUser) return;

  const items = restaurants.doc(restaurantId).collection(CIDS.ITEMS);
  items
    .doc(itemName)
    .get()
    .then(doc => {
      if (doc.exists) {
        const message = 'Item exists';
        dispatch(postItemFail({ message }));
      } else {
        const data = { likes: [], dislikes: [] };
        items.doc(itemName).set(data);
        dispatch(postItemSuccess({ [itemName]: { likes: 0, dislikes: 0 } }));
      }
    });
};

export const postRestaurantVote = (
  restaurantId: string,
  itemName: string,
  isUp: boolean,
) => (dispatch: Dispatch) => {
  if (!auth.currentUser) return;

  const items = restaurants.doc(restaurantId).collection(CIDS.ITEMS);
  items
    .doc(itemName)
    .get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        if (!data) return;

        const uid = auth && auth.currentUser ? auth.currentUser.uid : undefined;
        if (!uid) return;

        if (isUp) {
          const index = data.likes.indexOf(uid);
          if (index > -1) data.likes.splice(index, 1);
          else {
            data.likes.push(uid);
            data.dislikes = data.dislikes.filter((id: string) => id !== uid);
          }
        } else {
          const index = data.dislikes.indexOf(uid);
          if (index > -1) data.dislikes.splice(index, 1);
          else {
            data.dislikes.push(uid);
            data.likes = data.likes.filter((id: string) => id !== uid);
          }
        }

        items.doc(itemName).set(data);
        dispatch(
          postVoteSuccess({
            [itemName]: {
              likes: data.likes.length,
              dislikes: data.dislikes.length,
            },
          }),
        );
      }
    });
};

const getItemsStart = (): GetItemsStartAction => ({
  type: GET_ITEMS_START,
  payload: {
    isGettingItems: true,
    items: {},
  },
});

const getItemsSuccess = (
  items: firebase.firestore.DocumentData | undefined,
): GetItemsSuccessAction => ({
  type: GET_ITEMS_SUCCESS,
  payload: {
    isGettingItems: false,
    items,
  },
});

const getItemsFail = (error: object): GetItemsFailAction => ({
  type: GET_ITEMS_FAIL,
  payload: {
    isGettingItems: false,
    error,
  },
});

const postItemSuccess = (item: object): PostItemSuccessAction => ({
  type: POST_ITEM_SUCCESS,
  payload: {
    item,
    error: {},
  },
});

export const postItemFail = (error: object): PostItemFailAction => ({
  type: POST_ITEM_FAIL,
  payload: {
    error,
  },
});

const postVoteSuccess = (item: object): PostVoteSuccessAction => ({
  type: POST_VOTE_SUCCESS,
  payload: {
    item,
    error: {},
  },
});

export const clearError = (): ResPageClearErrorAction => ({
  type: RESPAGE_CLEAR_ERROR,
  payload: {
    error: {},
  },
});
