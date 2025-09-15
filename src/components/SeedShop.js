import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const ShopContainer = styled.div`
  background-color: #f5f5dc; /* Beige */
  border: 1px solid #d2b48c; /* Tan */
  border-radius: 5px;
  padding: 15px;
  margin: 10px;
  width: 300px;
`;

const ShopTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
`;

const SeedItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const SeedName = styled.span`
  font-weight: bold;
`;

const SeedPrice = styled.span`
  color: green;
`;

const SeedShop = ({ onBuySeed, currentSeason }) => {
  // Sample seed data for the shop
  const shopSeeds = [
    { id: 101, name: 'Carrot Seeds', price: 5, growTime: 3000, seasons: ['spring', 'summer'] },
    { id: 102, name: 'Radish Seeds', price: 8, growTime: 2000, seasons: ['spring'] },
    { id: 103, name: 'Beetroot Seeds', price: 12, growTime: 5000, seasons: ['fall'] },
    { id: 104, name: 'Sunflower Seeds', price: 15, growTime: 7000, seasons: ['summer'] },
  ];

  return (
    <ShopContainer>
      <ShopTitle>Seed Shop</ShopTitle>
      {shopSeeds.map((seed) => {
        const isAvailable = seed.seasons.includes(currentSeason);
        return (
          <SeedItem key={seed.id}>
            <SeedName>{seed.name}</SeedName>
            <SeedPrice>Price: {seed.price} coins</SeedPrice>
            <Button
              onClick={() => onBuySeed(seed)}
              variant="success"
              size="small"
              disabled={!isAvailable}
            >
              {isAvailable ? 'Buy' : 'Out of Season'}
            </Button>
          </SeedItem>
        );
      })}
    </ShopContainer>
  );
};

export default SeedShop;