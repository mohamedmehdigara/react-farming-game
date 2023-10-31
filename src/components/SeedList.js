import styled from "styled-components";
import MySeed from "./Seed";

const SeedList = styled.ul`
  width: 100px;
  height: 100px;
  border: 1px solid black;
  background-color: #fff;

  li {
    display: inline-block;
    margin: 5px;
  }

  & {
    title: "Select a seed to plant";
  }
`;

const MySeedList = ({ seeds, onSelect }) => {
  return (
    <SeedList>
      {seeds.map((seed, index) => (
        <li key={index}>
          <MySeed
            name={seed.name}
            stage={seed.stage}
            isSelected={seed.isSelected}
            isDisabled={seed.isDisabled}
            onClick={() => onSelect(seed)}
          />
        </li>
      ))}
    </SeedList>
  );
};

export default MySeedList;
