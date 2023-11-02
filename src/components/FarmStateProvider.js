import React, { createContext, useEffect } from "react";

const FarmStateContext = createContext();

const FarmStateProvider = ({ children }) => {
  const [harvestedPlants, setHarvestedPlants] = React.useState([]);

  // Define the FarmStateContext context object.
  const context = {
    harvestedPlants,
    setHarvestedPlants,
  };

  // Added a useEffect hook to initialize the harvestedPlants state variable to an empty array if it is undefined.
  useEffect(() => {
    if (!harvestedPlants) {
      setHarvestedPlants([]);
    }
  }, [harvestedPlants]);

  return (
    <FarmStateContext.Provider value={context}>
      {children}
    </FarmStateContext.Provider>
  );
};

export { FarmStateContext };
export default FarmStateProvider;
