import styled from "styled-components";
import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

// Styled Components
const PlantWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Align plant to the bottom of the tile */
  align-items: center;
  pointer-events: none; /* Allows clicks to pass through to the Tile */
`;

const PlantIcon = styled.span`
  font-size: ${props => props.isReady ? '2.5em' : '1.5em'};
  transition: font-size 0.3s ease-out;
  margin-bottom: 5px;
  opacity: ${props => props.growthPct > 0 ? 1 : 0};
  transform: translateY(${props => 100 - props.growthPct}px); /* Simple growth animation */
`;

const PlantProgressBar = styled.div`
  width: 90%;
  height: 4px;
  background-color: #ccc;
  border-radius: 2px;
  margin-bottom: 2px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${props => props.isReady ? '#4CAF50' : '#2196F3'}; /* Green when ready, Blue otherwise */
  transition: width 0.5s ease-out;
`;

// Helper function to get an emoji based on seed ID and growth stage
const getPlantEmoji = (seedName, growthPct) => {
  if (growthPct === 0) return '🌱'; // Seedling
  if (growthPct < 33) return '🌱'; // Early Sprout
  if (growthPct < 66) return '🌿'; // Mid Growth
  
  // Full grown stage
  switch (seedName.toLowerCase()) {
    case 'tomato':
      return '🍅';
    case 'corn':
      return '🌽';
    case 'pumpkin':
      return '🎃';
    case 'potato':
      return '🥔';
    default:
      return '🌳';
  }
};

const Plant = ({ seedId, plantedAt, growTime, seeds }) => {
  const [growthPct, setGrowthPct] = useState(0);

  const seedData = useMemo(() => seeds.find(seed => seed.id === seedId), [seedId, seeds]);

  useEffect(() => {
    if (!seedData) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - plantedAt;
      const progress = Math.min(100, (elapsed / growTime) * 100);
      
      setGrowthPct(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 1000); // Check growth every second

    return () => clearInterval(interval);
  }, [plantedAt, growTime, seedData]);

  const isReady = growthPct >= 100;
  const emoji = getPlantEmoji(seedData?.name || 'Unknown', growthPct);

  return (
    <PlantWrapper>
      <PlantIcon 
        isReady={isReady} 
        growthPct={growthPct}
        title={isReady ? `${seedData?.name} (Ready!)` : `${seedData?.name} (${growthPct.toFixed(0)}%)`}
      >
        {emoji}
      </PlantIcon>
      <PlantProgressBar>
        <ProgressBarFill 
          width={growthPct} 
          isReady={isReady} 
        />
      </PlantProgressBar>
    </PlantWrapper>
  );
};

Plant.propTypes = {
  seedId: PropTypes.number.isRequired,
  plantedAt: PropTypes.number.isRequired,
  growTime: PropTypes.number, // growTime is optional if it's derived from seedData, but good to have
  seeds: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    growTime: PropTypes.number.isRequired,
  })).isRequired,
};

export default Plant;