import styled from "styled-components";
import React from "react";

const Seed = styled.div`
  width: 50px;
  height: 50px;
  border: 1px solid black;
  background-color: #fff;
  cursor: pointer;

  &.is-selected {
    background-color: #ccc;
  }

  &.is-disabled {
    background-color: #ccc;
    cursor: default;
  }

  /* Added a CSS transition to the background-color property. This will make the seed animation when it is selected or deselected. */
  transition: background-color 0.2s ease-in-out;
`;

const MySeed = ({ name, stage, isSelected, isDisabled, onClick }) => {
  return (
    <Seed
      className={isSelected ? "is-selected" : ""}
      onClick={onClick}
      disabled={isDisabled}
    >
      {name}
    </Seed>
  );
};

export default MySeed;
