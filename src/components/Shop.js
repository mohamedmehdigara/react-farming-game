import React, { useContext } from 'react';
import styled from 'styled-components';
import Button from './Button';
import { FarmStateContext } from './FarmStateProvider';

const ShopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const SeedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Shop = () => {
  const { seeds, buySeed } = useContext(FarmStateContext);

  const handleBuySeed = (seedId) => {
    // Implement logic to deduct money and add seed to inventory
    buySeed(seedId); // Assuming buySeed function updates inventory
  };

  return (
    <ShopContainer>
      <h2>Shop</h2>
      {seeds&&seeds.map((seed) => (
        <SeedItem key={seed.id}>
          <p>{seed.name}</p>
          <p>Price: {seed.price}</p>
          <Button onClick={() => handleBuySeed(seed.id)}>Buy</Button>
        </SeedItem>
      ))}
    </ShopContainer>
  );
};

export default Shop;
