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

const MyField = ({ fieldIndex, onClick }) => {
  // Get the plant that is planted in the field.
  const plant = getPlant(fieldIndex);

  // Determine the CSS class of the field based on whether or not there is a plant planted in it and whether it is hovered over.
  const isPlanted = !!plant;
  const isHovered = false; // TODO: Implement this

  // Return the field.
  return (
    <Field
  fieldIndex={0}
  onClick={() => alert('You clicked on field 0!')}
>
  <h1>Field</h1>
  <p>Click to plant a seed.</p>
</Field>

  );
};

export default MyField;
