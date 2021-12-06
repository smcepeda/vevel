import firebase from "firebase";

export function onAuthenticationChanged(
  auth: firebase.auth.Auth,
  onAuth: Function
) {
  return auth.onAuthStateChanged((firebaseUser: firebase.User) => {
    onAuth(firebaseUser);
  });
}

export async function logout(auth: firebase.auth.Auth): Promise<any> {
  await auth.signOut();
  localStorage.clear();
}
