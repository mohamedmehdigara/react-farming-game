import styled from "styled-components";
import React, { memo, useState, useMemo } from "react";
import Field from "./Field";
import Plant from "./Plant";

// Define the seeds and setSeeds state variables

// Define a custom hook to render the fields
const useRenderFields = () => {
  const [seeds, setSeeds] = useState(10);


  // Memoize the results of the renderFields function to improve performance
  const fieldsMemo = useMemo(renderFields, []);

  return fieldsMemo;
};

const Farm = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

// Define the renderFields function outside of the MyFarm component
const renderFields = () => {
  const fields = [];
  for (let i = 0; i < 10; i++) {
    fields.push(<Field key={i} />);
  }
  return fields;
};

// Define a custom hook to render the plants
const useRenderPlants = (plants) => {
  // Memoize the results of the renderPlants function to improve performance
  const plantComponentsMemo = useMemo(() => renderPlants(plants), [plants]);

  return plantComponentsMemo;
};

// Define the renderPlants function outside of the MyFarm component
const renderPlants = () => {
  const plants = [];

  const plantComponents = [];
  for (let i = 0; i < plants.length; i++) {
    const plant = plants[i];
    const PlantComponent = styled(Plant)`
      background-color: ${plant.stage === 3 ? "red" : "green"};
    `;

    plantComponents.push(
      <PlantComponent
        key={i}
        onClick={() => {
          // Define the index and plant variables inside of the onClick handler
          const index = i;
          const plant = plants[index];

          harvest(index);
          handlePlantSelection(index);
        }}
      >
        {plant.stage}
      </PlantComponent>
    );
  }
  return plantComponents;
};

const harvest = (index) => {
  // ...
};

const handlePlantSelection = (index) => {
  // ...
};

const MyFarm = ({ seeds, setSeeds }) => {
  const [plants, setPlants] = useState();

  // Get the fields and plants components using the custom hooks
  const fieldsMemo = useRenderFields();
  const plantComponentsMemo = useRenderPlants(plants);

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

      {fieldsMemo}
      {plantComponentsMemo}
    </Farm>
  );
};

export default memo(MyFarm);