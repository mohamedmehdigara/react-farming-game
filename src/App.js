import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// --- Constants ---
const CROPS = {
  WHEAT: { id: 'WHEAT', name: 'Wheat', cost: 10, revenue: 25, growthTime: 5, xp: 15, minLevel: 1 },
  CORN: { id: 'CORN', name: 'Corn', cost: 40, revenue: 100, growthTime: 12, xp: 45, minLevel: 3 },
  CARROT: { id: 'CARROT', name: 'Carrot', cost: 100, revenue: 300, growthTime: 25, xp: 120, minLevel: 5 },
};

const WEATHER_TYPES = {
  SUNNY: { label: 'Sunny', icon: '☀️', multiplier: 1, color: '#FFF9C4' },
  RAIN: { label: 'Raining', icon: '🌧️', multiplier: 2, color: '#B3E5FC' },
  HEATWAVE: { label: 'Heatwave', icon: '🔥', multiplier: 0.5, color: '#FFCCBC' },
};

const GROWTH_STAGES = { SEED: 0, SPROUT: 1, MATURE: 2 };
const XP_PER_LEVEL = 200;
const AUTO_HARVESTER_COST = 500;

// --- Styled Components ---
const GameContainer = styled.div`
  display: flex; flex-direction: column; align-items: center;
  font-family: 'Segoe UI', sans-serif; 
  background-color: ${props => props.bgColor};
  transition: background-color 2s ease;
  min-height: 100vh; padding: 20px;
`;

const Header = styled.div`
  background: #5d4037; color: white; padding: 15px 30px; width: 100%; max-width: 400px;
  border-radius: 15px; margin-bottom: 15px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
`;

const WeatherIndicator = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 20px; border-radius: 20px; margin-bottom: 15px;
  font-weight: bold; display: flex; align-items: center; gap: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  border: 2px solid #5d4037;
`;

const StatsGrid = styled.div` display: flex; justify-content: space-around; margin-top: 5px; `;

const XPBarContainer = styled.div`
  width: 100%; height: 8px; background: #3e2723; border-radius: 4px; margin-top: 10px; overflow: hidden;
`;

const XPFill = styled.div`
  height: 100%; background: #00e5ff; width: ${props => props.progress}%; transition: width 0.4s ease;
`;

const FarmGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 100px); grid-gap: 12px; margin-bottom: 20px;
`;

const PlotPulse = keyframes` 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } `;

const Plot = styled.div`
  width: 100px; height: 100px; 
  background-color: ${props => props.locked ? '#bdbdbd' : props.isReady ? '#aed581' : '#8d6e63'};
  border: 4px solid #5d4037; border-radius: 12px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; cursor: pointer;
  animation: ${props => props.isReady ? PlotPulse : 'none'} 1.5s infinite;
  opacity: ${props => props.locked ? 0.5 : 1};
`;

const ProgressBar = styled.div` width: 70%; height: 6px; background: #4e342e; border-radius: 3px; margin-top: 8px; `;
const ProgressFill = styled.div` height: 100%; background: #8bc34a; width: ${props => props.progress}%; `;

const Controls = styled.div` display: flex; flex-direction: column; gap: 12px; align-items: center; `;
const ButtonGroup = styled.div` display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; `;

const Button = styled.button`
  padding: 10px 15px; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer;
  background-color: ${props => props.variant === 'upgrade' ? '#ab47bc' : props.active ? '#388e3c' : '#81c784'};
  box-shadow: 0 4px ${props => props.variant === 'upgrade' ? '#7b1fa2' : props.active ? '#1b5e20' : '#2e7d32'};
  &:disabled { background-color: #bdbdbd; box-shadow: 0 4px #9e9e9e; cursor: not-allowed; }
`;

