import styled from "styled-components";
import React from "react";

const Seed = styled.div`
  width: 50px;
  height: 50px;
  border: 1px solid black;
  background-color: #fff;
  cursor: pointer;
  border-radius: 5px;

  &.is-selected {
    background-color: #ccc;
  }

  &.is-disabled {
    background-color: #ccc;
    cursor: default;
  }

  /* Updated the CSS transition to use the all property instead of just background-color. This will ensure that all of the CSS properties of the seed are animated when it is selected or deselected. */
  transition: all 0.2s ease-in-out;
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
