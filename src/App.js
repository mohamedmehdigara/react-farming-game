import React, { useState } from "react";
import MyButton from "./components/Button";
import SeedList from "./components/SeedList";
import Field from "./components/Field";
import Farm from "./components/Farm";

const App = () => {
  const [seeds, setSeeds] = useState([
    { name: "Wheat", stage: 0 },
    { name: "Corn", stage: 0 },
    { name: "Carrot", stage: 0 },
  ]);

  const [selectedField, setSelectedField] = useState(null);

  const [water, setWater] = useState(100);

  const plantSeed = (fieldIndex) => {
    setSeeds((prevSeeds) => {
      const newSeeds = [...prevSeeds];
      newSeeds[fieldIndex].stage = 1;
      return newSeeds;
    });
  };

  const waterPlant = (fieldIndex) => {
    setWater((prevWater) => {
      const newWater = prevWater - 10;
      return newWater;
    });
    setSeeds((prevSeeds) => {
      const newSeeds = [...prevSeeds];
      newSeeds[fieldIndex].stage++;
      return newSeeds;
    });
  };

  const handleSelectField = (fieldIndex) => {
    setSelectedField(fieldIndex);
  };

  return (
    <div>
      <h1>Farm Game</h1>
      <SeedList seeds={seeds} />
      <MyButton onClick={() => plantSeed(selectedField)}>Plant seed</MyButton>
      <MyButton onClick={() => waterPlant(selectedField)}>Water plant</MyButton>
      <Farm selectedField={selectedField}>
        {seeds.map((seed, index) => (
          <Field
            key={index}
            fieldIndex={index}
            onSelect={handleSelectField}
            seed={seed}
          />
        ))}
      </Farm>
      <p>Water: {water}%</p>
    </div>
  );
};

export default App;
