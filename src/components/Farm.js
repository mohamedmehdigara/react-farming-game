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
  width: 500px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 10px;
  border-radius: 10px;
  box-shadow: 0 0 3px #ccc;
`;

const MyFarm = ({ seeds, plantSeed }) => {
  const fields = seeds.map((seed, index) => (
    <Field key={index} fieldIndex={index} onClick={plantSeed} />
  ));

  return (
    <Farm>
    <h1>Farm</h1>
    <p>Plant seeds and grow your crops.</p>
    {fields}
  </Farm>
  
  );
};

export default MyFarm;