// --- Main App Component ---
export default function App() {
  const [money, setMoney] = useState(() => JSON.parse(localStorage.getItem('zf-v3-money')) ?? 50);
  const [xp, setXp] = useState(() => JSON.parse(localStorage.getItem('zf-v3-xp')) ?? 0);
  const [plots, setPlots] = useState(() => JSON.parse(localStorage.getItem('zf-v3-plots')) ?? Array(9).fill(null));
  const [hasAuto, setHasAuto] = useState(() => JSON.parse(localStorage.getItem('zf-v3-auto')) ?? false);
  const [weather, setWeather] = useState('SUNNY');
  const [weatherTicks, setWeatherTicks] = useState(15); // Seconds until weather changes
  const [selectedSeed, setSelectedSeed] = useState(CROPS.WHEAT);

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const unlockedPlotsCount = level >= 5 ? 9 : level >= 3 ? 6 : 3;

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem('zf-v3-money', JSON.stringify(money));
    localStorage.setItem('zf-v3-xp', JSON.stringify(xp));
    localStorage.setItem('zf-v3-plots', JSON.stringify(plots));
    localStorage.setItem('zf-v3-auto', JSON.stringify(hasAuto));
  }, [money, xp, plots, hasAuto]);

  // Main Engine
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Weather Timer
      setWeatherTicks(prev => {
        if (prev <= 1) {
          const types = Object.keys(WEATHER_TYPES);
          const nextWeather = types[Math.floor(Math.random() * types.length)];
          setWeather(nextWeather);
          return 15 + Math.floor(Math.random() * 15);
        }
        return prev - 1;
      });

      // 2. Update Growth & Auto-Harvest
      let earnedMoney = 0;
      let earnedXp = 0;

      setPlots(currentPlots => currentPlots.map(plot => {
        if (!plot) return null;
        
        // Auto-harvest logic
        if (plot.stage === GROWTH_STAGES.MATURE && hasAuto) {
          earnedMoney += plot.type.revenue;
          earnedXp += plot.type.xp;
          return null;
        }

        if (plot.stage === GROWTH_STAGES.MATURE) return plot;

        // Growth logic: Add progress based on weather multiplier
        const growthStep = (100 / plot.type.growthTime) * WEATHER_TYPES[weather].multiplier;
        const newProgress = Math.min(plot.progress + growthStep, 100);
        
        let newStage = plot.stage;
        if (newProgress >= 100) newStage = GROWTH_STAGES.MATURE;
        else if (newProgress >= 50) newStage = GROWTH_STAGES.SPROUT;

        return { ...plot, progress: newProgress, stage: newStage };
      }));

      if (earnedMoney > 0) setMoney(m => m + earnedMoney);
      if (earnedXp > 0) setXp(x => x + earnedXp);
    }, 1000);

    return () => clearInterval(interval);
  }, [weather, hasAuto]);

  const handlePlotClick = (index) => {
    if (index >= unlockedPlotsCount) return;
    const plot = plots[index];

    if (plot?.stage === GROWTH_STAGES.MATURE) {
      setMoney(m => m + plot.type.revenue);
      setXp(x => x + plot.type.xp);
      setPlots(ps => ps.map((p, i) => i === index ? null : p));
    } else if (!plot && money >= selectedSeed.cost && level >= selectedSeed.minLevel) {
      setMoney(m => m - selectedSeed.cost);
      setPlots(ps => ps.map((p, i) => i === index ? { type: selectedSeed, stage: 0, progress: 0 } : p));
    }
  };

  return (
    <GameContainer bgColor={WEATHER_TYPES[weather].color}>
      <Header>
        <h2 style={{ margin: 0 }}>Level {level} Farmer</h2>
        <StatsGrid>
          <span>💰 {money}</span> <span>✨ {xp} XP</span>
        </StatsGrid>
        <XPBarContainer><XPFill progress={(xp % XP_PER_LEVEL) / 2} /></XPBarContainer>
      </Header>

      <WeatherIndicator>
        <span>{WEATHER_TYPES[weather].icon} {WEATHER_TYPES[weather].label}</span>
        <span style={{ fontSize: '12px', opacity: 0.6 }}>Changes in {weatherTicks}s</span>
      </WeatherIndicator>

      <FarmGrid>
        {plots.map((plot, i) => (
          <Plot key={i} locked={i >= unlockedPlotsCount} isReady={plot?.stage === 2} onClick={() => handlePlotClick(i)}>
            {i >= unlockedPlotsCount ? '🔒' : plot ? (
              <>
                <span style={{ fontSize: '32px' }}>
                  {plot.stage === 2 ? (plot.type.id === 'WHEAT' ? '🌾' : plot.type.id === 'CORN' ? '🌽' : '🥕') : (plot.stage === 1 ? '🌿' : '🌱')}
                </span>
                <ProgressBar><ProgressFill progress={plot.progress} /></ProgressBar>
              </>
            ) : <span style={{ opacity: 0.2 }}>+</span>}
          </Plot>
        ))}
      </FarmGrid>

      <Controls>
        <ButtonGroup>
          {Object.values(CROPS).map(crop => (
            <Button key={crop.id} active={selectedSeed.id === crop.id} disabled={level < crop.minLevel} onClick={() => setSelectedSeed(crop)}>
              {level < crop.minLevel ? `Lvl ${crop.minLevel}` : `${crop.name} (${crop.cost}g)`}
            </Button>
          ))}
        </ButtonGroup>
        {!hasAuto && (
          <Button variant="upgrade" disabled={money < AUTO_HARVESTER_COST || level < 4} onClick={() => { setMoney(m => m - AUTO_HARVESTER_COST); setHasAuto(true); }}>
            🤖 Buy Auto-Harvester (500g)
          </Button>
        )}
        {hasAuto && <div style={{ color: '#2e7d32', fontWeight: 'bold' }}>Drone Active 🛸</div>}
      </Controls>

      <button onClick={() => {localStorage.clear(); window.location.reload();}} style={{ marginTop: '30px', opacity: 0.4, border: 'none', background: 'none', cursor: 'pointer' }}>Reset Profile</button>
    </GameContainer>
  );
}