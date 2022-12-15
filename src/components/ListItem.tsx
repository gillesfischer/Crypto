import React from 'react';
import { Link } from 'react-router-dom';
import { Coin } from '../types/Coin';

type ListItemProps = {
  coin: Coin;
};
export const ListItem = ({ coin }: ListItemProps) => {
  return (
    <div className='home-crypto'>
      <Link to={`/${coin.id}`}>
        <span className='home-crypto-image'>
          <img src={coin.large} alt={`${coin.id} icon`} />
        </span>
        <span className='home-crypto-name'>{coin.name}</span>
        {coin.price_btc && (
          <span className='home-crypto-prices'>
            <span className='home-crypto-btc'>
              <img src='/bitcoin.webp' alt='Bitcoin icon' />
              {coin.price_btc} BTC
            </span>
            <span className='home-crypto-usd'>({coin.price_usd} USD)</span>
          </span>
        )}
      </Link>
    </div>
  );
};
