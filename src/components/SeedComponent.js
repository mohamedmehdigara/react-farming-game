import styled from "styled-components";

const SeedComponent = styled.div`
  width: 50px;
  height: 50px;
  border: 1px solid black;
  background-color: #fff;

  &.is-selected {
    background-color: #ccc;
  }
`;

export default SeedComponent;
