import React, { useContext } from "react";
import FarmStateContext from "./FarmStateContext";
export { FarmStateContext };


const FarmStateProvider = ({ children }) => {
  const [harvestedPlants, setHarvestedPlants] = React.useState([]);

  return (
    <FarmStateContext.Provider value={{ harvestedPlants, setHarvestedPlants }}>
      {children}
    </FarmStateContext.Provider>
  );
};

export default FarmStateProvider;
