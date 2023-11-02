import React, { createContext } from "react";

const FarmStateContext = createContext();

const FarmStateProvider = ({ children }) => {
  const [harvestedPlants, setHarvestedPlants] = React.useState([]);

  // Define the FarmStateContext context object.
  const context = {
    harvestedPlants: harvestedPlants || [],
    setHarvestedPlants,
  };

  return (
    <FarmStateContext.Provider value={context}>
      {children}
    </FarmStateContext.Provider>
  );
};

export { FarmStateContext };
export default FarmStateProvider;
