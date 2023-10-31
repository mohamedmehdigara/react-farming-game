import styled from "styled-components";
import Plant from "./Plant";
import Button from "./Button";
import React from "react";
import Field from "./Field";

const Farm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  margin: 0 auto;
`;

const MyFarm = ({ seeds, plantSeed }) => {
  const fields = seeds.map((seed, index) => (
    <Field key={index} fieldIndex={index} onClick={plantSeed} />
  ));

  return (
    <Farm>
      {fields}
    </Farm>
  );
};

export default MyFarm;
