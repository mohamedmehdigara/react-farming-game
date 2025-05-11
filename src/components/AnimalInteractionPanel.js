import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const PanelContainer = styled.div`
  position: absolute;
  background-color: #faebd7; /* Antique white */
  border: 1px solid #a0522d; /* Sienna */
  border-radius: 5px;
  padding: 15px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 100; /* Ensure it's above other farm elements */
`;

const PanelTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 10px;
`;

const ActionButton = styled(Button)`
  margin-bottom: 8px;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`;

const AnimalInteractionPanel = ({ animal, onClose, onAction }) => {
  if (!animal) {
    return null;
  }

  const getAnimalActions = (animalType) => {
    switch (animalType) {
      case 'chicken':
        return [
          { label: 'Feed Chicken', action: 'feed' },
          { label: 'Pet Chicken', action: 'pet' },
          { label: 'Collect Eggs', action: 'collect' },
        ];
      case 'cow':
        return [
          { label: 'Feed Cow', action: 'feed' },
          { label: 'Pet Cow', action: 'pet' },
          { label: 'Milk Cow', action: 'milk' },
        ];
      case 'sheep':
        return [
          { label: 'Feed Sheep', action: 'feed' },
          { label: 'Pet Sheep', action: 'pet' },
          { label: 'Shear Sheep', action: 'shear' },
        ];
      default:
        return [];
    }
  };

  const handleActionClick = (action) => {
    if (onAction) {
      onAction(animal, action);
      onClose(); // Close the panel after an action
    }
  };

  const actions = getAnimalActions(animal.type);

  return (
    <PanelContainer style={{ top: animal.y * 100 + 20, left: animal.x * 100 + 20 }}> {/* Adjust position */}
      <PanelTitle>{animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}</PanelTitle>
      {actions.map((action) => (
        <ActionButton key={action.action} onClick={() => handleActionClick(action.action)}>
          {action.label}
        </ActionButton>
      ))}
      <Button onClick={onClose} variant="secondary" size="small" style={{ marginTop: '10px', width: '100%' }}>
        Close
      </Button>
    </PanelContainer>
  );
};

export default AnimalInteractionPanel;