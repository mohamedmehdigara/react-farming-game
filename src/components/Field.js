import styled from "styled-components";
import React from "react";


const Field = styled.div`
  width: 100px;
  height: 100px;
  border: 1px solid black;
  background-color: #fff;

  &.is-planted {
    background-color: #00ff00;
  }
`;

const getPlant = (plants, fieldIndex) => {
  // Get the plant at the given field index.
  const plant = plants[fieldIndex];

  // Return the plant, if it exists.
  if (plant) {
    return plant;
  } else {
    return null;
  }
};

function Field  ({ plants, fieldIndex })  {
  // Get the plant that is planted in the field.
  const plant = getPlant(plants, fieldIndex);

  // Determine the CSS class of the field based on whether or not there is a plant planted in it.
  const isPlanted = !!plant;

  return (
    <Field className={isPlanted ? "is-planted" : ""}>
      {plant && plant.stage}
    </Field>
  );
};

export default Field;
