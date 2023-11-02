import React, { useState } from "react";

const SeedShop = () => {
  const [seeds, setSeeds] = useState(10);

  // Added a `maxSeeds` prop to limit the number of seeds that can be purchased.
  const maxSeeds = 100;

  // Updated the `buySeeds()` function to check if the number of seeds is already at the maximum. If it is, display an alert message.
  const buySeeds = () => {
    if (seeds === maxSeeds) {
      alert("You have reached the maximum number of seeds.");
      return;
    }

    setSeeds(seeds + 1);
  };

  // Added a conditional rendering statement to disable the "Buy Seed" button if the number of seeds is at the maximum.
  const buySeedButtonDisabled = seeds === maxSeeds;

  return (
    <div>
      <button onClick={buySeeds} disabled={buySeedButtonDisabled}>
        Buy Seed
      </button>
      <p>You have {seeds} seeds.</p>
    </div>
  );
};

export default SeedShop;
