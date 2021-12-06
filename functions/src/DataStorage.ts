import * as admin from "firebase-admin";
import * as firestore from '@google-cloud/firestore';
import {UserProfile} from "../../ui/src/Model";

export async function getUserProfile(store: firestore.Firestore, userId: string): Promise<UserProfile> {
  return store.collection("user")
    .doc(userId)
    .collection("profile")
    .doc(userId).get()
    .then((db: any) => db.data() as UserProfile);
}

export async function updateUserProfile(store: firestore.Firestore, userProfile: UserProfile) {
  await store.collection("user").doc(userProfile.id).set(userProfile);
}


export async function onUserCreated(store: firestore.Firestore, fbUser: admin.auth.UserRecord) {
  const user: UserProfile = await getUserProfile(store, fbUser.uid)

  if (!user) {
    const dbUser: UserProfile = {
      id: fbUser.uid,
      email: fbUser.email!,
      name: fbUser.displayName,
      language : "de",
      currencyCode : "CHF",
      positions : [],
      wishlist : []
    }

    await updateUserProfile(store, dbUser);
  }
}
