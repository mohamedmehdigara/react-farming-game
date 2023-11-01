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

  &.is-planted {
    background-color: #00ff00;
  }

  &.is-hovered {
    background-color: #eee;
    box-shadow: 0 0 3px #ccc;
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

const MyField = ({ fieldIndex, onClick, onSelect }) => {
  // Get the plant that is planted in the field.
  const plant = getPlant(fieldIndex);

  // Determine the CSS class of the field based on whether or not there is a plant planted in it and whether it is hovered over.
  const isPlanted = !!plant;
  const isHovered = false; // TODO: Implement this

  // Call the function that is passed to the onSelect prop before the onSelect event is fired.
  const handleSelect = () => {
    onSelect && onSelect();
  };
  // Return the field.
  return (
    <Field
      className={isPlanted ? "is-planted" : ""}
      onClick={onClick}
      onSelect={onSelect}
      onMouseEnter={() => isHovered = true}
      onMouseLeave={() => isHovered = false}
    >
      {plant && plant.stage}
    </Field>
  );
};

export default MyField;
