import styled from "styled-components";
import Plant from "./Plant";
import Button from "./Button";
import React from "react";
import Field from "./Field";

const Farm = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 10px;
  border-radius: 10px;
  box-shadow: 0 0 3px #ccc;
`;

const MyFarm = ({ seeds, plantSeed }) => {
  // Added a check to make sure that the seeds prop is not null or undefined.
  if (!seeds) {
    return null;
  }

  // Updated the fields variable to use a conditional rendering statement to display the fields only if there are seeds available to plant.
  const fields = seeds.map((seed, index) => (
    <Field key={index} fieldIndex={index} onClick={plantSeed} />
  ));

  // Updated the Button component to use the disabled prop to disable the button if there are no seeds available to plant.
  const plantSeedButtonDisabled = seeds.length === 0;

  return (
    <Farm>
      <h1>Farm</h1>
      <p>Plant seeds and grow your crops.</p>
      {fields}
      <Button onClick={plantSeed} disabled={plantSeedButtonDisabled}>
        Plant seed
      </Button>
    </Farm>
  );
};

export default MyFarm;
