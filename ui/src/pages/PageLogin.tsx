import {
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
import firebase from "../ConfigFirebase";

const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
};

interface Props {}

interface State {}

class PageLogin extends React.Component {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar class="ion-text-center">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Vevel</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle color="primary">Vevel</IonTitle>
            </IonToolbar>
          </IonHeader>
          <br />
          <br />
          <br />
          <IonListHeader>
            <IonLabel className="ion-text-center">
              Intuitive Trading Interface.
            </IonLabel>
          </IonListHeader>

          <br />
          <br />
          <br />
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </IonContent>
      </IonPage>
    );
  }
}

export default PageLogin;
