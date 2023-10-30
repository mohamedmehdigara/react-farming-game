import styled from "styled-components";
import React, {useState} from "react";
import Field from "./Field";
import Plant from "./Plant";

// Define the plants variable
const plants = [];
const player = {};


const Farm = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const renderFields = () => {
  const fields = [];
  for (let i = 0; i < 10; i++) {
    fields.push(<Field key={i} />);
  }
  return fields;
};

const renderPlants = (plants) => {
  const plantComponents = [];
  for (let i = 0; i < plants.length; i++) {
    const plant = plants[i];
    const PlantComponent = styled(Plant)`
      background-color: ${plant.stage === 3 ? "red" : "green"};
    `;

    plantComponents.push(
      <PlantComponent key={i} onClick={() => harvest(i)}>
        {plant.stage}
      </PlantComponent>
    );
  }
  return plantComponents;
};

const harvest = (plantIndex) => {
  // Get the plant at the given index
  const plant = plants[plantIndex];

  // Check if the plant is fully grown
  if (plant.stage === 3) {
    // Remove the plant from the array
    plants.splice(plantIndex, 1);

    // Add code to give the player the harvested resources
    // For example, you could add a new property to the `player` object, such as `food`, and then increment it by the plant's value
    player.food += plant.value;

    // Add code to display a message to the player about the harvest
    // For example, you could use an alert box or a toast notification
    alert("You harvested a plant!");
  } else {
    // The plant is not fully grown, so display a message to the player
    alert("The plant is not fully grown yet!");
  }
};

const MyFarm = ({ plants }) => {
     const [seeds, setSeeds] = useState(10);
    
      return (
        <Farm>
          <button onClick={() => {
            setSeeds(seeds - 1);
            plants.push({ stage: 0 });
          }}>Plant Seed</button>
    
          {renderFields()}
          {renderPlants(plants)}
          {player.food}
        </Farm>
      );
    };
    
export default MyFarm;
