// import * as firebase from 'firebase/app';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

const restaurants = firestore.collection('restaurants');

export const createItem = functions.firestore
  .document('restaurants/{restaurantId}/items/{itemId}')
  .onCreate((snap, context) => {
    const restaurantId = context.params.restaurantId;
    const itemId = context.params.itemId;

    return restaurants
      .doc(restaurantId)
      .set({ [itemId]: { likes: 0, dislikes: 0 } }, { merge: true })
      .then(() => 'Update Successful')
      .catch(() => 'Update Failed');
  });

export const updateItem = functions.firestore
  .document('restaurants/{restaurantId}/items/{itemId}')
  .onUpdate((change, context) => {
    const restaurantId = context.params.restaurantId;
    const itemId = context.params.itemId;
    const newData = change.after.data();

    return restaurants
      .doc(restaurantId)
      .update({
        [itemId]: {
          likes: newData.likes.length,
          dislikes: newData.dislikes.length
        }
      })
      .then(() => 'Update Successful')
      .catch(() => 'Update Failed');
  });
