import { Redirect, Route, Link } from "react-router-dom";
import React from "react";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonButton,
  IonActionSheet,
  IonModal,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonSplitPane,
} from "@ionic/react";
import { onAuthenticationChanged } from "./DataApp";

import { IonReactRouter } from "@ionic/react-router";
import {
  person,
  podium,
  home,
  swapVerticalOutline,
  pieChart,
} from "ionicons/icons";
import PageHome from "./pages/PageHome";
import PagePortfolio from "./pages/PagePortfolio";
import PagePrices from "./pages/PagePrices";
import PageSettings from "./pages/PageSettings";
import PageAsset from "./pages/PageAsset";
import PageBuy from "./pages/PageBuy";
import PageSell from "./pages/PageSell";

import { UserProfile, Context } from "./Model";
import { getUserProfileSnapshot, getUserContext } from "./DataStorage";
import firebase, { auth, firestore } from "./ConfigFirebase";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import PageLogin from "./pages/PageLogin";
import PageOrderBuy from "./pages/PageOrderBuy";
import i18n from "./i18n";
import i18next from "i18next";
import PageOrderSell from "./pages/PageOrderSell";

interface Props {}

interface State {
  inited: boolean;
  profile: UserProfile;
  userContext?: Context;
  showActionSheet: any;
  showBuyModal: boolean;
  showSellModal: boolean;
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      profile: undefined,
      inited: false,
      showActionSheet: undefined,
      showBuyModal: false,
      showSellModal: false,
    };
  }

  componentDidMount() {
    onAuthenticationChanged(auth, async (firebaseUser: firebase.User) => {
      if (firebaseUser) {
        getUserProfileSnapshot(
          firestore,
          firebaseUser.uid,
          async (profile: UserProfile) => {
            const userContext = await getUserContext(firestore, profile);

            i18next.changeLanguage(profile.language);
            this.setState({
              inited: true,
              profile: profile,
              userContext: userContext,
            });
          }
        );
      } else {
        this.setState({ inited: true });
      }
    });
  }

  openBuyModal() {
    this.setState({ showBuyModal: true });
  }
  openSellModal() {
    this.setState({ showSellModal: true });
  }

  cancelBuyOrder() {
    this.setState({ showBuyModal: false });
  }

  cancelSellOrder() {
    this.setState({ showSellModal: false });
  }

  securedRoutes() {
    return (
      <div>
        <Route path="/" exact={true}>
          <Redirect to="/tabs/PageHome" />
        </Route>

        <Route path="/PageLogin" exact={true}>
          <PageLogin />
        </Route>

        <Route
          path="/PageAsset/:assetID"
          exact={true}
          render={(props) => (
            <PageAsset
              profile={this.state.profile}
              assetId={props.match.params["assetID"]}
              userContext={this.state.userContext}
            />
          )}
        ></Route>

        <Route
          path="/PageBuy"
          exact={true}
          render={(props) => (
            <PageBuy
              userContext={this.state.userContext}
              profile={this.state.profile}
              onCancel={(_) => this.cancelBuyOrder()}
            />
          )}
        ></Route>

        <Route
          path="/PageSell"
          exact={true}
          render={(props) => (
            <PageSell
              userContext={this.state.userContext}
              profile={this.state.profile}
              onCancel={(_) => this.cancelSellOrder()}
            />
          )}
        ></Route>
        <Route
          path="/PageOrderBuy/:assetID"
          exact={true}
          render={(props) => (
            <PageOrderBuy
              assetId={props.match.params["assetID"]}
              profile={this.state.profile}
            />
          )}
        ></Route>
        <Route
          path="/PageOrderSell/:assetID"
          exact={true}
          render={(props) => (
            <PageOrderSell
              assetId={props.match.params["assetID"]}
              profile={this.state.profile}
            />
          )}
        ></Route>
        <Route
          path="/tabs"
          render={(props: any) => (
            <IonTabs>
              <IonRouterOutlet id="tabs">
                <Route exact path="/tabs/PageHome">
                  <PageHome
                    profile={this.state.profile}
                    userContext={this.state.userContext}
                  />
                </Route>
                <Route exact path="/tabs/PagePortfolio">
                  <PagePortfolio
                    profile={this.state.profile}
                    userContext={this.state.userContext}
                  />
                </Route>
                <Route path="/tabs/PagePrices">
                  <PagePrices />
                </Route>
                <Route path="/tabs/PageSettings" exact={true}>
                  <PageSettings profile={this.state.profile} />
                </Route>
              </IonRouterOutlet>

              <IonTabBar slot="bottom">
                <IonTabButton tab="PageHome" href="/tabs/PageHome">
                  <IonIcon icon={home} />
                  <IonLabel>{i18next.t("homepage")}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="PagePortfolio" href="/tabs/PagePortfolio">
                  <IonIcon icon={pieChart} />
                  <IonLabel>{i18n.t("portfolio")}</IonLabel>
                </IonTabButton>
                <IonTabButton>
                  <IonButton
                    color="secondary"
                    onClick={() => this.setState({ showActionSheet: true })}
                  >
                    <IonIcon icon={swapVerticalOutline} color="tertiary" />
                  </IonButton>
                  <IonLabel>{i18n.t("trade")}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="PagePrices" href="/tabs/PagePrices">
                  <IonIcon icon={podium} />
                  <IonLabel>{i18n.t("prices")}</IonLabel>
                </IonTabButton>
                <IonTabButton tab="PageSettings" href="/tabs/PageSettings">
                  <IonIcon icon={person} />
                  <IonLabel>{i18n.t("settings")}</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          )}
        ></Route>
      </div>
    );
  }

  render() {
    const { inited, profile } = this.state;
    return (
      <IonApp>
        <IonModal isOpen={this.state.showBuyModal}>
          <PageBuy
            userContext={this.state.userContext}
            profile={this.state.profile}
            onCancel={(_) => this.cancelBuyOrder()}
          />{" "}
          <IonButton
            color="white"
            expand="block"
            onClick={() => this.setState({ showBuyModal: false })}
          ></IonButton>
        </IonModal>
        <IonModal isOpen={this.state.showSellModal}>
          <PageSell
            userContext={this.state.userContext}
            profile={this.state.profile}
            onCancel={(_) => this.cancelSellOrder()}
          />
          <IonButton
            color="white"
            expand="block"
            onClick={() => this.setState({ showSellModal: false })}
          ></IonButton>
        </IonModal>
        <IonActionSheet
          isOpen={this.state.showActionSheet}
          onDidDismiss={() => this.setState({ showActionSheet: false })}
          cssClass="my-custom-class"
          buttons={[
            {
              text: i18n.t("buy_shares"),
              handler: () => {
                return this.openBuyModal();
              },
            },
            {
              text: i18n.t("sell_shares"),
              handler: () => {
                return this.openSellModal();
              },
            },
            {
              text: i18n.t("standing_order"),
              handler: () => {},
            },
            {
              text: i18n.t("cancel"),
              role: "cancel",
              handler: () => {},
            },
          ]}
        ></IonActionSheet>
        {inited && (
          <IonReactRouter>
            <IonRouterOutlet>
              <Route
                path="/"
                render={(props) =>
                  profile ? this.securedRoutes() : <PageLogin />
                }
              />
            </IonRouterOutlet>
          </IonReactRouter>
        )}
      </IonApp>
    );
  }
}

export default App;
