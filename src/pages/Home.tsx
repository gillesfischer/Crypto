import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { ListItem } from '../components/ListItem';
import debounce from '../helpers/debounce';
import { Coin, TrendingCoin } from '../types/Coin';

export const Home = () => {
  const [trendingCoins, setTrendingCoins] = useState<Coin[]>();
  const [coins, setCoins] = useState<Coin[]>();
  const [searching, setSearching] = useState<boolean>();
  const [searched, setSearched] = useState<boolean>();

  const searchCoins = debounce(
    async (value: string) => {
      setSearching(true);
      if (value.length >= 3) {
        setSearched(true);
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/search?query=${value}`
        );

        const data = res.data.coins.map((coin: Coin) => {
          return {
            id: coin.id,
            name: coin.name,
            large: coin.large,
          };
        });
        setCoins(data);
      } else {
        setCoins(trendingCoins);
        setSearched(false);
      }
      setSearching(false);
    },
    1000,
    false
  );

  useEffect(() => {
    const fetchCoins = async () => {
      const [res, btcRes] = await Promise.all([
        axios.get('https://api.coingecko.com/api/v3/search/trending'),
        axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
        ),
      ]);

      const btcPrice = btcRes.data.bitcoin.usd;

      const data = res.data.coins.map((coin: TrendingCoin) => {
        return {
          id: coin.item.id,
          name: coin.item.name,
          large: coin.item.large,
          price_btc: coin.item.price_btc!.toFixed(10),
          price_usd: (coin.item.price_btc! * btcPrice).toFixed(10),
        };
      });
      setCoins(data);
      setTrendingCoins(data);
    };
    fetchCoins();
  }, []);

  console.log(coins);
  return (
    <div>
      <Header />
      <div className='home-search'>
        <div className='width'>
          <h2>Search for a coin</h2>
          <div className={`home-search-input ${searching ? 'searching' : ''}`}>
            <input type='text' onChange={(e) => searchCoins(e.target.value)} />
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512 512'
              width='20'
            >
              <path
                fill='currentColor'
                d='M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zm0 416c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM48 304c26.5 0 48-21.5 48-48s-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48zm464-48c0-26.5-21.5-48-48-48s-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48zM142.9 437c18.7-18.7 18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zm0-294.2c18.7-18.7 18.7-49.1 0-67.9S93.7 56.2 75 75s-18.7 49.1 0 67.9s49.1 18.7 67.9 0zM369.1 437c18.7 18.7 49.1 18.7 67.9 0s18.7-49.1 0-67.9s-49.1-18.7-67.9 0s-18.7 49.1 0 67.9z'
              />
            </svg>
          </div>
        </div>
      </div>
      <div className='home-cryptos'>
        <div className='width'>
          <h2>{searched ? 'Search results' : 'Trending coins'}</h2>

          <div className='home-cryptos-list'></div>
          {coins && coins.map((coin) => <ListItem key={coin.id} coin={coin} />)}
        </div>
      </div>
    </div>
  );
};
