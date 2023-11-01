import React, { createContext, useState } from "react";
import FarmStateProvider from "./components/FarmStateProvider";
import SeedList from "./components/SeedList";
import Field from "./components/Field";
import Farm from "./components/Farm";
import HarvestedDisplay from "./components/HarvestedDisplay";

import "./App.css";

const App = () => {
  return (
    <div className="App">
      <h1>Farm Game</h1>
      <FarmStateProvider>
        <SeedList />
        <Field />
        <Farm />
        <HarvestedDisplay />
      </FarmStateProvider>
    </div>
  );
};

export default App;
