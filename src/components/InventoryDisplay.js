import React from 'react';
import styled from 'styled-components';

const InventoryDisplay = ({ inventory }) => {
  return (
    <div>
      <h2>Inventory</h2>
      {inventory && inventory.seeds ? (
        <ul>
          {inventory.seeds.map((seed, index) => (
            <li key={index}>Seed: {seed.name} (Quantity: {seed.quantity})</li>
          ))}
        </ul>
      ) : (
        <p>Inventory is empty</p>
      )}
    </div>
  );
};

export default InventoryDisplay;
