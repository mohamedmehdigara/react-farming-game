import React from 'react';
import styled from 'styled-components';

const ResourceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const IconContainer = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResourceValue = styled.span`
  font-weight: bold;
`;

const ResourceDisplay = ({ resources }) => {
  const getIconSVG = (resource) => {
    switch (resource) {
      case 'money':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#FFD700" stroke-width="2" />
            <path d="M12 8V16" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
            <path d="M8 12H16" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
          </svg>
        );
      case 'wood':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" stroke="#A0522D" stroke-width="2" rx="2" />
            <path d="M7 7L17 17" stroke="#A0522D" stroke-width="2" stroke-linecap="round" />
            <path d="M17 7L7 17" stroke="#A0522D" stroke-width="2" stroke-linecap="round" />
          </svg>
        );
      case 'wheat':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L12 10M10 4L14 8M8 6L16 10M6 8L18 12M4 10L20 14M6 14L18 18M8 16L16 20M10 18L14 22" stroke="#F0E68C" stroke-width="2" stroke-linecap="round" />
          </svg>
        );
      // Add more cases for your other resources with their SVG code
      default:
        return null; // Or a default SVG
    }
  };

  return (
    <ResourceContainer>
      {Object.entries(resources).map(([resource, value]) => {
        const iconSVG = getIconSVG(resource);
        return (
          <div key={resource}>
            <IconContainer>
              {iconSVG}
            </IconContainer>
            <ResourceValue>{value}</ResourceValue>
          </div>
        );
      })}
    </ResourceContainer>
  );
};

export default ResourceDisplay;