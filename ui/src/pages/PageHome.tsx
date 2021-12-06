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
  IonSlide,
  IonLabel,
  IonIcon,
  IonImg,
  IonListHeader,
  IonButton,
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
} from "@ionic/react";
import React from "react";
import { chevronDownCircleOutline, searchOutline } from "ionicons/icons";
import i18next from "../i18n";
import i18n from "i18next";

import { UserProfile, NewsItem, Asset, Context, MarketItem } from "../Model";
import {
  getNewsItems,
  getMarketItems,
  getAllAssets,
  updatePricesInDB,
} from "../DataStorage";
import { firestore } from "../ConfigFirebase";

const slideOpts = {
  speed: 200,
  spaceBetween: 1,
  slidesPerView: 3,
  loop: false,
  direction: "horizontal",
};

interface Props {
  profile: UserProfile;
  userContext: Context;
}

interface State {
  newsItems?: NewsItem[];
  marketItems?: MarketItem[];
  showNotification: boolean;
  allAssets?: Asset[];
  search: "";
  openSearchBar: boolean;
}

class PageHome extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      newsItems: undefined,
      marketItems: undefined,
      showNotification: true,
      search: "",
      openSearchBar: false,
    };
  }

  async componentDidMount() {
    const allAssets = await getAllAssets(firestore);
    const marketItems = await getMarketItems(firestore);
    const newsItems = await getNewsItems(firestore);

    this.setState({
      newsItems: newsItems,
      marketItems: marketItems,
      allAssets: allAssets,
    });
  }

  handleChange(e) {
    this.setState({
      search: e.target.value,
    });
  }

  async fetchData() {
    this.state.allAssets.forEach((item) => updatePricesInDB(firestore, item));
  }
  render() {
    const { marketItems } = this.state;

    const empty_state = (
      <div>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>
              {this.props.userContext.portfolioValue.currencyCode}{" "}
              {this.props.userContext.portfolioValue.quantity}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => this.setState({ openSearchBar: true })}>
                <IonIcon color="primary" icon={searchOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader className="ion-no-border" collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{i18next.t("portfolio_val")}</IonTitle>
            </IonToolbar>
            <IonToolbar>
              <IonTitle size="large">
                {this.props.userContext.portfolioValue.currencyCode}{" "}
                {this.props.userContext.portfolioValue.quantity}
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonRefresher
            slot="fixed"
            onIonRefresh={(evt) =>
              this.fetchData().then((_) => evt.detail.complete())
            }
          >
            <IonRefresherContent
              refreshingSpinner="circles"
              pullingIcon={chevronDownCircleOutline}
            />
          </IonRefresher>

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
            {/* 
            <IonListHeader slot="start">
              <IonLabel>{i18n.t("overview")}</IonLabel>
            </IonListHeader>

             {marketItems ? (
             <IonSlides pager={true} options={slideOpts}>
                marketItems.map((item: Asset, index) => (
                  <IonSlide key={index}>
                    <IonCard routerLink={"/PageAsset/" + item.name}>
                      <IonCardHeader>{item.name}</IonCardHeader>
                      <IonCardContent>{item.price?.quantity}</IonCardContent>
                      {/* {JSON.stringify(item)}{" "} 
                    </IonCard>
                  </IonSlide>
                ))}
              </IonSlides>
            ) : null} */}

            <IonListHeader slot="start">
              <IonLabel>{i18n.t("watchlist")}</IonLabel>
            </IonListHeader>

            <IonList lines="none">
              {this.props.userContext.wishlistAssets.map((item, index) => (
                <IonCard routerLink={"/PageAsset/" + item.name} key={index}>
                  <IonItem color="white">
                    <IonImg src={item.logo} alt="" />

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

            <IonListHeader slot="start">
              <IonLabel>{i18n.t("news")}</IonLabel>
            </IonListHeader>

            <IonList>
              {this.state.newsItems?.map((item, index) => (
                <IonCard key={index}>
                  <IonCardHeader>
                    <IonLabel color="primary">{item.title} </IonLabel>
                  </IonCardHeader>
                  <IonCardContent>{item.content}</IonCardContent>
                </IonCard>
              ))}
            </IonList>
          </IonList>
        </IonContent>
      </div>
    );

    const searching = (
      <div>
        <br />
        <IonSearchbar
          onIonChange={(e) => this.handleChange(e)}
          placeholder="Nach Assets suchen"
          animated
          showCancelButton="always"
          onIonCancel={() => this.setState({ openSearchBar: false })}
        ></IonSearchbar>

        <IonList>
          {this.state.allAssets
            ?.filter(
              (card) =>
                card.name
                  .toLowerCase()
                  .indexOf(this.state.search.toLowerCase()) >= 0
            )
            .map((asset: Asset, index: number) => (
              <IonItem
                lines="none"
                key={index}
                routerLink={"/PageAsset/" + asset.name}
              >
                <IonLabel>{asset.name}</IonLabel>
              </IonItem>
            ))}
        </IonList>
      </div>
    );

    return (
      <IonPage>{!this.state.openSearchBar ? empty_state : searching}</IonPage>
    );
  }
}

export default PageHome;
