import styled from "styled-components";
import React from "react";

// Define the plants variable
const plants = [];

const Field = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid black;
  background-color: #fff;

  &.is-planted {
    background-color: #00ff00;
  }

  &:hover {
    cursor: pointer;
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

  // Determine the CSS class of the field based on whether or not there is a plant planted in it.
  const isPlanted = !!plant;

  // Add a tooltip to the field that shows the plant's stage, if there is a plant planted in the field.
  const tooltip = plant && plant.stage ? `Stage ${plant.stage}` : "";

  return (
    <Field
      className={isPlanted ? "is-planted" : ""}
      title={tooltip}
      onClick={onClick}
    >
      {plant && plant.stage}
    </Field>
  );
};

export default MyField;
