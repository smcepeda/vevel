import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonCard,
  IonLabel,
  IonIcon,
  IonText,
  IonButtons,
  IonButton,
  IonInput,
} from "@ionic/react";
import React, { Fragment } from "react";
import { closeOutline } from "ionicons/icons";
import { UserProfile, Asset } from "../Model";
import { getAssetsByIds } from "../DataStorage";
import Plot from "react-plotly.js";
import { firestore } from "../ConfigFirebase";
import i18n from "../i18n";

interface Props {
  assetId: string;
  profile: UserProfile;
  onCancel?: Function;
}

interface State {
  number: number;
  asset: Asset;
  stockChartXValues: string[];
  stockChartYValues: string[];
}

class PageOrderSell extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      number: 0,
      asset: undefined,
      stockChartXValues: [],
      stockChartYValues: [],
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

  fetchStock() {
    const pointerToThis = this;
    const API_KEY = "9NOSPS751V6QR9O0";
    let StockSymbol = this.props.assetId;
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
  render() {
    const { asset } = this.state;
    const config = { displayModeBar: false };

    return (
      <Fragment>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={(_) => this.props.onCancel()}>
                <IonIcon icon={closeOutline}></IonIcon>
              </IonButton>
            </IonButtons>
            <IonTitle></IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader className="ion-no-border" collapse="condense">
            <IonToolbar>
              <IonTitle size="large">
                {i18n.t("pageorder_sell")} ({this.props.assetId}){" "}
              </IonTitle>
            </IonToolbar>

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

            <IonList lines="none">
              <IonItem>
                <IonLabel>
                  {" "}
                  {i18n.t("pageorder_amount")} ({this.props.assetId}):
                </IonLabel>

                <IonInput
                  class="ion-text-center"
                  type="number"
                  value={this.state.number}
                  placeholder="Enter Number"
                  onIonChange={(e) =>
                    this.setState({ number: parseInt(e.detail.value!, 10) })
                  }
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel slot="start">
                  {this.props.assetId}-{i18n.t("price")}:
                </IonLabel>
                <IonLabel>
                  {this.state.stockChartYValues[0]}{" "}
                  {this.props.profile.currencyCode}
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>{i18n.t("pageorder_availability")}</IonLabel>
                <IonLabel>{i18n.t("pageorder_availabiltiy_res")}</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>{i18n.t("pageorder_pay")}</IonLabel>
                <IonLabel>Mastercard</IonLabel>
              </IonItem>
              <IonCard class="ion-text-center" color="white">
                <IonLabel>
                  <IonButton color="white" routerLink={"/"}>
                    <IonText color="primary">
                      {i18n.t("pageorder_confirm_sell")}
                    </IonText>
                  </IonButton>
                </IonLabel>
              </IonCard>{" "}
            </IonList>
          </IonHeader>
        </IonContent>
      </Fragment>
    );
  }
}

export default PageOrderSell;
