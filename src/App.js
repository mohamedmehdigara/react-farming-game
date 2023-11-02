import React, { useState, useContext } from "react";
import FarmStateProvider,{FarmStateContext}  from "./components/FarmStateProvider";
import SeedList from "./components/SeedList";
import Field from "./components/Field";
import Farm from "./components/Farm";
import HarvestedDisplay from "./components/HarvestedDisplay";
import PlantDialog from "./components/PlantDialog";
import Leaderboard from "./components/Leaderboard";
import SeedShop from "./components/SeedShop";

import "./App.css";

const App = () => {
  // Define the plantDialogOpen, closePlantDialog, and openPlantDialog variables.
  const [plantDialogOpen, setPlantDialogOpen] = useState(false);
  const { harvestedPlants } = useContext(FarmStateContext);


  // Define the openPlantDialog function.
  const openPlantDialog = () => {
    setPlantDialogOpen(true);
  };

  // Define the closePlantDialog function.
  const closePlantDialog = () => {
    setPlantDialogOpen(false);
  };

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
      </FarmStateProvider>

      <button onClick={openPlantDialog}>Plant a seed</button>
    </div>
  );
};

export default App;
