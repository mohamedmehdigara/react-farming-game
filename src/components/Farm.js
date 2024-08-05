import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Field from './Field';
import Plant from './Plant';
import Button from './Button';
import { FarmStateContext } from './FarmStateProvider';
import InventoryDisplay from './InventoryDisplay'; // Import InventoryDisplay component

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
  grid-template-columns: repeat(5, 1fr);
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
  } = useContext(FarmStateContext); // Retrieve state from context

  // useEffect for initial state or loading saved game (if implemented)

  const handlePlantSeed = (fieldIndex) => {
    // Check if field is empty and seed is available
    if (plantedFields[fieldIndex] === null && seeds.length > 0) {
      setPlantedFields((prevFields) => {
        const newFields = [...prevFields];
        newFields[fieldIndex] = { seedId: seeds[0].id, plantedAt: Date.now() };
        return newFields;
      });

      // Update seeds inventory (if applicable)
      plantSeed(fieldIndex); // Call the provided plantSeed function
    }
  };

  const handleHarvest = (fieldIndex) => {
    const fieldData = plantedFields[fieldIndex];
    if (fieldData && isPlantMature(fieldData)) {
      harvestPlant(fieldIndex); // Call provided harvestPlant function with field index
    }
  };

  const isPlantMature = (fieldData) => {
    return Date.now() - fieldData.plantedAt >= growTime; // Check if plant reached maturity based on growTime
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
          >
            {fieldData && <Plant seedId={fieldData.seedId} growthStage={calculateGrowthStage(fieldData.plantedAt)} />}
          </Field>
        ))}
      </FarmGrid>
      <InventoryDisplay /> {/* Add InventoryDisplay component */}
     

    </Farm>
  );
};

export default MyFarm;
