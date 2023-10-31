import React, { useState } from "react";
import SeedList from "./components/SeedList";
import Field from "./components/Field";
import Farm from "./components/Farm";
import Leaderboard from "./components/Leaderboard";

const App = () => {
  const [seeds, setSeeds] = useState([
    { name: "Wheat", stage: 0 },
    { name: "Corn", stage: 0 },
    { name: "Carrot", stage: 0 },
  ]);

  const plantSeed = (seedIndex) => {
    const newSeeds = [...seeds];
    newSeeds[seedIndex].stage = 1;
    setSeeds(newSeeds);
  };

  return (
    <div>
      <h1>Farm Game</h1>
      <SeedList seeds={seeds} onSelect={plantSeed} />
      <Farm seeds={seeds} plantSeed={plantSeed} />
      <Leaderboard />
    </div>
  );
};

export default App;
