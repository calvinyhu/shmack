import * as actionTypes from './actionTypes';
import { auth, usersColRef, resColRef, firestore } from 'utilities/firebase';
import * as labels from 'utilities/database';

export const getItems = restaurantId => dispatch => {
  dispatch(getItemsStart());
  resColRef
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

export const postItem = (id, name) => dispatch => {
  if (!auth.currentUser) return;

  return firestore
    .runTransaction(transaction => {
      const resDocRef = resColRef.doc(id);
      let resDocRefExists = false;
      let items = {};

      const userDocRef = usersColRef.doc(auth.currentUser.uid);
      const voteInfoColRef = userDocRef.collection(labels.VOTE_INFO);
      const resVoteDocRef = voteInfoColRef.doc(id);
      let resVoteDocRefExists = false;

      return transaction
        .get(resDocRef)
        .then(doc => {
          if (doc.exists) {
            items = doc.data();
            const item = items[name];
            resDocRefExists = true;
            if (item) return Promise.reject('Item exists.');
          }
          return { likes: 1, dislikes: 0 };
        })
        .then(item => {
          return transaction.get(resVoteDocRef).then(doc => {
            if (doc.exists) {
              const voteInfo = doc.data();
              const vote = voteInfo[name];
              resVoteDocRefExists = true;
              if (vote) return { item: item, vote: vote };
            }
            return { item: item, vote: { votedUp: 1, votedDown: 0 } };
          });
        })
        .then(data => {
          const item = data.item;
          const vote = data.vote;

          if (resDocRefExists) transaction.update(resDocRef, { [name]: item });
          else transaction.set(resDocRef, { [name]: item });

          if (resVoteDocRefExists)
            transaction.update(resVoteDocRef, { [name]: vote });
          else transaction.set(resVoteDocRef, { [name]: vote });

          return { ...items, [name]: item };
        });
    })
    .then(items => {
      dispatch(postItemSuccess(items));
    })
    .catch(error => {
      dispatch(postItemFail(error));
    });
};

export const postVote = (id, name, isUp) => dispatch => {
  if (!auth.currentUser) return;

  return firestore
    .runTransaction(transaction => {
      const resDocRef = resColRef.doc(id);
      let resDocRefExists = false;
      let items = {};

      const userDocRef = usersColRef.doc(auth.currentUser.uid);
      const voteInfoColRef = userDocRef.collection(labels.VOTE_INFO);
      const resVoteDocRef = voteInfoColRef.doc(id);
      let resVoteDocRefExists = false;

      return transaction
        .get(resDocRef)
        .then(doc => {
          if (doc.exists) {
            items = doc.data();
            const item = items[name];
            resDocRefExists = true;
            if (item) return { exists: true, item: item };
          }
          return { exists: false, item: { likes: 0, dislikes: 0 } };
        })
        .then(data => {
          const exists = data.exists;
          const item = data.item;

          return transaction.get(resVoteDocRef).then(doc => {
            if (doc.exists) {
              const voteInfo = doc.data();
              const vote = voteInfo[name];
              resVoteDocRefExists = true;
              if (vote && exists) return { item: item, vote: vote };
            }
            return { item: item, vote: { votedUp: 0, votedDown: 0 } };
          });
        })
        .then(data => {
          const item = data.item;
          const vote = data.vote;

          if (isUp && vote.votedUp) {
            item.likes -= 1;
            vote.votedUp = 0;
          } else if (isUp && !vote.votedUp) {
            item.likes += 1;
            vote.votedUp = 1;
            if (vote.votedDown) {
              item.dislikes -= 1;
              vote.votedDown = 0;
            }
          } else if (!isUp && vote.votedDown) {
            item.dislikes -= 1;
            vote.votedDown = 0;
          } else if (!isUp && !vote.votedDown) {
            item.dislikes += 1;
            vote.votedDown = 1;
            if (vote.votedUp) {
              item.likes -= 1;
              vote.votedUp = 0;
            }
          }

          if (resDocRefExists) transaction.update(resDocRef, { [name]: item });
          else transaction.set(resDocRef, { [name]: item });

          if (resVoteDocRefExists)
            transaction.update(resVoteDocRef, { [name]: vote });
          else transaction.set(resVoteDocRef, { [name]: vote });

          return { ...items, [name]: item };
        });
    })
    .then(items => {
      dispatch(postVoteSuccess(items));
    })
    .catch(error => {
      // console.log(error);
    });
};

const getItemsStart = () => ({
  type: actionTypes.GET_ITEMS_START,
  isGettingItems: true,
  items: null
});

const getItemsSuccess = items => ({
  type: actionTypes.GET_ITEMS_SUCCESS,
  isGettingItems: false,
  items: items
});

const getItemsFail = resPageError => ({
  type: actionTypes.GET_ITEMS_FAIL,
  isGettingItems: false,
  resPageError: resPageError
});

const postItemSuccess = items => ({
  type: actionTypes.POST_ITEM_SUCCESS,
  items: items,
  resPageError: null
});

export const postItemFail = resPageError => ({
  type: actionTypes.POST_ITEM_FAIL,
  resPageError: resPageError
});

const postVoteSuccess = items => ({
  type: actionTypes.POST_VOTE_SUCCESS,
  items: items
});
