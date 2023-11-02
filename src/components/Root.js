import React from "react";
import FarmStateProvider from "./FarmStateProvider";
import App from "./App";

const Root = () => {
  return (
    <FarmStateProvider>
      <App />
    </FarmStateProvider>
  );
};

export default Root;
