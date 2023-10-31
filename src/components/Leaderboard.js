import React, { useState, useEffect } from "react";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the leaderboard data from the server
    setIsLoading(true);
    fetch("/api/leaderboard")
      .then(response => response.json())
      .then(users => {
        setIsLoading(false);
        setUsers(users);
      });
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      {isLoading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.name}: {user.score}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Leaderboard;
