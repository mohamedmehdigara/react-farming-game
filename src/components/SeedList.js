import styled from "styled-components";
import SeedComponent from "./SeedComponent";

const SeedList = styled.ul`
  width: 100px;
  height: 100px;
  border: 1px solid black;
  background-color: #fff;

  li {
    display: inline-block;
    margin: 5px;
  }
`;

const MySeedList = ({ seeds, onSelect }) => {
  return (
    <SeedList>
      {seeds.map((seed, index) => (
        <li key={index}>
          <SeedComponent
            className={seed.isSelected ? "is-selected" : ""}
            onClick={() => onSelect(seed)}
          />
        </li>
      ))}
    </SeedList>
  );
};

export default MySeedList;
