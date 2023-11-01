import React, { useContext } from "react";
import { FarmStateContext } from "./FarmStateProvider";

const HarvestedDisplay = () => {
  const farmState = useContext(FarmStateContext);

  const harvestedPlants = farmState.harvestedPlants;

  return (
    <div>
      <h2>Harvested Plants</h2>
      <ul>
        {harvestedPlants.map((plant) => (
          <li key={plant.name}>{plant.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HarvestedDisplay;
