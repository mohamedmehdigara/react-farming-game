import styled from "styled-components";
import React, { memo, useState } from "react";
import Field from "./Field";
import Plant from "./Plant";


const Farm = styled.div`
  display: flex;
  flex-wrap: wrap;
`;


// Memoize the renderPlants function to improve performance



// Define the seeds and setSeeds state variables



const MyFarm = ({  }) => {
  const [seeds, setSeeds] = useState(10);
  // Define the plants and setPlants state variables
const [plants, setPlants] = useState([]);
// Define the player state variable
const [player, setPlayer] = useState({ food: 0 });

const renderPlantsMemo = useMemo(() => renderPlants(plants), [plants]);


  // Improve the performance of the `renderPlants` function by using `useMemo` to cache the plant components
  const plantComponents = useMemo(() => renderPlants(plants), [plants]);

  // Add a new state variable to track the selected plant index
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(-1);

  // Add a new function to handle plant selection
  const handlePlantSelection = (plantIndex) => {
    setSelectedPlantIndex(plantIndex);
  };

  // Update the `renderPlants` function to highlight the selected plant
  const renderPlants = (plants) => {
    return plants.map((plant, index) => {
      const PlantComponent = styled(Plant)`
        background-color: ${plant.stage === 3 ? "red" : "green"};
        ${selectedPlantIndex === index ? "border: 2px solid blue;" : ""}
      `;

      return (
        <PlantComponent
          key={index}
          onClick={() => {
            harvest(index);
            handlePlantSelection(index);
          }}
        >
          {plant.stage}
        </PlantComponent>
      );
    });
  };

  // Add a new function to handle plant watering
  const waterPlant = () => {
    // Get the selected plant
    const selectedPlant = plants[selectedPlantIndex];

    // Check if the selected plant is fully grown
    if (selectedPlant.stage === 3) {
      // The plant is already fully grown, so display a message to the player
      alert("The plant is already fully grown!");
    } else {
      // Water the plant
      selectedPlant.stage++;

      // Update the plants state variable
      setPlants([...plants]);
    }
  };

  // Add a new button to allow the player to water the selected plant
  return (
    <Farm>
      <button
        onClick={() => {
          if (seeds > 0) {
            setSeeds(seeds - 1);
            setPlants([...plants, { stage: 0 }]);
          }
        }}
        disabled={seeds === 0}
      >
        Plant Seed
      </button>
      <button onClick={waterPlant} disabled={selectedPlantIndex === -1}>
        Water Plant
      </button>

      {renderFields()}
      {plantComponents}
      {player.food}
    </Farm>
  );
};

export default memo(MyFarm);
