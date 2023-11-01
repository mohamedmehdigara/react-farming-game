import styled from "styled-components";
import React, { useState } from "react";

const PlantIcon = () => {
  return (
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="#00ff00" />
      <path
        fill="#fff"
        d="M50,25 L50,50 L20,50 L20,75 L50,75 Z"
      />
    </svg>
  );
};

const WaterIcon = () => {
  return (
    <svg viewBox="0 0 100 100">
      <path
        fill="#000"
        d="M50,10 L50,90 L20,90 L20,70 L50,70 Z"
      />
      <path
        fill="#fff"
        d="M50,70 L80,70 L80,90 L50,90 Z"
      />
    </svg>
  );
};

const Field = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;

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

const getPlant = (fieldIndex) => {
  const plants = [];
  // Get the plant at the given field index.
  const plant = plants[fieldIndex];

  // Return the plant, if it exists.
  if (plant) {
    return plant;
  } else {
    return null;
  }
};

const MyField = ({ fieldIndex, onClick, onSelect = () => {}, title, ariaLabel, waterLevel }) => {
  // Get the plant that is planted in the field.
  const plant = getPlant(fieldIndex);

  // Determine the CSS class of the field based on whether or not there is a plant planted in it and whether it is hovered over or focused.
  const isPlanted = !!plant;
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Call the function that is passed to the onSelect prop before the onSelect event is fired.
  const handleSelect = () => {
    onSelect && onSelect();
  };

  // Display the plant icon, if there is a plant planted in the field.
  const plantIconDisplay = isPlanted && <PlantIcon />;

  // Display the water icon, if the water level is below 100%.
  const waterIconDisplay = waterLevel < 100 && <WaterIcon />;

  // Return the field.
  return (
    <Field
      role="button"
      tabIndex={0}
      aria-label={ariaLabel || title}
      className={`${isPlanted ? "is-planted" : ""} ${isHovered ? "is-hovered" : ""} ${isFocused ? "is-focused" : ""}`}
      onClick={onClick}
      onSelect={handleSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {plantIconDisplay}
      {waterIconDisplay}
    </Field>
  );
};

export default MyField;
