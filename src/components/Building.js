import React from 'react';
import styled from 'styled-components';

const BuildingContainer = styled.div`
  position: absolute;
  border: 2px solid ${props => props.borderColor || '#8b4513'};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
  
  // Dynamic styles based on building type
  ${props => {
    switch (props.type) {
      case 'Barn':
        return `
          background-color: #A40000; /* Dark Red */
          width: 150px;
          height: 100px;
          color: white;
          border-radius: 5px;
          box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
        `;
      case 'Silo':
        return `
          background-color: #BDB76B; /* Dark Khaki */
          width: 60px;
          height: 120px;
          border-radius: 50% 50% 0 0;
          color: white;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        `;
      case 'Coop':
        return `
          background-color: #D4B692; /* Light Tan */
          width: 80px;
          height: 80px;
          border-radius: 5px;
          color: #333;
          border: 2px solid #8B4513;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        `;
      default:
        return `
          background-color: #a0522d;
          width: 80px;
          height: 80px;
          color: white;
          border-radius: 5px;
        `;
    }
  }}

  // Hover effect
  &:hover {
    transform: scale(1.05);
    z-index: 20;
  }
`;

const BuildingLabel = styled.span`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 5px;
  border-radius: 3px;
  font-size: 0.8em;
  text-align: center;
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
`;

const Building = ({ type, x, y, width, height, onClick }) => {
  const style = {
    top: `${y * 100 + (100 - (height || 80))}px`,
    left: `${x * 100 + (100 - (width || 80))}px`,
  };

  const getBuildingEmoji = (buildingType) => {
    switch(buildingType) {
      case 'Barn':
        return '🏠';
      case 'Coop':
        return '🐔';
      case 'Silo':
        return '🌾';
      default:
        return '';
    }
  };

  return (
    <BuildingContainer
      style={style}
      type={type}
      width={width}
      height={height}
      onClick={onClick}
    >
      <BuildingLabel>
        {getBuildingEmoji(type)} {type}
      </BuildingLabel>
    </BuildingContainer>
  );
};

export default Building;