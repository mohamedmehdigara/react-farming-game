import React, { useState, useEffect } from "react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  // Create a dummy leaderboard
  const dummyLeaderboard = [
    { name: "Alice", score: 100 },
    { name: "Bob", score: 90 },
    { name: "Carol", score: 80 },
    { name: "Dave", score: 70 },
    { name: "Eve", score: 60 },
  ];

  // Set the leaderboard state
  useEffect(() => {
    setUsers(dummyLeaderboard);
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.name}: {user.score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
