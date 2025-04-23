import React from 'react';
import styled from 'styled-components';
import Field from './Field';
import Plant from './Plant';
import InventoryDisplay from './InventoryDisplay';

const Farm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  width: 100%;
  max-width: 500px;
  margin: 20px auto;
`;

const MyFarm = ({ plantedFields, onPlant, onHarvest, inventory, seeds }) => {
  return (
    <div>
      <h2>My Farm</h2>
      <InventoryDisplay inventory={inventory} />
      <Farm>
        {plantedFields &&
          plantedFields.map((fieldData, index) => (
            <Field
              key={index}
              fieldIndex={index}
              isPlanted={fieldData !== null}
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
            </Field>
          ))}
      </Farm>
    </div>
  );
};

export default MyFarm;