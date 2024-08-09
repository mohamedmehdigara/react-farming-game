import React, { useState } from 'react';
import styled from 'styled-components';
import PlantIcon from './PlantIcon';
import WaterIcon from './WaterIcon';

const FieldContainer = styled.div`
  width: ${({ size }) => `${size * 100}px`};
  height: 100px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
  position: relative;

  &.is-planted {
    background-color: #00ff00;
  }

  &.is-hovered {
    background-color: #eee;
    box-shadow: 0 0 3px #ccc;
  }

  &.is-focused {
    outline: 2px solid #000;
  }
`;

const Field = ({ fieldIndex, isPlanted, onClick, onSelect, title, ariaLabel, waterLevel, size }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSelect = () => {
    onSelect && onSelect(fieldIndex); // Pass fieldIndex to onSelect handler
  };

  return (
    <FieldContainer
      role="button"
      tabIndex={0}
      aria-label={ariaLabel || title}
      className={`${isPlanted ? 'is-planted' : ''} ${isHovered ? 'is-hovered' : ''} ${isFocused ? 'is-focused' : ''}`}
      onClick={onClick}
      onSelect={handleSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      size={size}
    >
      {isPlanted && <PlantIcon />}
      {waterLevel < 100 && <WaterIcon />}
    </FieldContainer>
  );
};

export default Field;
