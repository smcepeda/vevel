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
import { UserProfile, Context, Asset } from "../Model";
import { getAllAssets } from "../DataStorage";
import { firestore } from "../ConfigFirebase";
import i18n from "../i18n";
import PageOrderBuy from "./PageOrderBuy";

interface Props {
  userContext: Context;
  profile: UserProfile;
  onCancel: Function;
}

interface State {
  showBuyOrderModal: boolean;
  assetId: string;
  allAssets: Asset[];
}

class PageBuy extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showBuyOrderModal: false,
      assetId: "",
      allAssets: undefined,
    };
  }

  async componentDidMount() {
    const allAssets = await getAllAssets(firestore);

    this.setState({
      allAssets: allAssets,
    });
  }

  openBuyOrderModal(item) {
    this.setState({ showBuyOrderModal: true, assetId: item });
  }

  cancelBuyOrderModal() {
    this.setState({ showBuyOrderModal: false });
  }
  render() {
    return (
      <Fragment>
        <IonHeader className="ion-no-border" translucent={true}>
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
            {this.state.showBuyOrderModal ? (
              <IonModal
                isOpen={true}
                onDidDismiss={(_) => this.cancelBuyOrderModal()}
              >
                <PageOrderBuy
                  profile={this.props.profile}
                  onCancel={(_) => this.cancelBuyOrderModal()}
                  assetId={this.state.assetId}
                />
              </IonModal>
            ) : (
              ""
            )}
            <IonList lines="none">
              {this.state.allAssets?.map((item, index) => (
                <IonCard
                  key={index}
                  onClick={() => this.openBuyOrderModal(item.name)}
                >
                  <IonItem color="white">
                    <IonImg src={item.logo} alt="" />

                    <IonCardContent>
                      <IonLabel>{item.name}</IonLabel>
                    </IonCardContent>
                    <IonImg src={item.chart} />

                    <IonCardContent slot="end">
                      <IonLabel color="success">{item.percentage}</IonLabel>
                      <IonLabel>
                        {item.price?.quantity} {this.props.profile.currencyCode}
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

export default PageBuy;
