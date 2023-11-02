import React, { createContext } from "react";

const FarmStateContext = createContext({
  harvestedPlants: [],
  setHarvestedPlants: () => {},
});

export default FarmStateContext;
