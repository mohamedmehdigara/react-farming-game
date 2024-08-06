import React, { useContext } from 'react';
import { FarmStateContext } from './FarmStateProvider';

const Player = () => {
  const { playerData } = useContext(FarmStateContext);

  return (
    <div>
      <h2>Player Stats</h2>
      <p>Money: </p>
      <p>Experience: </p>
      {/* Add more player stats as needed */}
    </div>
  );
};

export default Player;
