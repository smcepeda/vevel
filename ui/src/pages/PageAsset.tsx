import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
  IonLabel,
  IonImg,
  IonText,
  IonBackButton,
  IonButtons,
  IonListHeader,
  IonButton,
  IonActionSheet,
  IonModal,
  IonSkeletonText,
} from "@ionic/react";
import React from "react";
import { UserProfile, Context, Asset } from "../Model";
import { getAssetsByIds } from "../DataStorage";
import Plot from "react-plotly.js";
import { firestore } from "../ConfigFirebase";
import i18n from "../i18n";
import PageOrderBuy from "./PageOrderBuy";
import PageOrderSell from "./PageOrderSell";
import api_key from "../ConfigPrices";

interface Props {
  profile: UserProfile;
  assetId: string;
  userContext?: Context;
}

interface State {
  asset?: Asset;
  stockChartXValues: string[];
  stockChartYValues: string[];
  showActionSheet: any;
  showBuyModal: boolean;
  showSellModal: boolean;
}

class PageAsset extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      asset: undefined,
      stockChartXValues: [],
      stockChartYValues: [],
      showActionSheet: undefined,
      showBuyModal: false,
      showSellModal: false,
    };
  }

  async componentDidMount() {
    const assetId: string[] = [this.props.assetId];
    const asset = await getAssetsByIds(firestore, assetId);
    this.setState({
      asset: asset[0],
    });

    this.fetchStock();
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

  fetchStock() {
    const pointerToThis = this;
    const API_KEY = api_key;
    let StockSymbol = this.props.assetId;
    if (this.state.asset.type == "crypto") {
      let API_Call = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${StockSymbol}&market=USD&apikey=${API_KEY}`;
      let stockChartXValuesFunction = [];
      let stockChartYValuesFunction = [];

      fetch(API_Call)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          for (var key in data["Time Series (Digital Currency Daily)"]) {
            stockChartXValuesFunction.push(key);
            stockChartYValuesFunction.push(
              data["Time Series (Digital Currency Daily)"][key][
                "1b. open (USD)"
              ]
            );
          }
          pointerToThis.setState({
            stockChartXValues: stockChartXValuesFunction,
            stockChartYValues: stockChartYValuesFunction,
          });
        });
    } else {
      let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&outputsize=compact&apikey=${API_KEY}`;
      let stockChartXValuesFunction = [];
      let stockChartYValuesFunction = [];

      fetch(API_Call)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          for (var key in data["Time Series (Daily)"]) {
            stockChartXValuesFunction.push(key);
            stockChartYValuesFunction.push(
              data["Time Series (Daily)"][key]["1. open"]
            );
          }
          pointerToThis.setState({
            stockChartXValues: stockChartXValuesFunction,
            stockChartYValues: stockChartYValuesFunction,
          });
        });
    }
  }

  render() {
    const { asset } = this.state;
    const config = { displayModeBar: false };

    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>
              {this.state.stockChartYValues[0]}{" "}
              {this.props.profile.currencyCode}{" "}
            </IonTitle>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          {this.state.showBuyModal ? (
            <IonModal isOpen={true} onDidDismiss={(_) => this.cancelBuyOrder()}>
              <PageOrderBuy
                assetId={asset?.name}
                profile={this.props.profile}
                onCancel={(_) => this.cancelBuyOrder()}
              />{" "}
            </IonModal>
          ) : (
            ""
          )}
          {this.state.showSellModal ? (
            <IonModal
              isOpen={true}
              onDidDismiss={(_) => this.cancelSellOrder()}
            >
              <PageOrderSell
                assetId={asset?.name}
                profile={this.props.profile}
                onCancel={(_) => this.cancelSellOrder()}
              />{" "}
            </IonModal>
          ) : (
            ""
          )}

          <IonActionSheet
            isOpen={this.state.showActionSheet}
            onDidDismiss={() => this.setState({ showActionSheet: false })}
            cssClass="my-custom-class"
            buttons={[
              {
                text: i18n.t("buy_shares"),
                role: "destructive",
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
          <IonHeader className="ion-no-border" collapse="condense">
            <IonToolbar>
              <IonTitle size="large">
                {asset?.name}-{i18n.t("price")}
              </IonTitle>
            </IonToolbar>
            <IonToolbar>
              <IonTitle size="large">
                {this.state.stockChartYValues[0]}{" "}
                {this.props.profile.currencyCode}
              </IonTitle>
            </IonToolbar>
          </IonHeader>

          {this.state.stockChartXValues.length === 0 ? (
            <IonSkeletonText
              animated
              class="ion-text-center"
              style={{ width: "100%", height: "40%" }}
            />
          ) : (
            <Plot
              config={config}
              data={[
                {
                  x: this.state.stockChartXValues,
                  y: this.state.stockChartYValues,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "red" },
                },
              ]}
              layout={{
                width: 400,
                height: 440,
                paper_bgcolor: "rgba(0,0,0,0)",
                plot_bgcolor: "rgba(0,0,0,0)",
              }}
            />
          )}

          <IonList lines="none">
            <IonCard>
              <IonItem color="white">
                <IonImg src={asset?.logo} alt="" />
                <IonLabel></IonLabel>
                <IonCardContent>
                  <IonLabel text-wrap>{asset?.name}</IonLabel>
                </IonCardContent>

                <IonCardContent slot="end">
                  <IonLabel color="success">{asset?.percentage}</IonLabel>
                  <IonLabel>
                    {this.state.stockChartYValues[0]}{" "}
                    {this.props.profile.currencyCode}
                  </IonLabel>
                </IonCardContent>
              </IonItem>
            </IonCard>
            <IonCard class="ion-text-center" color="white">
              <IonLabel>
                <IonButton
                  color="white"
                  onClick={() => this.setState({ showActionSheet: true })}
                >
                  <IonText color="primary">{i18n.t("trade")}</IonText>
                </IonButton>
              </IonLabel>
            </IonCard>
          </IonList>

          <IonList lines="none">
            <IonListHeader slot="start">
              <IonLabel>
                {i18n.t("info")} {asset?.name}
              </IonLabel>
            </IonListHeader>
            <IonCard>
              <IonItem color="white">
                <IonCardContent>
                  <IonText text-wrap>{asset?.context}</IonText>
                </IonCardContent>
              </IonItem>
            </IonCard>
          </IonList>
        </IonContent>
      </IonPage>
    );
  }
}

export default PageAsset;
