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
`;

const MyFarm = ({ seeds, plantSeed }) => {
  return (
    <ul>
      {seeds.map((seed, index) => (
        <li key={index}>
          <Field fieldIndex={index} onClick={plantSeed} />
        </li>
      ))}
    </ul>
  );
};

export default Farm;