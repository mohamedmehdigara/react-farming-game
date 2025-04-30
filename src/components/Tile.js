import React from 'react';
import styled from 'styled-components';

const TileContainer = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer; /* Basic interactivity */
`;

const Tile = ({ type, onClick, children }) => {
  return (
    <TileContainer onClick={onClick} data-tile-type={type}>
      {children}
    </TileContainer>
  );
};

export default Tile;