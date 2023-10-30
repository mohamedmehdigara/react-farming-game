import React, {useState} from "react";

const SeedShop = () => {
    const [seeds, setSeeds] = useState(10);
  
    const buySeeds = () => {
      setSeeds(seeds + 1);
    };
  
    return (
      <div>
        <button onClick={buySeeds}>Buy Seed</button>
        <p>You have {seeds} seeds.</p>
      </div>
    );
  };

  export default SeedShop;
  