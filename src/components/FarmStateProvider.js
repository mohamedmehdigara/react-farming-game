import React, { createContext, useState } from 'react';

export const FarmStateContext = createContext();

const FarmStateProvider = ({ children }) => {
  const [seeds, setSeeds] = useState([]); // Example state
  const [plantedSeeds, setPlantedSeeds] = useState({}); // Example state
  const [selectedSeed, setSelectedSeed] = useState(null); // Example state

  const plantSeed = (fieldIndex, seed) => {
    // Example function
    setPlantedSeeds(prev => ({ ...prev, [fieldIndex]: seed }));
    setSeeds(prev => prev.filter(s => s.name !== seed.name)); // Example logic
  };

  const value = {
    seeds,
    setSeeds,
    plantedSeeds,
    setPlantedSeeds,
    plantSeed,
    selectedSeed,
    setSelectedSeed,
    // ... other context values and functions
  };

  return (
    <FarmStateContext.Provider value={value}>
      {children}
    </FarmStateContext.Provider>
  );
};

export default FarmStateProvider;