import React from 'react';
import styled from 'styled-components';
import Button from './Button';

// Styled Components
const PanelContainer = styled.div`
  position: absolute;
  background-color: #fdf5e6; /* Light beige */
  border: 1px solid #d2b48c; /* Tan */
  border-radius: 5px;
  padding: 15px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
  min-width: 180px;
  text-align: center;
`;

const PanelTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 5px;
`;

const BuildingInfo = styled.p`
  font-size: 0.9em;
  color: #555;
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
const BuildingInteractionPanel = ({ building, onClose, onAction }) => {
  if (!building) {
    return null;
  }

  // Example dynamic data for buildings (you would get this from state)
  const buildingData = {
    'Barn': {
      status: 'Ready for use',
      animals: 2,
    },
    'Coop': {
      status: 'Eggs ready!',
      eggsReady: 3,
      chickens: 4,
    },
  };

  const currentBuildingData = buildingData[building.type];

  const getBuildingActions = (buildingType) => {
    switch (buildingType) {
      case 'Barn':
        return [
          { label: 'Enter Barn', action: 'enter', enabled: true },
          { label: 'View Storage', action: 'storage', enabled: true },
        ];
      case 'Coop':
        const hasEggs = currentBuildingData?.eggsReady > 0;
        return [
          { label: 'Collect Eggs', action: 'collect', enabled: hasEggs },
          { label: 'Feed Chickens', action: 'feed', enabled: true },
        ];
      default:
        return [];
    }
  };

  const handleActionClick = (action) => {
    if (onAction) {
      onAction(building, action);
      onClose();
    }
  };

  const actions = getBuildingActions(building.type);

  return (
    <PanelContainer style={{ top: building.y * 100 + 20, left: building.x * 100 + 20 }}>
      <PanelTitle>{building.type}</PanelTitle>
      {currentBuildingData && (
        <BuildingInfo>
          {building.type === 'Coop' ? `Eggs ready: ${currentBuildingData.eggsReady}` : currentBuildingData.status}
        </BuildingInfo>
      )}
      {actions.map((action) => (
        <ActionButton
          key={action.action}
          onClick={() => handleActionClick(action.action)}
          disabled={!action.enabled}
          variant={action.enabled ? 'primary' : 'disabled'}
        >
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