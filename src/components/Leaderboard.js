import React, {useState, useEffect} from "react";

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      // Fetch the leaderboard data from the server
      fetch("/api/leaderboard")
        .then(response => response.json())
        .then(users => setUsers(users));
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