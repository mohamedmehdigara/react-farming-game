import React, { useState, useEffect } from "react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  // Create a function to fetch the leaderboard data from an API.
  const fetchLeaderboardData = async () => {
    // TODO: Implement this function to fetch the leaderboard data from an API.
    const response = await fetch("/leaderboard");
    const data = await response.json();
    setUsers(data);
  };

  // Set the leaderboard state using the fetchLeaderboardData function.
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  // Add a check if the users array is empty. If so, display a loading message.
  const usersList = users.length > 0 ? (
    <ul>
      {users.map((user, index) => (
        <li key={index}>
          {user.name}: {user.score}
        </li>
      ))}
    </ul>
  ) : (
    <p>Loading leaderboard data...</p>
  );

  return (
    <div>
      <h1>Leaderboard</h1>
      {usersList}
    </div>
  );
};

export default Leaderboard;
