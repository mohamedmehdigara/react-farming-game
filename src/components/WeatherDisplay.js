import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const WeatherContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: #fcfcfc;
  font-size: 0.9em;
`;

const WeatherIconContainer = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WeatherText = styled.span``;

const WeatherDisplay = () => {
  const [currentWeather, setCurrentWeather] = useState('sunny');

  useEffect(() => {
    const weatherOptions = ['sunny', 'rainy', 'cloudy'];
    const changeInterval = Math.random() * 15000 + 5000;

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * weatherOptions.length);
      setCurrentWeather(weatherOptions[randomIndex]);
    }, changeInterval);

    return () => clearInterval(intervalId);
  }, []);

  const getWeatherSVG = (weather) => {
    switch (weather) {
      case 'sunny':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="7" fill="#FFD700" />
            <path d="M12 3V5M12 19V21M4 12H6M18 12H20M5.6 5.6L7 7M17 17L18.4 18.4M5.6 18.4L7 17M17 7L18.4 5.6" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
          </svg>
        );
      case 'rainy':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 16H18M8 13L8 17M12 13L12 17M16 13L16 17" stroke="#1E90FF" stroke-width="2" stroke-linecap="round" />
            <path d="M4 10L10 4C11.05 3.3 12.95 3.3 14 4L20 10" stroke="#6495ED" stroke-width="2" stroke-linecap="round" />
          </svg>
        );
      case 'cloudy':
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 16L13 10C11.9 9.1 10.1 9.1 9 10L5 14" stroke="#808080" stroke-width="2" stroke-linecap="round" />
            <path d="M7 18H17C18.1 18 19 17.1 19 16V13C19 11.9 18.1 11 17 11H7C5.9 11 5 11.9 5 13V16C5 17.1 5.9 18 7 18Z" fill="#D3D3D3" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="7" fill="#FFD700" />
            <path d="M12 3V5M12 19V21M4 12H6M18 12H20M5.6 5.6L7 7M17 17L18.4 18.4M5.6 18.4L7 17M17 7L18.4 5.6" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
          </svg>
        );
    }
  };

  return (
    <WeatherContainer>
      <WeatherIconContainer>
        {getWeatherSVG(currentWeather)}
      </WeatherIconContainer>
      <WeatherText>Weather: {currentWeather.charAt(0).toUpperCase() + currentWeather.slice(1)}</WeatherText>
    </WeatherContainer>
  );
};

export default WeatherDisplay;