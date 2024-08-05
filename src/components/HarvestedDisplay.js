import React, { useContext } from "react";
import { FarmStateContext } from "./FarmStateProvider";

const HarvestedDisplay = () => {
  const farmState = useContext(FarmStateContext);

  const harvestedPlants = farmState.harvestedPlants;

  // Total harvested plants count with potential formatting
  const totalHarvestedPlants = harvestedPlants.length.toLocaleString(); // Format number for readability

  // Differentiate display based on plant types
  const plantTypeGroups = harvestedPlants.reduce((acc, plant) => {
    const plantType = plant.type; // Assuming a "type" property on plants
    acc[plantType] = (acc[plantType] || 0) + 1; // Group by type and count
    return acc;
  }, {});

  // Display harvested plants with grouping and counts if applicable
  const harvestedPlantsList = Object.keys(plantTypeGroups).length > 1 ? (
    <ul>
      {Object.entries(plantTypeGroups).map(([plantType, count]) => (
        <li key={plantType}>
          {count}x {plantType}
        </li>
      ))}
    </ul>
  ) : (
    harvestedPlants.length > 0 ? ( // If no grouping, use standard list
      <ul>
        {harvestedPlants.map((plant) => (
          <li key={plant.name}>{plant.name}</li>
        ))}
      </ul>
    ) : (
      <p>No plants have been harvested yet.</p>
    )
  );

  return (
    <div>
      <h2>Harvested Plants ({totalHarvestedPlants})</h2>
      {harvestedPlantsList}
    </div>
  );
};

export default HarvestedDisplay;
