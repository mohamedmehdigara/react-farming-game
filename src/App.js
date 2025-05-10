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
import WeatherDisplay from './components/WeatherDisplay';
import TimeDisplay from './components/TimeDisplay';
import QuestLog from './components/QuestLog';
import Building from './components/Building';
import CraftingMenu from './components/CraftingMenu';

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
  const [quests, setQuests] = useState([
    { id: 1, title: 'First Harvest', description: 'Harvest 5 Tomatoes.', reward: '10 Coins', status: 'in progress' },
    { id: 2, title: 'Plant Corn', description: 'Plant 3 Corn seeds.', status: 'in progress' },
    { id: 3, title: 'Water Crops', description: 'Water your plants 3 times.', reward: '5 Coins', status: 'completed' },
    { id: 4, title: 'Expand Farm', description: 'Expand your farm by one tile.', status: 'in progress' },
    // ... more quests
  ]);
  // In App.js (example)

  const [buildings, setBuildings] = useState([
    { type: 'Barn', x: 1, y: 1, width: 150, height: 100 },
    { type: 'Coop', x: 4, y: 3 },
    // ... more buildings
  ]);

  // In App.js (example)
const [animals, setAnimals] = useState([
  { type: 'chicken', x: 2, y: 5 },
  { type: 'cow', x: 6, y: 2, size: '80px', color: '#d3d3d3' },
  // ... more animals
]);

const [recipes] = useState([
  {
    id: 301,
    name: 'Wooden Fence',
    ingredients: [{ item: 'wood', quantity: 3 }],
    result: { item: 'wooden_fence', quantity: 1 },
  },
  {
    id: 302,
    name: 'Basic Fertilizer',
    ingredients: [{ item: 'plant_fiber', quantity: 2 }],
    result: { item: 'basic_fertilizer', quantity: 1 },
  },
  // ... more recipes
]);

const [selectedQuest, setSelectedQuest] = useState(null);
const [isQuestDetailOpen, setIsQuestDetailOpen] = useState(false);


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

  const handleQuestComplete = (questId) => {
    setQuests(prevQuests =>
      prevQuests.map(quest =>
        quest.id === questId ? { ...quest, status: 'completed' } : quest
      )
    );
    alert(`Quest "${quests.find(q => q.id === questId)?.title}" completed!`);
    // Implement reward logic here (e.g., update player resources)
  };

  const handleBuildingClick = (building) => {
    alert(`Clicked on ${building.type} at (${building.x}, ${building.y})`);
    // Implement specific actions based on the building type
  };

  // Animal Interaction Logic (Example - you'll expand this)
  const handleAnimalInteract = (animalData) => {
    alert(`Interacted with ${animalData.type} at (${animalData.x}, ${animalData.y})`);
    // Implement actions like feeding, collecting resources
  };

  const handleCraft = (recipeId) => {
    const selectedRecipe = recipes.find(recipe => recipe.id === recipeId);
    if (selectedRecipe) {
      const canCraft = selectedRecipe.ingredients.every(
        (ingredient) => inventory[ingredient.item] >= ingredient.quantity
      );
  
      if (canCraft) {
        // Deduct ingredients from inventory
        const newInventory = { ...inventory };
        selectedRecipe.ingredients.forEach((ingredient) => {
          newInventory[ingredient.item] -= ingredient.quantity;
          if (newInventory[ingredient.item] === 0) {
            delete newInventory[ingredient.item];
          }
        });
        setInventory(newInventory);
  
        // Add result to inventory
        setInventory(prevInventory => ({
          ...prevInventory,
          [selectedRecipe.result.item]: (prevInventory[selectedRecipe.result.item] || 0) + selectedRecipe.result.quantity,
        }));
  
        alert(`Crafted ${selectedRecipe.result.quantity} ${selectedRecipe.result.item}!`);
      } else {
        alert(`Not enough resources to craft ${selectedRecipe.name}.`);
      }
    }
  };

const openQuestDetail = (questId) => {
  const questToView = quests.find(q => q.id === questId);
  setSelectedQuest(questToView);
  setIsQuestDetailOpen(true);
};

const closeQuestDetail = () => {
  setSelectedQuest(null);
  setIsQuestDetailOpen(false);
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
        buildings={buildings}
        animals={animals}
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
        <WeatherDisplay /> {/* Add the WeatherDisplay component */}
        <TimeDisplay /> {/* Add the TimeDisplay component */}
        <QuestLog quests={quests} onQuestComplete={handleQuestComplete} onOpenQuestDetail={openQuestDetail} />
        {buildings &&
          buildings.map(building => (
            <Building
              key={building.type + building.x + building.y}
              type={building.type}
              x={building.x}
              y={building.y}
              width={building.width}
              height={building.height}
              onClick={() => console.log(`Clicked on ${building.type} at ${building.x}, ${building.y}`)}
            />
          ))}

            <CraftingMenu inventory={inventory} recipes={recipes} onCraft={handleCraft} />



      </div>
    </div>
  );
};

export default App;