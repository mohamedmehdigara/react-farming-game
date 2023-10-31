import styled from "styled-components";

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
