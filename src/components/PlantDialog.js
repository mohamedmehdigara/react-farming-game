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
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DialogContent = styled.div`
  width: 500px;
  height: 300px;
  background-color: #fff;
  padding: 20px;
`;

const MyPlantDialog = ({ seeds, onSelect, onClose }) => {
  // Added a `title` prop to the `DialogContent` component. This will allow the title of the dialog to be customized.
  const title = "Plant a seed";

  return (
    <PlantDialog>
      <DialogContent title={title}>
        <h1>{title}</h1>
        <SeedList seeds={seeds} onSelect={onSelect} />
        <Button onClick={onClose}>Cancel</Button>
      </DialogContent>
    </PlantDialog>
  );
};

export default MyPlantDialog;
