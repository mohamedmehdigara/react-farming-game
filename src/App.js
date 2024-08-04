import React, { useState, useContext, useEffect } from "react";
import FarmStateProvider from "./components/FarmStateProvider";
import SeedList from "./components/SeedList";
import Field from "./components/Field";
import Farm from "./components/Farm";
import HarvestedDisplay from "./components/HarvestedDisplay";
import PlantDialog from "./components/PlantDialog";
import Leaderboard from "./components/Leaderboard";
import SeedShop from "./components/SeedShop";
import FarmStateContext from "./components/FarmStateContext";

import "./App.css";

const App = () => {
  // Define the plantDialogOpen, closePlantDialog, and openPlantDialog variables.
  const [plantDialogOpen, setPlantDialogOpen] = useState(false);
// App.js
const context = useContext(FarmStateContext);
const harvestedPlants = context && context.harvestedPlants ? context.harvestedPlants : [];

  // Define the openPlantDialog function.
  const openPlantDialog = () => {
    setPlantDialogOpen(true);
  };

  // Define the closePlantDialog function.
  const closePlantDialog = () => {
    setPlantDialogOpen(false);
  };

  // Use a useEffect hook to ensure that the App component is not rendered until the FarmStateProvider component has been initialized.
  useEffect(() => {}, []);

  return (
    <div className="App">
      <h1>Farm Game</h1>
      <FarmStateProvider>
        <SeedShop />
        <SeedList />
        <Field />
        <Farm />
        <HarvestedDisplay harvestedPlants={harvestedPlants} />
        <Leaderboard />
        <PlantDialog open={plantDialogOpen} onClose={closePlantDialog} />
        <SeedShop />

      </FarmStateProvider>

      <button onClick={openPlantDialog}>Plant a seed</button>
    </div>
  );
};

export default App;