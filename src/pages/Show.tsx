import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Header } from '../components/Header';
import { ChartData } from '../types/Chart';
import { Coin } from '../types/Coin';

export const Show = () => {
  const { id } = useParams();
  const [data, setData] = useState<ChartData[]>();
  const [coin, setCoin] = useState<Coin>();

  useEffect(() => {
    const fetchCoin = async () => {
      const [graphRes, dataRes] = await Promise.all([
        axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=364`
        ),
        axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&market_data=true`
        ),
      ]);

      console.log('7 days data', graphRes.data);
      const graphData = graphRes.data.prices.map((price: [number, number]) => {
        const [timestamp, p] = price;
        const t = new Date(timestamp).toLocaleDateString('en-us');
        return { date: t, price: p };
      });

      setData(graphData);
      setCoin(dataRes.data);
    };
    fetchCoin();
  }, [id]);

  return (
    <div>
      <Header showBack={true} />
      {!data || !coin ? (
        <h1>Loading Data...</h1>
      ) : (
        <>
          <header className='show-header'>
            <img src={coin.image?.large} alt={`${coin.id} icon`}></img>
            <h2>
              {coin?.name} {coin?.symbol}
            </h2>
          </header>
          <div className='width'>
            <div className='show-graph'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart
                  data={data}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type='monotone'
                    dataKey='price'
                    stroke='#000'
                    fill='gold'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='show-details'>
            <div className='width'>
              <h2>Details</h2>
              <div className='show-details-row'>
                <h3>Market cap rank</h3>
                <span>{coin.market_cap_rank}</span>
              </div>
              <div className='show-details-row'>
                <h3>24h high</h3>
                <span>${coin.market_data?.high_24h.usd}</span>
              </div>
              <div className='show-details-row'>
                <h3>24h low</h3>
                <span>${coin.market_data?.low_24h.usd}</span>
              </div>
              <div className='show-details-row'>
                <h3>Circulating supply</h3>
                <span>${coin.market_data?.circulating_supply}</span>
              </div>
              <div className='show-details-row'>
                <h3>Current price</h3>
                <span>${coin.market_data?.current_price.usd}</span>
              </div>
              <div className='show-details-row'>
                <h3>1year change</h3>
                <span>
                  {coin.market_data?.price_change_percentage_1y_in_currency.usd}
                  %
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
