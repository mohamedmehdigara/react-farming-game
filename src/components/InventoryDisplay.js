import React from 'react';
import styled from 'styled-components';

// Styled Components
const InventoryContainer = styled.div`
  background-color: #fcf8e3; /* A light, parchment-like color */
  border: 2px solid #b8860b; /* Dark Goldenrod */
  border-radius: 8px;
  padding: 15px;
  margin: 10px;
  width: 300px;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InventoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const InventoryTitle = styled.h4`
  margin: 0;
  color: #8b4513; /* SaddleBrown */
  font-size: 1.2em;
`;

const ItemCountTotal = styled.span`
  font-size: 0.9em;
  color: #777;
  font-style: italic;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ItemIcon = styled.span`
  font-size: 1.2em;
  margin-right: 10px;
`;

const ItemName = styled.span`
  font-weight: bold;
`;

const ItemQuantity = styled.span`
  font-size: 0.9em;
  color: #444;
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 2px 6px;
`;

const EmptyInventory = styled.p`
  text-align: center;
  color: #888;
  font-style: italic;
`;

// Helper function to get an emoji icon for the item
const getItemIcon = (itemName) => {
  switch (itemName.toLowerCase()) {
    case 'tomato':
      return '🍅';
    case 'corn':
      return '🌽';
    case 'pumpkin':
      return '🎃';
    case 'potato':
      return '🥔';
    case 'egg':
      return '🥚';
    case 'milk':
      return '🥛';
    case 'wood':
      return '🌲';
    case 'plant_fiber':
      return '🌿';
    case 'wooden_fence':
      return '🚧';
    default:
      return '📦';
  }
};

const InventoryDisplay = ({ inventory }) => {
  const totalItems = Object.values(inventory).reduce((sum, count) => sum + count, 0);

  // Get and sort inventory items alphabetically
  const sortedInventory = Object.entries(inventory).sort(([a], [b]) => a.localeCompare(b));

  return (
    <InventoryContainer>
      <InventoryHeader>
        <InventoryTitle>Inventory</InventoryTitle>
        <ItemCountTotal>Total Items: {totalItems}</ItemCountTotal>
      </InventoryHeader>
      
      {sortedInventory.length > 0 ? (
        <ItemList>
          {sortedInventory.map(([itemName, quantity]) => (
            <Item key={itemName}>
              <ItemInfo>
                <ItemIcon>{getItemIcon(itemName)}</ItemIcon>
                <ItemName>{itemName}</ItemName>
              </ItemInfo>
              <ItemQuantity>x{quantity}</ItemQuantity>
            </Item>
          ))}
        </ItemList>
      ) : (
        <EmptyInventory>Your inventory is empty.</EmptyInventory>
      )}
    </InventoryContainer>
  );
};

export default InventoryDisplay;