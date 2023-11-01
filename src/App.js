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

  const plantSeed = (fieldIndex) => {
    setSeeds((prevSeeds) => {
      const newSeeds = [...prevSeeds];
      newSeeds[fieldIndex].stage = 1;
      return newSeeds;
    });
  };

  const [selectedField, setSelectedField] = useState(null);

  const handleSelectField = (fieldIndex) => {
    setSelectedField(fieldIndex);
  };

  return (
    <div>
      <h1>Farm Game</h1>
      <SeedList seeds={seeds} />
      <MyButton onClick={() => plantSeed(selectedField)}>Plant seed</MyButton>
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
    </div>
  );
};

export default App;
