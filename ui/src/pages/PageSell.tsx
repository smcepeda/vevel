import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
  IonLabel,
  IonIcon,
  IonImg,
  IonButtons,
  IonButton,
  IonModal,
} from "@ionic/react";
import React, { Fragment } from "react";
import { closeOutline } from "ionicons/icons";
import { UserProfile, Context } from "../Model";
import i18n from "../i18n";
import PageOrderSell from "./PageOrderSell";

interface Props {
  userContext: Context;
  profile: UserProfile;
  onCancel: Function;
}

interface State {
  showSellOrderModal: boolean;
  assetId: string;
}

class PageSell extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showSellOrderModal: false,
      assetId: "",
    };
  }

  async componentDidMount() {}

  openSellOrderModal(item) {
    this.setState({ showSellOrderModal: true, assetId: item });
  }

  cancelSellOrderModal() {
    this.setState({ showSellOrderModal: false });
  }
  render() {
    return (
      <Fragment>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>{i18n.t("select_asset")}</IonTitle>
            <IonButtons slot="start">
              <IonButton onClick={(_) => this.props.onCancel()}>
                <IonIcon icon={closeOutline}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader className="ion-no-border" collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{i18n.t("select_asset")}</IonTitle>
            </IonToolbar>
            {this.state.showSellOrderModal ? (
              <IonModal
                isOpen={true}
                onDidDismiss={(_) => this.cancelSellOrderModal()}
              >
                <PageOrderSell
                  profile={this.props.profile}
                  onCancel={(_) => this.cancelSellOrderModal()}
                  assetId={this.state.assetId}
                />
              </IonModal>
            ) : (
              ""
            )}
            <IonList lines="none">
              {this.props.userContext.portfolioAssets.map((item, index) => (
                <IonCard
                  key={index}
                  onClick={() => this.openSellOrderModal(item.name)}
                >
                  <IonItem color="white">
                    <img src={item.logo} alt="" />

                    <IonCardContent>
                      <IonLabel>{item.name}</IonLabel>
                    </IonCardContent>
                    <IonImg src={item.chart} />

                    <IonCardContent slot="end">
                      <IonLabel color="success">{item.percentage}</IonLabel>
                      <IonLabel>
                        {item.price.quantity} {this.props.profile.currencyCode}
                      </IonLabel>
                    </IonCardContent>
                  </IonItem>
                </IonCard>
              ))}
            </IonList>
          </IonHeader>
        </IonContent>
      </Fragment>
    );
  }
}

export default PageSell;
