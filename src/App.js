import React, { useState, useEffect } from 'react';
import SeedList from './components/SeedList';
import Farm from './components/Farm';
import HarvestedDisplay from './components/HarvestedDisplay';
import Leaderboard from './components/Leaderboard';
import SeedShop from './components/SeedShop';
import Shop from './components/Shop';
import Player from './components/Player';
import Button from './components/Button';
import ResourceDisplay from './components/ResourceDisplay';
import QuestLog from './components/QuestLog';
import Building from './components/Building';
import CraftingMenu from './components/CraftingMenu';
import InventoryDisplay from './components/InventoryDisplay';
import BuildingInteractionPanel from './components/BuildingInteractionPanel';
import AnimalInteractionPanel from './components/AnimalInteractionPanel';
import TimeAndSeasons from './components/TimeAndSeasons';
import SellMenu from './components/SellMenu';

import './App.css';

const App = () => {
  const [seeds, setSeeds] = useState([
    { id: 1, name: 'Tomato', growTime: 5000, seasons: ['summer'] },
    { id: 2, name: 'Corn', growTime: 8000, seasons: ['summer', 'fall'] },
    { id: 3, name: 'Pumpkin', growTime: 10000, seasons: ['fall'] },
    { id: 4, name: 'Potato', growTime: 6000, seasons: ['spring', 'summer'] },
  ]);
  const [plantedFields, setPlantedFields] = useState(Array(9).fill(null));
  const [inventory, setInventory] = useState({});
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [isPlanting, setIsPlanting] = useState(false);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [harvestedPlants, setHarvestedPlants] = useState([]);
  const [resources, setResources] = useState({
    money: 100,
    wood: 20,
  });
  const [quests, setQuests] = useState([
    { id: 1, title: 'First Harvest', description: 'Harvest 5 Tomatoes.', reward: '10 Coins', status: 'in progress', goal: { type: 'harvest', itemId: 1, quantity: 5, current: 0 } },
    { id: 2, title: 'Plant Corn', description: 'Plant 3 Corn seeds.', status: 'in progress', goal: { type: 'plant', itemId: 2, quantity: 3, current: 0 } },
    { id: 3, title: 'Water Crops', description: 'Water your plants 3 times.', reward: '5 Coins', status: 'completed', goal: { type: 'water', quantity: 3, current: 3 } },
    { id: 4, title: 'Expand Farm', description: 'Expand your farm by one tile.', status: 'in progress', goal: { type: 'expandFarm', quantity: 1, current: 0 } },
  ]);
  const [buildings, setBuildings] = useState([
    { type: 'Barn', x: 1, y: 1, width: 150, height: 100 },
    { type: 'Coop', x: 4, y: 3 },
  ]);
  const [animals, setAnimals] = useState([
    { type: 'chicken', x: 2, y: 5 },
    { type: 'cow', x: 6, y: 2, size: '80px', color: '#d3d3d3' },
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
  ]);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [isQuestDetailOpen, setIsQuestDetailOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isBuildingPanelOpen, setIsBuildingPanelOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [isAnimalPanelOpen, setIsAnimalPanelOpen] = useState(false);
  
  // FIX: Initialize playerPos with a default object
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 }); 
  
  const [playerName, setPlayerName] = useState('Farmer Joe');
  const [currentSeason, setCurrentSeason] = useState('spring');
  const [day, setDay] = useState(1);

  useEffect(() => {
    const seasonLength = 10;
    const dayInterval = setInterval(() => {
      setDay(prevDay => {
        const newDay = prevDay + 1;
        if (newDay > seasonLength) {
          const seasons = ['spring', 'summer', 'fall', 'winter'];
          const currentSeasonIndex = seasons.indexOf(currentSeason);
          const nextSeason = seasons[(currentSeasonIndex + 1) % seasons.length];
          setCurrentSeason(nextSeason);

          if (nextSeason === 'spring') {
            setPlantedFields(prevFields =>
              prevFields.map(field => {
                const seedData = seeds.find(s => s.id === field?.seedId);
                if (seedData && !seedData.seasons.includes(currentSeason)) {
                  return null;
                }
                return field;
              })
            );
          }
          return 1;
        }
        return newDay;
      });
    }, 5000);

    return () => clearInterval(dayInterval);
  }, [currentSeason, seeds]);

  const handlePlantButtonClick = (fieldIndex) => {
    setIsPlanting(true);
    setSelectedFieldIndex(fieldIndex);
  };

  const handleSeedSelect = (seed) => {
    setSelectedSeed(seed);
  };

  const handlePlantConfirm = () => {
    if (isPlanting && selectedSeed !== null && selectedFieldIndex !== null && !plantedFields[selectedFieldIndex]) {
      if (selectedSeed.seasons && !selectedSeed.seasons.includes(currentSeason)) {
        alert(`${selectedSeed.name} seeds can't be planted in the ${currentSeason}.`);
        return;
      }
      
      const newPlantedFields = [...plantedFields];
      newPlantedFields[selectedFieldIndex] = {
        seedId: selectedSeed.id,
        plantedAt: Date.now(),
        growTime: selectedSeed.growTime,
      };
      setPlantedFields(newPlantedFields);
      setSeeds(prevSeeds => prevSeeds.filter(s => s.id !== selectedSeed.id));
      setIsPlanting(false);
      setSelectedSeed(null);
      setSelectedFieldIndex(null);

      setQuests(prevQuests =>
        prevQuests.map(quest =>
          quest.goal?.type === 'plant' && quest.goal?.itemId === selectedSeed.id && quest.status !== 'completed'
            ? { ...quest, goal: { ...quest.goal, current: quest.goal.current + 1 } }
            : quest
        )
      );
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

  const handleSell = (itemName, price) => {
    setInventory(prevInventory => {
      const newInventory = { ...prevInventory };
      if (newInventory[itemName] > 1) {
        newInventory[itemName] -= 1;
      } else {
        delete newInventory[itemName];
      }
      return newInventory;
    });

    setResources(prevResources => ({
      ...prevResources,
      money: prevResources.money + price
    }));
  };

  const handleQuestComplete = (questId) => {
    setQuests(prevQuests =>
      prevQuests.map(quest =>
        quest.id === questId ? { ...quest, status: 'completed' } : quest
      )
    );
    alert(`Quest "${quests.find(q => q.id === questId)?.title}" completed!`);
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

  const openBuildingPanel = (building) => {
    setSelectedBuilding(building);
    setIsBuildingPanelOpen(true);
  };

  const closeBuildingPanel = () => {
    setSelectedBuilding(null);
    setIsBuildingPanelOpen(false);
  };

  const handleBuildingAction = (building, action) => {
    console.log(`Action "${action}" on ${building.type} at (${building.x}, ${building.y})`);
    if (action === 'collect' && building.type === 'Coop') {
      setInventory(prevInventory => ({ ...prevInventory, 'Egg': (prevInventory['Egg'] || 0) + 3 }));
    } else if (action === 'enter' && building.type === 'Barn') {
      alert('Entered the barn!');
    } else if (action === 'storage' && building.type === 'Barn') {
      alert('Opened barn storage!');
    } else if (action === 'feed' && building.type === 'Coop') {
      setResources(prevResources => ({ ...prevResources, money: prevResources.money - 5 }));
      alert('Chickens fed!');
    }
    closeBuildingPanel();
  };

  const openAnimalPanel = (animal) => {
    setSelectedAnimal(animal);
    setIsAnimalPanelOpen(true);
  };

  const closeAnimalPanel = () => {
    setSelectedAnimal(null);
    setIsAnimalPanelOpen(false);
  };

  const handleAnimalAction = (animal, action) => {
    console.log(`Action "${action}" on ${animal.type} at (${animal.x}, ${animal.y})`);
    if (action === 'feed' && animal.type === 'chicken') {
      setResources(prevResources => ({ ...prevResources, money: prevResources.money - 2 }));
      alert('Chicken fed!');
    } else if (action === 'collect' && animal.type === 'chicken') {
      setInventory(prevInventory => ({ ...prevInventory, 'Egg': (prevInventory['Egg'] || 0) + 1 }));
      alert('Collected an egg!');
    } else if (action === 'milk' && animal.type === 'cow') {
      setInventory(prevInventory => ({ ...prevInventory, 'Milk': (prevInventory['Milk'] || 0) + 1 }));
      alert('Milked the cow!');
    }
    closeAnimalPanel();
  };

  const handleCraft = (recipeId) => {
    const selectedRecipe = recipes.find(recipe => recipe.id === recipeId);
    if (!selectedRecipe) {
      alert("Recipe not found!");
      return;
    }
    
    const hasIngredients = selectedRecipe.ingredients.every(
      (ingredient) => inventory[ingredient.item] >= ingredient.quantity
    );

    if (hasIngredients) {
      setInventory(prevInventory => {
        const newInventory = { ...prevInventory };
        selectedRecipe.ingredients.forEach(ingredient => {
          newInventory[ingredient.item] -= ingredient.quantity;
          if (newInventory[ingredient.item] <= 0) {
            delete newInventory[ingredient.item];
          }
        });
        return newInventory;
      });

      setInventory(prevInventory => ({
        ...prevInventory,
        [selectedRecipe.result.item]: (prevInventory[selectedRecipe.result.item] || 0) + selectedRecipe.result.quantity,
      }));
      
      alert(`Crafted ${selectedRecipe.name}!`);
    } else {
      alert(`Not enough resources to craft ${selectedRecipe.name}.`);
    }
  };

  const handleMovePlayer = (newPos) => {
    setPlayerPos(newPos);
  };

  return (
    <div className="App">
      <h1>Farm Game</h1>
      <Player inventory={inventory} />
      <TimeAndSeasons day={day} season={currentSeason} />
      <ResourceDisplay resources={resources} />
      <SeedShop onBuySeed={handleBuySeed} currentSeason={currentSeason} />
      <SellMenu inventory={inventory} onSell={handleSell} />
      <InventoryDisplay inventory={inventory} />
      <Leaderboard />
      <Farm
        plantedFields={plantedFields}
        onPlant={handlePlantButtonClick}
        onHarvest={handleHarvest}
        seeds={seeds}
        buildings={buildings}
        animals={animals}
        season={currentSeason}
        onOpenBuildingPanel={openBuildingPanel}
        onOpenAnimalPanel={openAnimalPanel}
        playerPos={playerPos}
        onMovePlayer={handleMovePlayer}
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
        <Button onClick={() => { /* Implement delete plant logic */ }} variant="danger">
          Delete Plant
        </Button>
        <QuestLog quests={quests} onQuestComplete={handleQuestComplete} onOpenQuestDetail={openQuestDetail} />
      </div>
      <CraftingMenu inventory={inventory} recipes={recipes} onCraft={handleCraft} />

      {isBuildingPanelOpen && (
        <BuildingInteractionPanel
          building={selectedBuilding}
          onClose={closeBuildingPanel}
          onAction={handleBuildingAction}
        />
      )}
      {isAnimalPanelOpen && (
        <AnimalInteractionPanel
          animal={selectedAnimal}
          onClose={closeAnimalPanel}
          onAction={handleAnimalAction}
        />
      )}
    </div>
  );
};

export default App;