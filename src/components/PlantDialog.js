import styled from "styled-components";
import SeedList from "./SeedList";
import Button from "./Button";

const PlantDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const DialogContent = styled.div`
  width: 500px;
  height: 300px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
`;

const MyPlantDialog = ({ seeds, onSelect, onClose }) => {
  return (
    <PlantDialog>
      <DialogContent>
        <h1>Plant a seed</h1>
        <SeedList seeds={seeds} onSelect={onSelect} />
        <Button onClick={onClose}>Cancel</Button>
      </DialogContent>
    </PlantDialog>
  );
};

export default MyPlantDialog;
