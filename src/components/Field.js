import React, { useState } from 'react';
import styled from 'styled-components';


const FieldContainer = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
  position: relative; // To position plant and water icons

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

const Field = ({ isPlanted, onClick, onSelect, title, ariaLabel, waterLevel }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSelect = () => {
    onSelect && onSelect();
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
    >
     
    </FieldContainer>
  );
};

export default Field;
