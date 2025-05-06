import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AnimalContainer = styled.div`
  position: absolute; /* Position on the farm grid */
  width: ${props => props.size || '60px'};
  height: ${props => props.size || '60px'};
  background-color: ${props => props.color || '#f0f0f0'}; /* Default light gray */
  border-radius: 50%; /* Make it circular by default */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8em;
  cursor: pointer;
  border: 1px solid #ccc;
`;

const AnimalIcon = styled.span`
  /* You could use text emojis or more complex SVG here */
  font-size: 1.5em;
`;

const Animal = ({ type, x, y, size, color, onInteract }) => {
  const [mood, setMood] = useState('idle'); // Example: idle, hungry, happy
  const [lastFed, setLastFed] = useState(Date.now());
  const [needsCare, setNeedsCare] = useState(false);

  useEffect(() => {
    const careInterval = Math.random() * 15000 + 15000; // Needs care every 15-30 seconds (for testing)
    const careTimer = setTimeout(() => {
      setNeedsCare(true);
      setMood('unhappy');
    }, careInterval);

    return () => clearTimeout(careTimer);
  }, []);

  const handleInteract = () => {
    if (onInteract) {
      onInteract({ type, x, y });
      setNeedsCare(false);
      setMood('happy');
      setLastFed(Date.now());
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

  const style = {
    top: `${y * 100 + (100 - (size || 60)) / 2}px`, // Adjust for tile size and animal size
    left: `${x * 100 + (100 - (size || 60)) / 2}px`, // Adjust for tile size and animal size
  };

  return (
    <AnimalContainer style={style} size={size} color={color} onClick={handleInteract} title={`${type} (${mood})`}>
      <AnimalIcon>{getAnimalIcon(type)}</AnimalIcon>
      {needsCare && <span style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '0.7em', backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '3px' }}>!</span>}
    </AnimalContainer>
  );
};

export default Animal;