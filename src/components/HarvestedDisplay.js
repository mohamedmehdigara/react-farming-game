import React, { useContext } from "react";
import { FarmStateContext } from "./FarmStateProvider";

const HarvestedDisplay = () => {
  const farmState = useContext(FarmStateContext);

  const harvestedPlants = farmState.harvestedPlants;

  // Add a total harvested plants count.
  const totalHarvestedPlants = harvestedPlants.length;

  // Add a check if there are any harvested plants. If not, display a message instead of an empty list.
  const harvestedPlantsList = harvestedPlants.length > 0 ? (
    <ul>
      {harvestedPlants.map((plant) => (
        <li key={plant.name}>{plant.name}</li>
      ))}
    </ul>
  ) : (
    <p>No plants have been harvested yet.</p>
  );

  return (
    <div>
      <h2>Harvested Plants ({totalHarvestedPlants})</h2>
      {harvestedPlantsList}
    </div>
  );
};

export default HarvestedDisplay;
