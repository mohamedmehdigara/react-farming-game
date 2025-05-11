import React from 'react';
import styled from 'styled-components';
import Tile from './Tile'; // Import the Tile component
import Plant from './Plant';
import InventoryDisplay from './InventoryDisplay';
import Animal from './Animal';
import Building from './Building';

const Farm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
`;



const MyFarm = ({ plantedFields, onPlant, onHarvest, inventory, seeds, buildings, animals }) => {
  return (
    <div>
      <h2>My Farm</h2>
      <InventoryDisplay inventory={inventory} />
      <Farm>
        {plantedFields &&
          plantedFields.map((fieldData, index) => (
            <Tile
              key={index}
              type={fieldData ? 'planted' : 'dirt'}
              onClick={() => (fieldData ? onHarvest(index) : onPlant(index))}
            >
              {fieldData && (
                <Plant
                  seedId={fieldData.seedId}
                  plantedAt={fieldData.plantedAt}
                  growTime={
                    seeds.find((seed) => seed.id === fieldData.seedId)?.growTime
                  }
                />
              )}
            </Tile>
          ))}

{animals &&
          animals.map(animal => (
            <Animal
              key={`<span class="math-inline">\{animal\.type\}\-</span>{animal.x}-${animal.y}`}
              type={animal.type}
              x={animal.x}
              y={animal.y}
              size={animal.size}
              color={animal.color}
              onInteract={(animalData) => console.log(`Interacted with ${animalData.type} at ${animalData.x}, ${animalData.y}`)}
            />
          ))}

          {buildings &&
  buildings.map(building => (
    <Building
      key={`<span class="math-inline">\{building\.type\}\-</span>{building.x}-${building.y}`}
      type={building.type}
      x={building.x}
      y={building.y}
      width={building.width}
      height={building.height}
    />
  ))}

  {animals &&
  animals.map(animal => (
    <Animal
      key={`<span class="math-inline">\{animal\.type\}\-</span>{animal.x}-${animal.y}`}
      type={animal.type}
      x={animal.x}
      y={animal.y}
      size={animal.size}
      color={animal.color}
    />
  ))}
      </Farm>
    </div>
  );
};

export default MyFarm;