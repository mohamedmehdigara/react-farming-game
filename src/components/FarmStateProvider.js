import React, { createContext, useState } from "react";

export const FarmStateContext = createContext();

const FarmStateProvider = ({ children }) => {
  // Added a `maxSeeds` prop to limit the number of seeds that can be planted.
  const maxSeeds = 10;

  const [seeds, setSeeds] = useState([
    { name: "Wheat", stage: 0 },
    { name: "Corn", stage: 0 },
    { name: "Carrot", stage: 0 },
  ]);

  const [water, setWater] = useState();
  const [harvestedPlants, setHarvestedPlants] = useState([]);

  // Updated the `plantSeed()` function to check if the number of seeds is already at the maximum.
  const plantSeed = (fieldIndex) => {
    if (seeds[fieldIndex] || seeds.length === maxSeeds) {
      return;
    }

    // Plant the seed.
    setSeeds((prevSeeds) => {
      const newSeeds = [...prevSeeds];
      newSeeds[fieldIndex] = { name: "Wheat", stage: 1 };
      return newSeeds;
    });
  };

  // Added a `waterPlantAll()` function to water all of the plants at once.
  const waterPlantAll = () => {
    setSeeds((prevSeeds) => {
      const newSeeds = [...prevSeeds];
      for (let i = 0; i < newSeeds.length; i++) {
        if (newSeeds[i] && newSeeds[i].stage < 3) {
          newSeeds[i].stage++;
        }
      }
      return newSeeds;
    });
  };

  // Added a `harvestAllPlants()` function to harvest all of the fully grown plants at once.
  const harvestAllPlants = () => {
    setSeeds((prevSeeds) => {
      const newSeeds = [...prevSeeds];
      for (let i = 0; i < newSeeds.length; i++) {
        if (newSeeds[i] && newSeeds[i].stage === 3) {
          newSeeds[i] = null;
        }
      }
      return newSeeds;
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
        waterPlantAll,
        harvestAllPlants,
      }}
    >
      {children}
    </FarmStateContext.Provider>
  );
};

export default FarmStateProvider;
