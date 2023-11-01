import styled from "styled-components";
import React from "react";
import PropTypes from "prop-types";

const Plant = styled.div`
  /* Updated the width and height to be 100px. This will make the plant icon larger and more visible. */
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: white;
`;

const PlantProgressBar = styled.div`
  /* Added a background color to the progress bar. */
  width: 100%;
  height: 5px;
  background-color: #00ff00;
  border-radius: 5px;
  margin-top: 5px;
`;

const MyPlant = ({ type, progress }) => {
  /* Added a check to make sure that the progress value is between 0 and 100. */
  if (progress < 0 || progress > 100) {
    throw new Error("Progress value must be between 0 and 100.");
  }

  /* Updated the style of the progress bar to use the `progress` prop. */
  const progressBarWidth = progress;
  const progressBarStyle = {
    width: `${progressBarWidth}%`,
  };

  return (
    <Plant>
      <PlantProgressBar style={progressBarStyle} />
    </Plant>
  );
};

MyPlant.propTypes = {
  type: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
};

export default MyPlant;
