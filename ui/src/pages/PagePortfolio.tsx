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
  IonIcon,
  IonButton,
  IonButtons,
} from "@ionic/react";
import React from "react";
import { searchOutline } from "ionicons/icons";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { UserProfile, Context } from "../Model";
import i18n from "../i18n";

interface Props {
  profile: UserProfile;
  userContext: Context;
}

interface State {}

const options: Highcharts.Options = {
  title: {
    text: "",
  },
  chart: {
    backgroundColor: "#f5f5f5",
    spacingLeft: 45,
    spacingRight: 270,
  },
  xAxis: {
    visible: false,
  },
  yAxis: {
    visible: false,
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    line: {
      dataLabels: {
        enabled: true,
      },
      color: "red",
      enableMouseTracking: false,
    },
  },
  series: [
    {
      type: "line",
      data: [34000, 43000, 37000, 49000, 50000, 56000, 37234, 53235, 51234],
    },
  ],
};

class PagePortfolio extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  async componentDidMount() {}
  render() {
    return (
      <IonPage>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>
              {" "}
              {this.props.profile.currencyCode}{" "}
              {this.props.userContext.portfolioValue.quantity}
            </IonTitle>
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
              <IonTitle size="large">{i18n.t("portfolio_val")}</IonTitle>
            </IonToolbar>
            <IonToolbar>
              <IonTitle size="large">
                {this.props.profile.currencyCode}{" "}
                {this.props.userContext.portfolioValue.quantity}
              </IonTitle>
            </IonToolbar>
          </IonHeader>

          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            {...this.props}
          />

          <IonList lines="none">
            {this.props.userContext.portfolioAssets.map((item, index) => (
              <IonCard routerLink={"/PageAsset/" + item.name} key={index}>
                <IonItem color="white">
                  <img src={item.logo} alt="" />
                  <IonCardContent></IonCardContent>{" "}
                  <IonCardContent>
                    <IonLabel>{item.name}</IonLabel>
                  </IonCardContent>
                  <IonCardContent slot="end">
                    <IonLabel>
                      <IonLabel>
                        {item.units * item.price.quantity}{" "}
                        {this.props.profile.currencyCode}
                      </IonLabel>
                      <IonLabel>
                        {item.units} {item.name}
                      </IonLabel>
                    </IonLabel>
                  </IonCardContent>
                </IonItem>
              </IonCard>
            ))}
          </IonList>
        </IonContent>
      </IonPage>
    );
  }
}

export default PagePortfolio;
