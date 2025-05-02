import React, { useState } from 'react';
import SeedList from './components/SeedList';
import Farm from './components/Farm';
import HarvestedDisplay from './components/HarvestedDisplay';
import Leaderboard from './components/Leaderboard';
import SeedShop from './components/SeedShop';
import Shop from './components/Shop';
import Player from './components/Player';
import Button from './components/Button';
import ResourceDisplay from './components/ResourceDisplay'; // Import ResourceDisplay


import './App.css';

const App = () => {
  const [seeds, setSeeds] = useState([
    { id: 1, name: 'Tomato', growTime: 5000 },
    { id: 2, name: 'Corn', growTime: 8000 },
    // ... your seed data
  ]);
  const [plantedFields, setPlantedFields] = useState(Array(9).fill(null)); // Example 3x3 farm
  const [inventory, setInventory] = useState({});
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [isPlanting, setIsPlanting] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [harvestedPlants, setHarvestedPlants] = useState([]);
  const [resources, setResources] = useState({
    money: 100,
    wood: 20,
    // ... other resources
  });

  const handlePlantButtonClick = (fieldIndex) => {
    setIsPlanting(true);
    setSelectedFieldIndex(fieldIndex);
  };

  const handleSeedSelect = (seed) => {
    setSelectedSeed(seed);
  };

  const handlePlantConfirm = () => {
    if (isPlanting && selectedSeed !== null && selectedFieldIndex !== null && !plantedFields[selectedFieldIndex]) {
      const newPlantedFields = [...plantedFields];
      newPlantedFields[selectedFieldIndex] = {
        seedId: selectedSeed.id,
        plantedAt: Date.now(),
        growTime: selectedSeed.growTime,
      };
      setPlantedFields(newPlantedFields);
      setSeeds(prevSeeds => prevSeeds.filter(s => s.id !== selectedSeed.id)); // Remove planted seed
      setIsPlanting(false);
      setSelectedSeed(null);
      setSelectedFieldIndex(null);
    } else if (plantedFields[selectedFieldIndex]) {
      alert("This field is already planted.");
    } else if (!selectedSeed) {
      alert("Please select a seed to plant.");
    }
  };

  const handleCancelPlanting = () => {
    setIsPlanting(false);
    setSelectedSeed(null);
    setSelectedFieldIndex(null);
  };

  const handleHarvest = (fieldIndex) => {
    const fieldData = plantedFields[fieldIndex];
    if (fieldData && Date.now() - fieldData.plantedAt > fieldData.growTime) {
      const harvestedSeed = seeds.find(s => s.id === fieldData.seedId);
      if (harvestedSeed) {
        setInventory(prevInventory => ({
          ...prevInventory,
          [harvestedSeed.name]: (prevInventory[harvestedSeed.name] || 0) + 1,
        }));
        setHarvestedPlants(prevHarvested => [...prevHarvested, harvestedSeed]);
        const newPlantedFields = [...plantedFields];
        newPlantedFields[fieldIndex] = null;
        setPlantedFields(newPlantedFields);
      }
    } else if (fieldData) {
      alert("This plant is not ready to harvest yet.");
    }
  };

  const handleBuySeed = (seedToBuy) => {
    setSeeds(prevSeeds => [...prevSeeds, seedToBuy]);
  };

  return (
    <div className="App">
      <h1>Farm Game</h1>
      <Player inventory={inventory} />
      <SeedShop onBuySeed={handleBuySeed} />
      <Shop />
      <Leaderboard />
      <Farm
        plantedFields={plantedFields}
        onPlant={handlePlantButtonClick}
        onHarvest={handleHarvest}
        inventory={inventory}
        seeds={seeds} 
      />
      <HarvestedDisplay harvestedPlants={harvestedPlants} />

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
          {isPlanting ? 'Cancel Planting' : 'Plant'}
        </Button>
        {/* Delete logic can be implemented here or within the Farm/Field components */}
        <Button onClick={() => { /* Implement delete plant logic */ }} variant="danger">
          Delete Plant
        </Button>
        <ResourceDisplay resources={resources} />
      </div>
    </div>
  );
};

export default App;