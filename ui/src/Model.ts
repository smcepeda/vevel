export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  language: string;
  currencyCode: string;
  positions: Position[];
  wishlist : string[];
}

export interface Position {
  assetId: string;
  units: number;
}

export interface PopoverModel {
  visible: boolean;
  event?: any;
}

export interface Asset {
    id: string;
    name: string;
    price: Money;
    logo: string;
    chart: string;
    percentage: string;
    context: string;
    type?: string;
    units?: number;
    market?: string;
}

export interface Context {
  wishlistAssets : Asset[];
  portfolioAssets: Asset[];
  portfolioValue: Money;
}

export interface Money {
  quantity: number;
  currencyCode: string;
}

export interface MarketItem {
  id: string;
  name: string;
  price: Money;
}


export interface NewsItem {
  title: string; 
  content: string;
  url: string;
  id: string;
}

