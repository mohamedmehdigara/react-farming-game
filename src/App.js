import React, { useState, useEffect } from "react";
import Farm from "./components/Farm";

const App = () => {
  const [seeds, setSeeds] = useState(10);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlants(plants => {
        const newPlants = plants.map(plant => {
          if (plant.stage < 3) {
            plant.stage++;
          }
          return plant;
        });
        return newPlants;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const plantSeed = () => {
    setSeeds(seeds - 1);
    setPlants(plants => [...plants, { stage: 0 }]);
  };

  return (
    <div>
      <h1>Seeds: {seeds}</h1>
      <h1>Plants: {plants.length}</h1>
      <Farm plants={plants} />
      <button onClick={plantSeed}>Plant Seed</button>
    </div>
  );
};

export default App;
