import React, { useEffect } from 'react';
import styled from 'styled-components';
import Tile from './Tile';
import Plant from './Plant';
import Building from './Building';
import Animal from './Animal';
import Player from './Player';

const FarmContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${props => props.gridSize}, minmax(80px, 1fr));
  grid-template-rows: repeat(${props => props.gridSize}, minmax(80px, 1fr));
  width: 90vmin; /* Responsive width */
  height: 90vmin; /* Responsive height */
  max-width: 800px;
  max-height: 800px;
  border: 2px solid #228B22;
  margin: 20px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  ${props => {
    switch (props.season) {
      case 'spring':
        return `background-color: #7CFC00;`;
      case 'summer':
        return `background-color: #B2FF66;`;
      case 'fall':
        return `background-color: #A0522D;`;
      case 'winter':
        return `background-color: #F0F8FF;`;
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
  onMovePlayer,
  gridSize = 3,
  season,
  onOpenBuildingPanel,
  onOpenAnimalPanel,
}) => {
  // useEffect hook to handle player movement via keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      let newX = playerPos.x;
      let newY = playerPos.y;

      switch (e.key) {
        case 'ArrowUp':
          newY = Math.max(0, playerPos.y - 1);
          break;
        case 'ArrowDown':
          newY = Math.min(gridSize - 1, playerPos.y + 1);
          break;
        case 'ArrowLeft':
          newX = Math.max(0, playerPos.x - 1);
          break;
        case 'ArrowRight':
          newX = Math.min(gridSize - 1, playerPos.x + 1);
          break;
        default:
          return;
      }
      onMovePlayer({ x: newX, y: newY });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, gridSize, onMovePlayer]);

  const handleTileClick = (index) => {
    const fieldData = plantedFields[index];
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);

    const isBuilding = buildings.some(b => b.x === x && b.y === y);
    const isAnimal = animals.some(a => a.x === x && a.y === y);

    if (isBuilding) {
      const building = buildings.find(b => b.x === x && b.y === y);
      onOpenBuildingPanel(building);
    } else if (isAnimal) {
      const animal = animals.find(a => a.x === x && a.y === y);
      onOpenAnimalPanel(animal);
    } else if (fieldData) {
      onHarvest(index);
    } else {
      onPlant(index);
    }
  };

  return (
    <FarmContainer gridSize={gridSize} season={season}>
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const fieldData = plantedFields[index];
        const isPlanted = !!fieldData;

        return (
          <Tile
            key={index}
            onClick={() => handleTileClick(index)}
            type={isPlanted ? 'planted' : 'dirt'}
          >
            {isPlanted && (
              <Plant
                seedId={fieldData.seedId}
                plantedAt={fieldData.plantedAt}
                growTime={seeds.find(seed => seed.id === fieldData.seedId)?.growTime}
                seeds={seeds}
              />
            )}
          </Tile>
        );
      })}

      {buildings.map(building => (
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

      {animals.map(animal => (
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
        <Player x={playerPos.x} y={playerPos.y} />
      )}
    </FarmContainer>
  );
};

export default Farm;