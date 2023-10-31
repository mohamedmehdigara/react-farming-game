import styled from "styled-components";
import Farm from "./components/Farm";
import SeedList from "./components/SeedList";
import PlantDialog from "./components/PlantDialog";
import Button from "./components/Button";
import React, {useState} from "react";

const App = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const Main = styled.div`
  flex: 1;
`;

const Footer = styled.div`
  padding: 10px;
`;

const MyApp = () => {
  const [seeds, setSeeds] = useState([
    { name: "Wheat", stage: 0 },
    { name: "Carrot", stage: 0 },
    { name: "Potato", stage: 0 },
  ]);

  const [selectedSeed, setSelectedSeed] = useState(null);
  const [isPlantDialogOpen, setIsPlantDialogOpen] = useState(false);

  const plantSeed = () => {
    // Check if the selected seed is defined.
    if (!selectedSeed) {
      return;
    }

    // Add the selected seed to the farm.
    setSeeds([...seeds, { ...selectedSeed, stage: 0 }]);

    // Close the plant dialog.
    setIsPlantDialogOpen(false);

    // Set the selected seed to null.
    setSelectedSeed(null);
  };

  const onSeedSelect = (seed) => {
    setSelectedSeed(seed);
  };

  const onPlantDialogClose = () => {
    setIsPlantDialogOpen(false);
  };

  const renderPlantDialog = () => {
    if (isPlantDialogOpen) {
      return (
        <PlantDialog
          seeds={seeds}
          onSelect={onSeedSelect}
          onClose={onPlantDialogClose}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <App>
      <Header>
        <h1>My Farm</h1>
        <Button onClick={() => setIsPlantDialogOpen(true)}>Plant Seed</Button>
      </Header>

      <Main>
      <Farm seeds={seeds} plantSeed={plantSeed} />
      </Main>

      <Footer>
        <SeedList seeds={seeds} onSelect={onSeedSelect} />
      </Footer>

      {renderPlantDialog()}
    </App>
  );
};

export default MyApp;
