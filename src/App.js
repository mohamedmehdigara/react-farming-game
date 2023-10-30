import React from "react";
import MyFarm from "./components/Farm";
import SeedShop from "./components/SeedShop";
import Leaderboard from "./components/Leaderboard";

const App = () => {
  return (
    <div>
      <MyFarm />
      <SeedShop />
      <Leaderboard />
    </div>
  );
};

export default App;
