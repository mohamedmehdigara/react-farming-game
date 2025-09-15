import React from 'react';
import styled, { css } from 'styled-components';
import Plant from './Plant';

// Helper function to determine the visual style of the tile
const getTileStyles = (type, isInteractive) => {
  switch (type) {
    case 'dirt':
      return css`
        background-color: #8b4513; /* SaddleBrown */
        &:hover {
          background-color: ${isInteractive ? '#a0522d' : '#8b4513'};
        }
      `;
    case 'grass':
      return css`
        background-color: #228b22; /* ForestGreen */
        &:hover {
          background-color: ${isInteractive ? '#2e8b57' : '#228b22'};
        }
      `;
    case 'water':
      return css`
        background-color: #4682b4; /* SteelBlue */
        cursor: not-allowed;
      `;
    default:
      return css`
        background-color: #d2b48c; /* Tan */
      `;
  }
};

const TileContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  position: relative;
  transition: all 0.2s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  ${props => getTileStyles(props.type, props.isInteractive)}

  ${props => props.isInteractive && css`
    cursor: pointer;
    &:active {
      transform: scale(0.95);
    }
  `}
`;

const WaterLevel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #1e90ff; /* DodgerBlue */
  transition: height 0.5s ease-in-out;
  opacity: 0.8;
`;

const Field = ({ type, onClick, onSelect, fieldData, seeds }) => {
  const isInteractive = type === 'dirt' || (fieldData && fieldData.isReady);

  const handleInteraction = () => {
    if (isInteractive) {
      onClick();
    }
  };

  return (
    <TileContainer
      type={type}
      onClick={handleInteraction}
      isInteractive={isInteractive}
      onMouseEnter={() => onSelect && onSelect(fieldData)}
      onMouseLeave={() => onSelect && onSelect(null)}
    >
      {type === 'dirt' && !fieldData && (
        <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9em' }}>
          + Plant
        </span>
      )}

      {fieldData && (
        <>
          <Plant
            seedId={fieldData.seedId}
            plantedAt={fieldData.plantedAt}
            growTime={seeds.find(seed => seed.id === fieldData.seedId)?.growTime}
            seeds={seeds}
          />
          {fieldData.waterLevel < 100 && (
            <WaterLevel style={{ height: `${fieldData.waterLevel}%` }} />
          )}
        </>
      )}
    </TileContainer>
  );
};

export default Field;