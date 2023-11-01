import styled from "styled-components";
import MySeed from "./Seed";
import React from "react";

const SeedList = styled.ul`
  width: 100px;
  height: 100px;
  border: 1px solid black;
  background-color: #fff;
  list-style-type: none;
  padding: 0;

  li {
    display: inline-block;
    margin: 5px;
    cursor: pointer;
  }

  & {
    title: "Select a seed to plant";
  }
`;

const MySeedList = ({ seeds, onSelect }) => {
  // Added a `onSelect` prop to the `MySeedList` component. This will allow the seed list to notify its parent component when a seed is selected.

  return (
    <SeedList>
      {seeds && seeds.map((seed, index) => (
        <MySeed
          key={index}
          name={seed.name}
          isSelected={seed.isSelected}
          onClick={() => onSelect(seed.id)}
        />
      ))}
    </SeedList>
  );
};

export default MySeedList;
