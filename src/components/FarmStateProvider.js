import React, { createContext, useState } from "react";

export const FarmStateContext = createContext();

 const FarmStateProvider = ({ children }) => {
  const [seeds, setSeeds] = useState([
    { name: "Wheat", stage: 0 },
    { name: "Corn", stage: 0 },
    { name: "Carrot", stage: 0 },
  ]);

  const [water, setWater] = useState(100);

  const [harvestedPlants, setHarvestedPlants] = useState([]);

  const plantSeed = (fieldIndex) => {
    // Check if the field is empty.
    if (!seeds[fieldIndex]) {
      return;
    }

    // Plant the seed.
    setSeeds((prevSeeds) => {
      const newSeeds = [...prevSeeds];
      newSeeds[fieldIndex].stage = 1;
      return newSeeds;
    });
  };

  const waterPlant = (fieldIndex) => {
    // Check if the field is empty.
    if (!seeds[fieldIndex]) {
      return;
    }

    // Water the plant.
    setSeeds((prevSeeds) => {
      const newSeeds = [...prevSeeds];
      newSeeds[fieldIndex].stage++;
      return newSeeds;
    });
  };

  const harvestPlant = (fieldIndex) => {
    // Check if the plant is fully grown.
    if (seeds[fieldIndex].stage < 3) {
      return;
    }

    // Harvest the plant.
    setSeeds((prevSeeds) => {
      const newSeeds = [...prevSeeds];
      newSeeds[fieldIndex] = null;
      return newSeeds;
    });

    // Add the harvested plant to the harvested plants array.
    setHarvestedPlants((prevHarvestedPlants) => {
      const newHarvestedPlants = [...prevHarvestedPlants];
      newHarvestedPlants.push(seeds[fieldIndex]);
      return newHarvestedPlants;
    });
  };

  return (
    <FarmStateContext.Provider
      value={{
        seeds,
        setSeeds,
        water,
        setWater,
        harvestedPlants,
        setHarvestedPlants,
        plantSeed,
        waterPlant,
        harvestPlant,
      }}
    >
      {children}
    </FarmStateContext.Provider>
  );
};
export default FarmStateProvider;