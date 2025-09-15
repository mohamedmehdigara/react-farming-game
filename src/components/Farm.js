import React from 'react';
import styled from 'styled-components';
import Tile from './Tile';
import Plant from './Plant';
import Building from './Building';
import Animal from './Animal';
import Player from './Player';

const FarmContainer = styled.div`
  position: relative; /* To position child elements absolutely */
  display: grid;
  grid-template-columns: repeat(${props => props.gridSize}, 100px); /* Adjust tile size */
  grid-template-rows: repeat(${props => props.gridSize}, 100px); /* Adjust tile size */
  gap: 5px; /* Spacing between tiles */
  border: 2px solid #228B22; /* Forest green border */
  margin: 20px auto;

  ${props => {
    switch (props.season) {
      case 'spring':
        return `background-color: #7CFC00;`; // Lush green
      case 'summer':
        return `background-color: #B2FF66;`; // Lighter green
      case 'fall':
        return `background-color: #A0522D;`; // Brown
      case 'winter':
        return `background-color: #F0F8FF;`; // White/snowy
      default:
        return `background-color: #7CFC00;`;
    }
  }}
`;

const Farm = ({
  plantedFields,
  onPlant,
  onHarvest,
  seeds,
  buildings,
  animals,
  playerPos,
  playerName,
  gridSize = 3,
  season, // New season prop
  onOpenBuildingPanel, // Prop for opening the building panel
  onOpenAnimalPanel, // Prop for opening the animal panel
}) => {
  return (
    <FarmContainer gridSize={gridSize} season={season}>
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const fieldData = plantedFields[index];
        const isPlanted = !!fieldData;

        return (
          <Tile
            key={index}
            row={row}
            col={col}
            type={isPlanted ? 'planted' : 'dirt'}
            onClick={() => (fieldData ? onHarvest(index) : onPlant(index))}
          >
            {isPlanted && (
              <Plant
                seedId={fieldData.seedId}
                plantedAt={fieldData.plantedAt}
                growTime={
                  seeds.find((seed) => seed.id === fieldData.seedId)?.growTime
                }
                seeds={seeds}
              />
            )}
          </Tile>
        );
      })}

      {buildings &&
        buildings.map(building => (
          <Building
            key={`${building.type}-${building.x}-${building.y}`}
            type={building.type}
            x={building.x}
            y={building.y}
            width={building.width}
            height={building.height}
            onClick={() => onOpenBuildingPanel(building)}
          />
        ))}

      {animals &&
        animals.map(animal => (
          <Animal
            key={`${animal.type}-${animal.x}-${animal.y}`}
            type={animal.type}
            x={animal.x}
            y={animal.y}
            size={animal.size}
            color={animal.color}
            onInteract={() => onOpenAnimalPanel(animal)}
          />
        ))}
        
      {playerPos && (
        <Player x={playerPos.x} y={playerPos.y} name={playerName} />
      )}
    </FarmContainer>
  );
};

export default Farm;