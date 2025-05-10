import React from 'react';
import styled from 'styled-components';

const InventoryContainer = styled.div`
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  width: 300px;
`;

const InventoryTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 8px;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.span`
  font-weight: bold;
`;

const ItemCount = styled.span`
  color: #777;
`;

const InventoryDisplay = ({ inventory }) => {
  return (
    <InventoryContainer>
      <InventoryTitle>Inventory</InventoryTitle>
      <ItemList>
        {Object.entries(inventory).length > 0 ? (
          Object.entries(inventory).map(([itemName, quantity]) => (
            <Item key={itemName}>
              <ItemName>{itemName}</ItemName>
              <ItemCount>x{quantity}</ItemCount>
            </Item>
          ))
        ) : (
          <p>Inventory is empty.</p>
        )}
      </ItemList>
    </InventoryContainer>
  );
};

export default InventoryDisplay;