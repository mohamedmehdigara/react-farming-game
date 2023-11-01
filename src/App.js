import React, { createContext, useState } from "react";
import FarmStateProvider from "./components/FarmStateProvider";
import SeedList from "./components/SeedList";
import Field from "./components/Field";
import Farm from "./components/Farm";
import HarvestedDisplay from "./components/HarvestedDisplay";
import PlantDialog from "./components/PlantDialog";
import Leaderboard from "./components/Leaderboard";

import "./App.css";

const App = () => {
  const [plantDialogOpen, setPlantDialogOpen] = useState(false);

  const openPlantDialog = () => {
    setPlantDialogOpen(true);
  };

  const closePlantDialog = () => {
    setPlantDialogOpen(false);
  };

  return (
    <div className="App">
      <h1>Farm Game</h1>
      <FarmStateProvider>
        <SeedList />
        <Field />
        <Farm />
        <HarvestedDisplay />
        <Leaderboard />
        <PlantDialog open={plantDialogOpen} onClose={closePlantDialog} />
      </FarmStateProvider>

      <button onClick={openPlantDialog}>Plant a seed</button>
    </div>
  );
};

export default App;
