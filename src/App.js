import React, { useState, useContext } from 'react';
import { FarmStateContext } from './components/FarmStateProvider';
import SeedList from './components/SeedList';
import Farm from './components/Farm';
import HarvestedDisplay from './components/HarvestedDisplay';
import PlantDialog from './components/PlantDialog';
import Leaderboard from './components/Leaderboard';
import SeedShop from './components/SeedShop';
import Shop from './components/Shop';
import Player from './components/Player';
import FarmStateProvider from './components/FarmStateProvider';

import './App.css';

const App = () => {
  const [plantDialogOpen, setPlantDialogOpen] = useState(false);
  const context = useContext(FarmStateContext);

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
        <SeedShop seeds={context.seeds} buySeed={context.buySeed} />
        <SeedList seeds={context.seeds} onSeedSelect={context.onSeedSelect} />
        <Farm />
        <HarvestedDisplay harvestedPlants={context.harvestedPlants} />
        <Leaderboard leaderboardData={context.leaderboardData} />
        <Shop items={context.items} playerInventory={context.inventory} buyItem={context.buyItem} />
        <Player playerData={context.playerData} inventory={context.inventory} />
        <PlantDialog open={plantDialogOpen} onClose={closePlantDialog} />
      </FarmStateProvider>
    </div>
  );
};

export default App;
