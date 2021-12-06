import {
  IonContent,
  IonHeader,
  IonPage,
  IonCard,
  IonLabel,
  IonCardContent,
  IonCardHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonListHeader,
  IonIcon,
  IonButtons,
  IonButton,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { logOutOutline, searchOutline } from "ionicons/icons";
import React from "react";
import { UserProfile } from "../Model";
import { logout } from "../DataApp";
import { auth, firestore } from "../ConfigFirebase";
import i18n from "../i18n";
import {
  updateUserProfileCurrency,
  updateUserProfileLanguage,
} from "../DataStorage";

interface Props {
  profile: UserProfile;
}

interface State {
  showNotification: boolean;
}

class PageSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showNotification: true,
    };
  }

  async doLogout() {
    await logout(auth);
    window.location.href = "/";
  }

  changeLanguage = async (languageCode: string) => {
    await updateUserProfileLanguage(
      firestore,
      this.props.profile.id,
      languageCode
    );
  };

  changeCurrencyCode = async (currencyCode: string) => {
    await updateUserProfileCurrency(
      firestore,
      this.props.profile.id,
      currencyCode
    );
  };

  async componentDidMount() {}

  render() {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>smcepeda</IonTitle>
            <IonButtons slot="end">
              <IonButton>
                <IonIcon color="primary" icon={searchOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader className="ion-no-border" collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{this.props.profile.name}</IonTitle>
            </IonToolbar>
            <IonToolbar>
              <IonTitle size="large">
                {this.props.profile.email.split("@")[0]}
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonList lines="none">
            {this.state.showNotification ? (
              <IonCard
                onClick={() => this.setState({ showNotification: false })}
              >
                <IonItem>
                  <IonLabel>{i18n.t("notification")}</IonLabel>
                  <IonIcon name="close-circle" slot="end"></IonIcon>
                </IonItem>
                <IonCardHeader>
                  <IonLabel color="primary">{i18n.t("crypto_title")}</IonLabel>
                </IonCardHeader>
                <IonCardContent>{i18n.t("crypto_content")}</IonCardContent>
              </IonCard>
            ) : (
              " "
            )}
          </IonList>

          <IonList lines="none">
            <IonListHeader slot="start">
              <IonLabel>{i18n.t("settings")}</IonLabel>
            </IonListHeader>

            <IonCard>
              <IonItem color="white">
                <IonLabel>{i18n.t("currency")}</IonLabel>
                <IonSelect
                  value={this.props.profile.currencyCode}
                  onIonChange={(e: any) =>
                    this.changeCurrencyCode(e.target.value)
                  }
                >
                  <IonSelectOption value="CHF">CHF</IonSelectOption>
                  <IonSelectOption value="EUR">EUR </IonSelectOption>
                  <IonSelectOption value="USD">USD </IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem color="white">
                <IonLabel>{i18n.t("s5")}</IonLabel>
                <IonSelect
                  value={this.props.profile.language}
                  onIonChange={(e: any) => this.changeLanguage(e.target.value)}
                >
                  <IonSelectOption value="de">
                    {i18n.t("german")}
                  </IonSelectOption>
                  <IonSelectOption value="en">
                    {i18n.t("english")}
                  </IonSelectOption>
                  <IonSelectOption value="fr">
                    {i18n.t("french")}
                  </IonSelectOption>
                  <IonSelectOption value="it">
                    {i18n.t("italian")}
                  </IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem color="white">
                <IonLabel onClick={(_) => this.doLogout()}>
                  {i18n.t("s6")}
                </IonLabel>
              </IonItem>
            </IonCard>
          </IonList>
        </IonContent>
      </IonPage>
    );
  }
}

export default PageSettings;
