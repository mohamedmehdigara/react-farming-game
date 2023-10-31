import React, { useState } from "react";
import MyFarm from "./components/Farm";
import SeedList from "./components/SeedList";
import Button from "./components/Button";

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

  return (
    <div>
      <h1>Farm Game</h1>
      <SeedList seeds={seeds} />
      <Button onClick={plantSeed}>Plant a seed</Button>
      <MyFarm seeds={seeds} plantSeed={plantSeed} />
    </div>
  );
};

export default App;
