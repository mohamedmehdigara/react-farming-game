import React, { useContext } from 'react';
import { FarmStateContext } from './FarmStateProvider';

const HarvestedDisplay = () => {
  const { harvestedPlants } = useContext(FarmStateContext);

  const displayHarvestedPlants = () => {
    if (harvestedPlants.length === 0) {
      return <p>No plants have been harvested yet.</p>;
    }

    const plantTypeGroups = harvestedPlants.reduce((acc, plant) => {
      const plantType = plant.type; // Assuming a "type" property on plants
      acc[plantType] = (acc[plantType] || 0) + 1; // Group by type and count
      return acc;
    }, {});

    const hasMultipleTypes = Object.keys(plantTypeGroups).length > 1;

    return (
      <ul>
        {hasMultipleTypes
          ? Object.entries(plantTypeGroups).map(([plantType, count]) => (
              <li key={plantType}>
                {count}x {plantType}
              </li>
            ))
          : harvestedPlants.map((plant) => (
              <li key={plant.name}>{plant.name}</li>
            ))}
      </ul>
    );
  };

  return (
    <div>
      <h2>Harvested Plants ({harvestedPlants.length.toLocaleString()})</h2>
      {displayHarvestedPlants()}
    </div>
  );
};

export default HarvestedDisplay;
