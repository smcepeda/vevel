import * as admin from "firebase-admin";

admin.initializeApp();

export const firestore = admin.firestore();
export const storage = admin.storage();
firestore.settings({ignoreUndefinedProperties: true});

