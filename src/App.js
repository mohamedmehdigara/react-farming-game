import React, { useState } from "react";
import MyPlantDialog from "./components/PlantDialog";
import SeedList from "./components/SeedList";
import Button from "./components/Button";

const App = () => {
  const [seeds, setSeeds] = useState([
    { name: "Wheat", stage: 0 },
    { name: "Corn", stage: 0 },
    { name: "Carrot", stage: 0 },
  ]);

  const [isPlantDialogOpen, setIsPlantDialogOpen] = useState(false);

  const openPlantDialog = () => {
    setIsPlantDialogOpen(true);
  };

  const closePlantDialog = () => {
    setIsPlantDialogOpen(false);
  };

  return (
    <div>
      <h1>Farm Game</h1>
      <SeedList seeds={seeds} />
      <Button onClick={openPlantDialog}>Plant a seed</Button>
      {isPlantDialogOpen && (
        <MyPlantDialog
          seeds={seeds}
          onSelect={(seed) => {
            // Plant the seed
          }}
          onClose={closePlantDialog}
        />
      )}
    </div>
  );
};

export default App;
