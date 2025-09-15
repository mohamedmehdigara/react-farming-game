import React from 'react';
import styled from 'styled-components';

const TimeContainer = styled.div`
  background-color: #f0fff0; /* Honeydew */
  border: 1px solid #90ee90; /* Light Green */
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  width: 150px;
`;

const SeasonDisplay = styled.div`
  font-size: 1.1em;
  font-weight: bold;
  color: #2e8b57; /* Sea Green */
  margin-bottom: 5px;
`;

const DayDisplay = styled.div`
  font-size: 0.9em;
  color: #555;
`;

const TimeAndSeasons = ({ day, season }) => {
  const getSeasonEmoji = (seasonName) => {
    switch (seasonName) {
      case 'spring':
        return '🌸';
      case 'summer':
        return '☀️';
      case 'fall':
        return '🍂';
      case 'winter':
        return '❄️';
      default:
        return '';
    }
  };

  return (
    <TimeContainer>
      <SeasonDisplay>
        {getSeasonEmoji(season)} {season.charAt(0).toUpperCase() + season.slice(1)}
      </SeasonDisplay>
      <DayDisplay>
        Day: {day}
      </DayDisplay>
    </TimeContainer>
  );
};

export default TimeAndSeasons;