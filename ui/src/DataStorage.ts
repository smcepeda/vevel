import { withRouter } from 'react-router';
import { NewsItem, UserProfile, Asset, Money, Context, MarketItem } from './Model';
import firebase from "firebase";


export function getUserProfileSnapshot(firestoreRef: firebase.firestore.Firestore, userId: string, onResult: (profile: UserProfile) => any): () => void {
  return firestoreRef
    .collection("user")
    .doc(userId)
    .onSnapshot((dbProfile: any) => {
      if (dbProfile.exists) {
        onResult(dbProfile.data() as UserProfile);
      }
    });
}

export async function getWishlistAssets(store: firebase.firestore.Firestore, user : UserProfile): Promise<Asset[]> {
  return getAssetsByIds(store, user.wishlist);
}

export async function getAssetsByIds(store: firebase.firestore.Firestore, assetIds: any): Promise<Asset[]> {
  if(!assetIds || assetIds.length === 0){
    return [];
  }
  return store.collection("asset")
    .where("name", "in", assetIds)
    .get()
    .then((db: any) => db.docs.map(doc => doc.data() as Asset));
}

export async function getNewsItems(store: firebase.firestore.Firestore) : Promise<NewsItem[]> {
  return store
  .collection("news")
    .get()
    .then(result => result.docs.map(doc => doc.data() as NewsItem))
}

export async function getMarketItems(store: firebase.firestore.Firestore) : Promise<MarketItem[]> {
  return store
  .collection("asset").where("market","==","true")
    .get()
    .then(result => result.docs.map(doc => doc.data() as MarketItem))
}

export async function getAllAssets(store: firebase.firestore.Firestore) : Promise<Asset[]> {
  return store
  .collection("asset")
    .get()
    .then(result => result.docs.map(doc => doc.data() as Asset))
}

export async function updatePricesInDB(store: firebase.firestore.Firestore,allAssets : Asset){
  const API_KEY : string = "9NOSPS751V6QR9O0";
  let StockSymbol : string = allAssets.name;
  let stockChartXValues = [];
  if (allAssets.type == "crypto") {
    let API_Call : string = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${StockSymbol}&market=USD&apikey=${API_KEY}`;
    const data =  await fetch(API_Call).then(function (response) {
      return response.json()}).then(function (data) {for (var key in data["Time Series (Daily)"]) {
          stockChartXValues.push(data["Time Series (Digital Currency Daily)"][key]["1b. open (USD)"]);
      }});
  }
    else {
  const API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&outputsize=compact&apikey=${API_KEY}`;
  const data =  await fetch(API_Call).then(function (response) {
    return response.json()}).then(function (data) {for (var key in data["Time Series (Daily)"]) {
        stockChartXValues.push(data["Time Series (Daily)"][key]["1. open"]);
    }});
  let newprice : string = stockChartXValues[0];
  await updateAssetPrices(store, allAssets,newprice);

}}

export async function updateAssetPrices(store: firebase.firestore.Firestore, allAssets: Asset, newprice : string) : Promise <any>{
  return store.collection("asset").doc(allAssets.id).update({price: {quantity:parseInt(newprice)}});
}


export async function getUserContext(store: firebase.firestore.Firestore, userProfile : UserProfile) : Promise <Context> {
    const wishlistAssets = await getWishlistAssets(store, userProfile);
    const portfolioAssets = await getPortfolioAssets(store,userProfile);
    const portfolioValue = await getPortfolioValue(userProfile,portfolioAssets);
    
    return { 
        wishlistAssets: wishlistAssets,
        portfolioAssets: portfolioAssets,
        portfolioValue: portfolioValue
    }
}

export async function updateUserProfileLanguage(store: firebase.firestore.Firestore, profileId: string, language: string ) : Promise <any>{
  return store.collection("user").doc(profileId).update({language:language});
}

export async function updateUserProfileCurrency(store: firebase.firestore.Firestore, profileId: string, currency: string ) : Promise <any>{
  return store.collection("user").doc(profileId).update({currencyCode:currency});
}

export async function getPortfolioAssets(store: firebase.firestore.Firestore, user : UserProfile): Promise<Asset[]> {
    const assets : any =  await getAssetsByIds(store, user.positions.map(c => c.assetId));
    let post = user.positions;

    for (var i = 0; i< assets.length; i++) {
        for (var j = 0; j < post.length; j++){
            if(post[j].assetId == assets[i].name){
                assets[i].units = post[j].units
            }
        }
        }

    return assets
  }
  

export async function getAssetsRelevantForUser(userProfile : UserProfile) : Promise <any> {
    let positionIds : string[] = userProfile.positions.map(pos => pos.assetId);
    let wishlistIds: string[] = userProfile.wishlist;
    let units: number[] = userProfile.positions.map(pos => pos.units);
    

    let assetIds = {
        posIds: positionIds,
        wishIds: wishlistIds,
        units: units,
    }


    return assetIds
}

export async function getPortfolioValue(userProfile : UserProfile, portfolioAssets : Asset[]) : Promise<any> {
    const sum : Money = { quantity: 0, currencyCode : userProfile.currencyCode};
    let assetQty: number[] = userProfile.positions.map(pos => pos.units);
    let prices=portfolioAssets.map(item => item.price.quantity);

    const produceAndAdd = (assetQty, prices) => {
        let sum1 = 0;
        for(let i=0; i < assetQty.length; i++) {
           const product = (assetQty[i] * prices[i]);
           sum1 += product;
        };
        return sum1;
     };
     sum.quantity = produceAndAdd(assetQty, prices)
    return sum
}


