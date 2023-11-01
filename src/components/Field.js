import styled from "styled-components";
import React from "react";

// Define the plants array
const plants = [];

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
  const isHovered = false; // TODO: Implement this
  const isFocused = false; // TODO: Implement this

  // Call the function that is passed to the onSelect prop before the onSelect event is fired.
  const handleSelect = () => {
    onSelect && onSelect();
  };

  // Display the plant image, if there is a plant planted in the field.

  // Display the water level, if the water level is below 100%.
  const waterLevelDisplay = waterLevel < 100 && <p>Water: {waterLevel}%</p>;

  // Return the field.
  return (
    <Field
      role="button"
      tabIndex={0}
      aria-label={ariaLabel || title}
      className={`${isPlanted ? "is-planted" : ""} ${isHovered ? "is-hovered" : ""} ${isFocused ? "is-focused" : ""}`}
      onClick={onClick}
      onSelect={handleSelect}
      onMouseEnter={() => (isHovered = true)}
      onMouseLeave={() => (isHovered = false)}
      onFocus={() => (isFocused = true)}
      onBlur={() => (isFocused = false)}
    >
      {waterLevelDisplay}
    </Field>
  );
};

export default MyField;
