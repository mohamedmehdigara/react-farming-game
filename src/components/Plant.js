import styled from "styled-components";
import React from "react";

const Plant = styled.div`
  width: 50px;
  height: 50px;
  background-color: green;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: white;
`;

const PlantLabel = styled.div`
  margin-top: 5px;
`;

export default function MyPlant({ seed }) {
  const { stage, name } = seed;

  return (
    <Plant>
      <PlantLabel>{name} - Stage {stage}</PlantLabel>
    </Plant>
  );
}
