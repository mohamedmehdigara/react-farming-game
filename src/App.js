import React from 'react';
import { FarmStateContext } from './components/FarmStateProvider'; // Import the context itself
import SeedList from './components/SeedList';
import Farm from './components/Farm';
import HarvestedDisplay from './components/HarvestedDisplay';
import Leaderboard from './components/Leaderboard';
import SeedShop from './components/SeedShop';
import Shop from './components/Shop';
import Player from './components/Player';
import FarmStateProvider from './components/FarmStateProvider'; // Only import the provider once
import Button from './components/Button';

import './App.css';

const App = () => {
  // Access values and functions from the FarmStateContext
  const { seeds, plantSeed, plantedSeeds, selectedSeed, setSelectedSeed, removePlantedSeed } = React.useContext(FarmStateContext);
  const [isPlanting, setIsPlanting] = React.useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = React.useState(null);

  const handlePlantButtonClick = (fieldIndex) => {
    setIsPlanting(true);
    setSelectedFieldIndex(fieldIndex); // Remember which field was clicked
  };

  const handleSeedSelect = (seed) => {
    setSelectedSeed(seed); // Update the selected seed in the context
  };

  const handlePlantConfirm = () => {
    if (isPlanting && selectedSeed !== null && selectedFieldIndex !== null) {
      plantSeed(selectedFieldIndex, selectedSeed); // Plant the selected seed in the chosen field
      setIsPlanting(false);
      setSelectedSeed(null);
      setSelectedFieldIndex(null);
    } else if (!seeds || seeds.length === 0) {
      alert("No seeds available to plant!");
    } else if (!isPlanting) {
      alert("Please select a field to plant in first.");
    } else if (selectedSeed === null) {
      alert("Please select a seed to plant.");
    }
  };

  const handleCancelPlanting = () => {
    setIsPlanting(false);
    setSelectedSeed(null);
    setSelectedFieldIndex(null);
  };

  const handleDeletePlant = (fieldIndexToRemove) => {
    // Call a function from the context to remove a planted seed
    if (fieldIndexToRemove !== null && window.confirm("Are you sure you want to remove the plant from this field?")) {
      removePlantedSeed(fieldIndexToRemove);
    } else {
      alert("Please select a field to remove a plant from (this functionality might be moved to the Farm component).");
      // You might want to visually indicate which field is being considered for deletion
      // or move this button/logic to the Farm component itself, perhaps on each Field.
    }
  };

  return (
    <div className="App">
      <h1>Farm Game</h1>
      <FarmStateContext.Provider>
        <Player />
        <SeedShop />
        <Shop />
        <Leaderboard />
        <Farm onPlant={handlePlantButtonClick} seeds={seeds} plantedSeeds={plantedSeeds} onDelete={handleDeletePlant} />
        <HarvestedDisplay />

        {isPlanting && (
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <h2>Select a Seed to Plant</h2>
            <SeedList seeds={seeds} onSelect={handleSeedSelect} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <Button onClick={handlePlantConfirm} variant="primary" disabled={selectedSeed === null}>
                Plant Seed
              </Button>
              <Button onClick={handleCancelPlanting} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <Button onClick={() => setIsPlanting(!isPlanting)} variant="primary">
            {isPlanting ? 'Cancel Planting' : 'Plant'} {/* This button now toggles the planting dialog */}
          </Button>
          <Button onClick={() => handleDeletePlant(selectedFieldIndex)} variant="danger">
            Delete Plant
          </Button>
        </div>
      </FarmStateContext.Provider>
    </div>
  );
};

export default App;