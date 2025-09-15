import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const MenuContainer = styled.div`
  background-color: #fdf5e6; /* Antique White */
  border: 1px solid #d2b48c; /* Tan */
  border-radius: 5px;
  padding: 15px;
  margin: 10px;
  width: 300px;
`;

const MenuTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.span`
  font-weight: bold;
`;

const ItemCount = styled.span`
  color: #555;
`;

const SellButton = styled(Button)`
  margin-left: 10px;
`;

const SellMenu = ({ inventory, onSell }) => {
  const sellPrices = {
    'Tomato': 5,
    'Corn': 8,
    // Add other sell prices for your harvested crops here
  };

  return (
    <MenuContainer>
      <MenuTitle>Sell Your Goods</MenuTitle>
      {Object.keys(inventory).length > 0 ? (
        <ItemList>
          {Object.entries(inventory).map(([itemName, quantity]) => (
            <Item key={itemName}>
              <ItemName>{itemName}</ItemName>
              <ItemCount>x{quantity}</ItemCount>
              <SellButton onClick={() => onSell(itemName, sellPrices[itemName] || 1)}>
                Sell ({sellPrices[itemName] || 1} coins)
              </SellButton>
            </Item>
          ))}
        </ItemList>
      ) : (
        <p>Your inventory is empty.</p>
      )}
    </MenuContainer>
  );
};

export default SellMenu;