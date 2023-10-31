import styled from "styled-components";
import React from "react";
import PropTypes from "prop-types";

const Plant = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: white;
`;

const PlantProgressBar = styled.div`
  width: 100%;
  height: 5px;
  background-color: #ccc;
  border-radius: 5px;
  margin-top: 5px;
`;

const MyPlant = ({ type, progress }) => {
  const plantImage = {
    wheat: "https://example.com/wheat.png",
    corn: "https://example.com/corn.png",
    carrot: "https://example.com/carrot.png",
  };

  const progressBarWidth = (progress / 100) * 100;

  return (
    <Plant>
      <img src={plantImage[type]} alt={type} />
      <PlantProgressBar style={{ width: `${progressBarWidth}%` }} />
    </Plant>
  );
};

MyPlant.propTypes = {
  type: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
};

export default MyPlant;
