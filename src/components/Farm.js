import styled from "styled-components";
import Plant from "./Plant"; // Assuming Plant component for grown crops
import Button from "./Button";
import React, { useState, useEffect } from "react";
import Field from "./Field";

const Farm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 10px;
  border-radius: 10px;
  box-shadow: 0 0 3px #ccc;
`;

const SeedInventory = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
`;

const MyFarm = ({ seeds, plantSeed, growTime }) => {
  const [seedInventoryState, setSeedInventoryState] = useState(seeds || []); // Handle missing seeds gracefully (default to empty array)
  const [plantedFields, setPlantedFields] = useState(new Array(seeds?.length || 0).fill(null)); // Track planted fields (handle missing seeds)

  // Fetch initial seeds if not provided as props (optional)
  useEffect(() => {
    if (!seeds) {
      // Fetch seeds from an API or local storage (implement logic here)
      console.log("Fetching seeds..."); // Replace with actual fetching logic
    }
  }, []);

  const handlePlantSeed = (fieldIndex) => {
    if (seedInventoryState.length === 0) {
      // No seeds available feedback
      console.log("No seeds available!"); // Replace with visual/audio feedback
      return;
    }

    const updatedInventory = [...seedInventoryState];
    updatedInventory[fieldIndex] = null;
    setSeedInventoryState(updatedInventory);

    const updatedPlantedFields = [...plantedFields];
    updatedPlantedFields[fieldIndex] = { seedType: seedInventoryState[fieldIndex], plantedAt: Date.now() }; // Track seed type and planting time
    setPlantedFields(updatedPlantedFields);

    plantSeed(fieldIndex); // Call the plantSeed function with field index
  };

  // Grow crops functionality (example)
  useEffect(() => {
    const growCrops = async () => {
      for (let i = 0; i < plantedFields.length; i++) {
        const field = plantedFields[i];
        if (field && Date.now() - field.plantedAt >= growTime) {
          // Crop is ready to be harvested (update field state or display message)
          console.log(`Crop in field ${i} is ready to harvest!`);
          setPlantedFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[i] = null; // Reset field to allow replanting
            return updatedFields;
          });
        }
      }
    };

    const intervalId = setInterval(growCrops, 1000); // Check for grown crops every second (adjust interval as needed)

    return () => clearInterval(intervalId); // Cleanup function for the interval
  }, [plantedFields, growTime]);

  return (
    <Farm>
      <h1>Farm</h1>
      <SeedInventory>
        <p>Seeds: {seedInventoryState.length}</p>
        {/* Add dropdown or buttons for seed selection if multiple types exist */}
      </SeedInventory>
      <p>Plant seeds and grow your crops.</p>
      {seeds &&
        seeds.map((seed, index) => (
          <Field
            key={index}
            fieldIndex={index}
            onClick={() => handlePlantSeed(index)}
            hasSeed={plantedFields[index] !== null} // Show planted state based on plantedFields
          />
        ))}
      <Button
        onClick={() => plantSeed()} // Call plantSeed without a specific field index if planting any available seed is allowed
        disabled={seedInventoryState.length === 0}
        aria-label="Plant a seed"
      >
        Plant seed
      </Button>
    </Farm>
  );
};

export default MyFarm;
