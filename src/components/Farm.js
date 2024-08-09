import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Field from './Field';
import Plant from './Plant';
import Button from './Button';
import { FarmStateContext } from './FarmStateProvider';
import InventoryDisplay from './InventoryDisplay';

const Farm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  gap: 20px;
`;

const FarmGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
`;

const MyFarm = () => {
  const {
    plantedFields,
    setPlantedFields,
    seeds,
    inventory,
    plantSeed,
    harvestPlant,
    growTime,
  } = useContext(FarmStateContext);

  // ... other logic

  const handleFieldResize = (fieldIndex, newSize) => {
    // Update field size in plantedFields state
    setPlantedFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[fieldIndex] = { ...newFields[fieldIndex], size: newSize };
      return newFields;
    });
  };


  const handlePlantSeed = (fieldIndex) => {
    // ...
  };

  const handleHarvest = (fieldIndex) => {
    // ...
  };

  const calculateGrowthStage = (plantedAt) => {
    // Logic to calculate growth stage based on plantedAt and growTime
  };

  return (
    <Farm>
      <h1>My Farm</h1>
      <FarmGrid>
        {plantedFields&&plantedFields.map((fieldData, index) => (
          <Field
            key={index}
            fieldIndex={index}
            isPlanted={fieldData !== null}
            onClick={() => (fieldData ? handleHarvest(index) : handlePlantSeed(index))}
            size={fieldData?.size || 1} // Default size is 1
            onResize={handleFieldResize}
          >
            {fieldData && <Plant seedId={fieldData.seedId} growthStage={calculateGrowthStage(fieldData.plantedAt)} />}
          </Field>
        ))}
      </FarmGrid>
      {/* ... */}
    </Farm>
  );
};

export default MyFarm;
