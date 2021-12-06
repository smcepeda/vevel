import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonSlides,
  IonLabel,
  IonImg,
  IonListHeader,
  IonButton,
} from "@ionic/react";
import React from "react";
import i18n from "../i18n";

interface Props {}

interface State {}

class PagePrices extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>{i18n.t("prices")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader className="ion-no-border" collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{i18n.t("prices")}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonItem>
            <IonButton shape="round" size="small">
              Alle
            </IonButton>
            <IonButton shape="round" color="primary">
              Aktien
            </IonButton>
            <IonButton shape="round" color="primary">
              Krypto
            </IonButton>
            <IonButton shape="round" color="primary">
              ETFs
            </IonButton>
            <IonButton shape="round" color="primary">
              Metalle
            </IonButton>
          </IonItem>
          <IonList lines="none">
            <IonListHeader slot="start">
              <IonLabel>{i18n.t("most_traded")}</IonLabel>
            </IonListHeader>

            <IonCard>
              <IonItem color="white">
                <IonImg slot="start" src="/assets/ltc.png" />
                <IonCardContent>
                  <IonLabel slot="start">LTC</IonLabel>
                  <IonLabel slot="end">CHF 149</IonLabel>
                </IonCardContent>
                <IonCardContent>
                  <IonLabel color="danger" slot="start">
                    - 2%
                  </IonLabel>
                  <IonLabel color="danger" slot="end">
                    - CHF 3
                  </IonLabel>
                </IonCardContent>
              </IonItem>
            </IonCard>

            <IonCard>
              <IonItem color="white">
                <IonImg slot="start" src="/assets/apple.png" />
                <IonCardContent>
                  <IonLabel slot="start">APPL</IonLabel>
                  <IonLabel slot="end">CHF 1'250</IonLabel>
                </IonCardContent>
                <IonCardContent>
                  <IonLabel color="success" slot="start">
                    + 10%
                  </IonLabel>
                  <IonLabel color="success" slot="end">
                    + CHF 30
                  </IonLabel>
                </IonCardContent>
              </IonItem>
            </IonCard>
            <IonListHeader slot="start">
              <IonLabel>{i18n.t("top_winners")}</IonLabel>
            </IonListHeader>
            <IonCard>
              <IonItem color="white">
                <IonImg slot="start" src="/assets/msft.png" />
                <IonCardContent>
                  <IonLabel slot="start">MSFT</IonLabel>
                  <IonLabel slot="end">CHF 149</IonLabel>
                </IonCardContent>
                <IonCardContent>
                  <IonLabel color="success">+ 10%</IonLabel>
                  <IonLabel color="success">+ CHF 15</IonLabel>
                </IonCardContent>
              </IonItem>
            </IonCard>

            <IonCard>
              <IonItem color="white">
                <IonImg slot="start" src="/assets/tesla.png" />
                <IonCardContent>
                  <IonLabel slot="start">TSLA</IonLabel>
                  <IonLabel slot="end">CHF 2'500</IonLabel>
                </IonCardContent>
                <IonCardContent>
                  <IonLabel color="success" slot="start">
                    + 10%
                  </IonLabel>
                  <IonLabel color="success" slot="end">
                    + CHF 30
                  </IonLabel>
                </IonCardContent>
              </IonItem>
            </IonCard>
            <IonListHeader slot="start">
              <IonLabel>{i18n.t("top_losers")}</IonLabel>
            </IonListHeader>
            <IonCard>
              <IonItem color="white">
                <IonImg slot="start" src="/assets/msft.png" />
                <IonCardContent>
                  <IonLabel slot="start">MSFT</IonLabel>
                  <IonLabel slot="end">CHF 149</IonLabel>
                </IonCardContent>
                <IonCardContent>
                  <IonLabel color="danger" slot="start">
                    - 10%
                  </IonLabel>
                  <IonLabel color="danger" slot="end">
                    - CHF 15
                  </IonLabel>
                </IonCardContent>
              </IonItem>
            </IonCard>
            <IonCard>
              <IonItem color="white">
                <IonImg slot="start" src="/assets/ltc.png" />
                <IonCardContent>
                  <IonLabel slot="start">LTC</IonLabel>
                  <IonLabel slot="end">CHF 149</IonLabel>
                </IonCardContent>
                <IonCardContent>
                  <IonLabel color="danger" slot="start">
                    - 2%
                  </IonLabel>
                  <IonLabel color="danger" slot="end">
                    - CHF 3
                  </IonLabel>
                </IonCardContent>
              </IonItem>
            </IonCard>
          </IonList>

          <IonList>
            <IonListHeader slot="start">
              <IonLabel>{i18n.t("upcoming_reports")}</IonLabel>
            </IonListHeader>

            <IonSlides>
              <IonCard>
                <IonCardHeader>22UA.F</IonCardHeader>
                <IonCardContent>10.05</IonCardContent>
              </IonCard>
              <IonCard>
                <IonCardHeader>ALV.DE</IonCardHeader>
                <IonCardContent>12.05</IonCardContent>
              </IonCard>
              <IonCard>
                <IonCardHeader>BAYN.DE </IonCardHeader>
                <IonCardContent>13.05</IonCardContent>
              </IonCard>
              <IonCard>
                <IonCardHeader>22.UA.F</IonCardHeader>
                <IonCardContent>21.06</IonCardContent>
              </IonCard>
            </IonSlides>
          </IonList>
        </IonContent>
      </IonPage>
    );
  }
}

export default PagePrices;
