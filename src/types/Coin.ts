export type Coin = {
  id: string;
  name: string;
  large: string;
  price_btc?: number;
  price_usd?: number;
  symbol?: string;
  image?: CoinImage;
  market_cap_rank?: number;
  market_data?: MarketData;
};

export type MarketData = {
  high_24h: Currency;
  low_24h: Currency;
  circulating_supply: number;
  current_price: Currency;
  price_change_percentage_1y_in_currency: Currency;
};

export type Currency = {
  usd: string;
};

export type CoinImage = {
  large: string;
};

export type TrendingCoin = {
  item: Coin;
};
