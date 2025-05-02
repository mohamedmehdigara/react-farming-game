import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TimeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: #fcfcfc;
  font-size: 0.9em;
`;

const TimeIconContainer = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TimeText = styled.span``;

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState({ hour: 6, minute: 0 }); // Start at 6:00 AM

  useEffect(() => {
    const gameSpeed = 100; // Milliseconds per in-game minute (adjust for faster/slower time)
    const intervalId = setInterval(() => {
      setCurrentTime((prevTime) => {
        let newMinute = prevTime.minute + 1;
        let newHour = prevTime.hour;
        if (newMinute >= 60) {
          newMinute = 0;
          newHour = (newHour + 1) % 24; // Cycle through 0-23 hours
        }
        return { hour: newHour, minute: newMinute };
      });
    }, gameSpeed);

    return () => clearInterval(intervalId);
  }, []);

  const getTimeIcon = () => {
    const hour = currentTime.hour;
    if (hour >= 6 && hour < 18) {
      // Day time
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" fill="#FFD700" />
          <path d="M12 2V4M12 20V22M4 12H6M18 12H20M5.6 5.6L7 7M17 17L18.4 18.4M5.6 18.4L7 17M17 7L18.4 5.6" stroke="#FFD700" stroke-width="2" stroke-linecap="round" />
        </svg>
      );
    } else {
      // Night time
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.7778 10.2222C19.2 9.6 18.4 9.22221 17.5 9.22221C15.1 9.22221 13.2222 11.1 13.2222 13.5C13.2222 15.9 15.1 17.7778 17.5 17.7778C18.4 17.7778 19.2 17.4 19.7778 16.8222L21 16L19.7778 15.1778C19.6 15.4 19.4 15.6 19.2 15.8C18.6 16.3778 17.8 16.7778 17 16.7778C15.6 16.7778 14.5 15.6778 14.5 14.2778C14.5 12.8778 15.6 11.7778 17 11.7778C17.8 11.7778 18.6 12.1778 19.2 12.7778C19.4 12.6 19.6 12.4 19.7778 12.2222L21 12L19.7778 11.1778C19.2 10.6 18.4 10.2222 17.5 10.2222Z" fill="#D3D3D3" />
        </svg>
      );
    }
  };

  const formatTime = () => {
    const hour = currentTime.hour.toString().padStart(2, '0');
    const minute = currentTime.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };

  return (
    <TimeContainer>
      <TimeIconContainer>
        {getTimeIcon()}
      </TimeIconContainer>
      <TimeText>Time: {formatTime()}</TimeText>
    </TimeContainer>
  );
};

export default TimeDisplay;