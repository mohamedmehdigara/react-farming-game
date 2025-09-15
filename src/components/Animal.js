import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// Keyframe animation for subtle movement
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;

// Keyframe animation for random wandering
const wander = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(5px, -5px); }
  50% { transform: translate(0, 5px); }
  75% { transform: translate(-5px, -5px); }
  100% { transform: translate(0, 0); }
`;

const AnimalContainer = styled.div`
  position: absolute;
  width: ${props => props.size || '60px'};
  height: ${props => props.size || '60px'};
  background-color: ${props => props.color || '#f0f0f0'};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8em;
  cursor: pointer;
  border: 2px solid #ccc;
  z-index: 10;
  transition: border-color 0.3s ease-in-out;

  ${props => props.needsCare && css`
    border-color: red;
    animation: ${float} 1s ease-in-out infinite;
  `}

  ${props => props.hasProduct && css`
    border-color: gold;
    animation: ${float} 1s ease-in-out infinite;
  `}
`;

const AnimalIcon = styled.span`
  font-size: 1.5em;
`;

const StatusIndicator = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 0.7em;
  font-weight: bold;
  background-color: ${props => props.color || 'red'};
  color: white;
  border-radius: 50%;
  padding: 3px;
  line-height: 1;
`;

const Animal = ({ type, x, y, size, color, onInteract }) => {
  const [needsCare, setNeedsCare] = useState(false);
  const [hasProduct, setHasProduct] = useState(false);

  // Example: a chicken produces an egg every 30 seconds
  const productionInterval = 30000;

  useEffect(() => {
    // Timer to determine when the animal needs care
    const careInterval = Math.random() * 20000 + 10000;
    const careTimer = setTimeout(() => {
      setNeedsCare(true);
    }, careInterval);

    // Timer for product generation
    const productTimer = setInterval(() => {
      if (!needsCare) {
        setHasProduct(true);
      }
    }, productionInterval);

    return () => {
      clearTimeout(careTimer);
      clearInterval(productTimer);
    };
  }, [needsCare, productionInterval]);

  const handleInteract = () => {
    if (onInteract) {
      if (needsCare) {
        onInteract({ type, x, y, action: 'feed' });
        setNeedsCare(false);
      } else if (hasProduct) {
        onInteract({ type, x, y, action: 'collect' });
        setHasProduct(false);
      }
    }
  };

  const getAnimalIcon = (animalType) => {
    switch (animalType) {
      case 'chicken':
        return '🐔';
      case 'cow':
        return '🐄';
      case 'sheep':
        return '🐑';
      default:
        return '🐾';
    }
  };

  // Adjust style to position the animal on the farm grid
  const style = {
    top: `${y * 100 + (100 - (size || 60)) / 2}px`,
    left: `${x * 100 + (100 - (size || 60)) / 2}px`,
  };

  return (
    <AnimalContainer 
      style={style} 
      size={size} 
      color={color} 
      onClick={handleInteract} 
      needsCare={needsCare} 
      hasProduct={hasProduct}
      title={`${type}`}
    >
      <AnimalIcon>{getAnimalIcon(type)}</AnimalIcon>
      {needsCare && <StatusIndicator color="red">!</StatusIndicator>}
      {hasProduct && <StatusIndicator color="gold">🥚</StatusIndicator>}
    </AnimalContainer>
  );
};

export default Animal;