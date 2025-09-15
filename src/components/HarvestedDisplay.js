import React from 'react';
import styled from 'styled-components';

// Styled Components
const DisplayContainer = styled.div`
  background-color: #e0f2f1; /* A light, calming green-blue */
  border: 1px solid #004d40; /* Dark teal border */
  border-radius: 8px;
  padding: 15px;
  margin: 10px;
  width: 250px;
  font-family: 'Arial', sans-serif;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DisplayTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #004d40;
  text-align: center;
`;

const HarvestedList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const HarvestedItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #b2dfdb;
  font-size: 1em;
  color: #333;

  &:last-child {
    border-bottom: none;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #777;
  font-style: italic;
`;

// Helper function to get an emoji for the plant type
const getPlantEmoji = (plantName) => {
  switch (plantName.toLowerCase()) {
    case 'tomato':
      return '🍅';
    case 'corn':
      return '🌽';
    case 'pumpkin':
      return '🎃';
    case 'potato':
      return '🥔';
    default:
      return '🌿';
  }
};

const HarvestedDisplay = ({ harvestedPlants }) => {
  // Check if the prop exists and is an array
  if (!harvestedPlants || !Array.isArray(harvestedPlants)) {
    return <p>Error: Harvested plants data is unavailable.</p>;
  }

  // Group and count the harvested plants
  const plantTypeGroups = harvestedPlants.reduce((acc, plant) => {
    const plantName = plant.name;
    acc[plantName] = (acc[plantName] || 0) + 1;
    return acc;
  }, {});

  return (
    <DisplayContainer>
      <DisplayTitle>Harvest Log</DisplayTitle>
      {harvestedPlants.length === 0 ? (
        <EmptyMessage>No plants have been harvested yet.</EmptyMessage>
      ) : (
        <HarvestedList>
          {Object.entries(plantTypeGroups).map(([plantName, count]) => (
            <HarvestedItem key={plantName}>
              <span>{getPlantEmoji(plantName)} {plantName}</span>
              <span>x{count}</span>
            </HarvestedItem>
          ))}
        </HarvestedList>
      )}
    </DisplayContainer>
  );
};

export default HarvestedDisplay;