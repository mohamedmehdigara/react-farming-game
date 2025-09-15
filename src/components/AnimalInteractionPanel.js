import React from 'react';
import styled from 'styled-components';
import Button from './Button';

// Styled Components
const PanelContainer = styled.div`
  position: absolute;
  background-color: #faebd7; /* Antique white */
  border: 1px solid #a0522d; /* Sienna */
  border-radius: 5px;
  padding: 15px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
  min-width: 180px;
`;

const PanelTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 5px;
  text-align: center;
`;

const AnimalStatus = styled.p`
  font-size: 0.9em;
  color: #555;
  text-align: center;
  margin-bottom: 15px;
`;

const ActionButton = styled(Button)`
  margin-bottom: 8px;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`;

// Main Component
const AnimalInteractionPanel = ({ animal, onClose, onAction }) => {
  if (!animal) {
    return null;
  }

  const getAnimalActions = (animalData) => {
    switch (animalData.type) {
      case 'chicken':
        return [
          { label: 'Feed Chicken', action: 'feed', enabled: animalData.needsCare },
          { label: 'Collect Eggs', action: 'collect', enabled: animalData.hasProduct },
          { label: 'Pet Chicken', action: 'pet', enabled: true },
        ];
      case 'cow':
        return [
          { label: 'Feed Cow', action: 'feed', enabled: animalData.needsCare },
          { label: 'Milk Cow', action: 'milk', enabled: animalData.hasProduct },
          { label: 'Pet Cow', action: 'pet', enabled: true },
        ];
      case 'sheep':
        return [
          { label: 'Feed Sheep', action: 'feed', enabled: animalData.needsCare },
          { label: 'Shear Sheep', action: 'shear', enabled: animalData.hasProduct },
          { label: 'Pet Sheep', action: 'pet', enabled: true },
        ];
      default:
        return [];
    }
  };

  const getStatusMessage = (animalData) => {
    if (animalData.needsCare) {
      return 'Looks a bit hungry!';
    }
    if (animalData.hasProduct) {
      return 'Ready for harvest!';
    }
    return 'Feeling happy.';
  };

  const actions = getAnimalActions(animal);
  const statusMessage = getStatusMessage(animal);

  return (
    <PanelContainer style={{ top: animal.y * 100 + 20, left: animal.x * 100 + 20 }}>
      <PanelTitle>{animal.type.charAt(0).toUpperCase() + animal.type.slice(1)}</PanelTitle>
      <AnimalStatus>{statusMessage}</AnimalStatus>
      {actions.map((action) => (
        <ActionButton 
          key={action.action}
          onClick={() => onAction(animal, action.action)}
          disabled={!action.enabled}
          variant={action.enabled ? 'primary' : 'disabled'}
        >
          {action.label}
        </ActionButton>
      ))}
      <Button 
        onClick={onClose} 
        variant="secondary" 
        size="small" 
        style={{ marginTop: '10px', width: '100%' }}
      >
        Close
      </Button>
    </PanelContainer>
  );
};

export default AnimalInteractionPanel;