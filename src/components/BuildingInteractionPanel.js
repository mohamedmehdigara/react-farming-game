import React from 'react';
import styled from 'styled-components';
import Button from './Button';

const PanelContainer = styled.div`
  position: absolute;
  background-color: #fdf5e6; /* Light beige */
  border: 1px solid #d2b48c; /* Tan */
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

const BuildingInteractionPanel = ({ building, onClose, onAction }) => {
  if (!building) {
    return null;
  }

  const getBuildingActions = (buildingType) => {
    switch (buildingType) {
      case 'Barn':
        return [
          { label: 'Enter Barn', action: 'enter' },
          { label: 'View Storage', action: 'storage' },
        ];
      case 'Coop':
        return [
          { label: 'Collect Eggs', action: 'collect' },
          { label: 'Feed Chickens', action: 'feed' },
        ];
      // Add more cases for other building types
      default:
        return [];
    }
  };

  const handleActionClick = (action) => {
    if (onAction) {
      onAction(building, action);
      onClose(); // Close the panel after an action
    }
  };

  const actions = getBuildingActions(building.type);

  return (
    <PanelContainer style={{ top: building.y * 100 + 20, left: building.x * 100 + 20 }}> {/* Adjust position */}
      <PanelTitle>{building.type}</PanelTitle>
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

export default BuildingInteractionPanel;