import styled from "styled-components";
import Plant from "./Plant";
import Button from "./Button";

const Farm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MyFarm = ({ seeds, plantSeed }) => {
  return (
    <Farm>
      <ul>
        {seeds.map((seed, index) => (
          <li key={index}>
            <Plant seed={seed} />
          </li>
        ))}
      </ul>
      <Button onClick={plantSeed}>Plant Seed</Button>
    </Farm>
  );
};

export default MyFarm;
