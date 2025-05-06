import React from 'react';
import styled from 'styled-components';

const BuildingContainer = styled.div`
  position: absolute; /* Allows positioning on the farm grid */
  width: ${props => props.width || '80px'};
  height: ${props => props.height || '80px'};
  background-color: ${props => props.color || '#a0522d'}; /* Default brown for wood */
  border: 1px solid #8b4513;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 0.8em;
  cursor: pointer;
`;

const BuildingLabel = styled.span`
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 3px;
`;

const Building = ({ type, x, y, width, height, color, onClick }) => {
  const style = {
    top: `${y * 100 + (100 - (height || 80))}px`, // Adjust for tile size and building height
    left: `${x * 100 + (100 - (width || 80))}px`, // Adjust for tile size and building width
  };

  return (
    <BuildingContainer style={style} width={width} height={height} color={color} onClick={onClick}>
      <BuildingLabel>{type}</BuildingLabel>
    </BuildingContainer>
  );
};

export default Building;