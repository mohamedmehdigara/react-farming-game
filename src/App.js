import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

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

// --- Animations ---
const jitter = keyframes`
  0% { transform: translate(0,0) rotate(0deg); }
  25% { transform: translate(2px, 2px) rotate(5deg); }
  50% { transform: translate(-2px, 1px) rotate(-5deg); }
  75% { transform: translate(1px, -1px) rotate(3deg); }
  100% { transform: translate(0,0) rotate(0deg); }
`;

const PlotPulse = keyframes` 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } `;

// --- Styled Components ---
const GameContainer = styled.div`
  display: flex; flex-direction: column; align-items: center;
  font-family: 'Segoe UI', sans-serif; background-color: ${props => props.bgColor};
  transition: background-color 2s ease; min-height: 100vh; padding: 20px;
`;

const Header = styled.div`
  background: #5d4037; color: white; padding: 15px 30px; width: 100%; max-width: 400px;
  border-radius: 15px; margin-bottom: 15px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
`;

const HUD = styled.div` display: flex; gap: 10px; margin-bottom: 15px; `;

const Badge = styled.div`
  background: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 14px;
  border: 2px solid #5d4037; display: flex; align-items: center; gap: 5px;
`;

const FarmGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 100px); grid-gap: 12px; margin-bottom: 20px;
`;

const Plot = styled.div`
  width: 100px; height: 100px; position: relative;
  background-color: ${props => props.locked ? '#bdbdbd' : props.isReady ? '#aed581' : '#8d6e63'};
  border: 4px solid #5d4037; border-radius: 12px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; cursor: pointer;
  animation: ${props => props.isReady ? PlotPulse : 'none'} 1.5s infinite;
  opacity: ${props => props.locked ? 0.5 : 1};
`;

const PestOverlay = styled.div`
  position: absolute; font-size: 40px; z-index: 10;
  animation: ${jitter} 0.3s infinite;
  cursor: crosshair;
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
  const [money, setMoney] = useState(() => JSON.parse(localStorage.getItem('zf-v4-money')) ?? 50);
  const [xp, setXp] = useState(() => JSON.parse(localStorage.getItem('zf-v4-xp')) ?? 0);
  const [plots, setPlots] = useState(() => JSON.parse(localStorage.getItem('zf-v4-plots')) ?? Array(9).fill(null));
  const [hasAuto, setHasAuto] = useState(() => JSON.parse(localStorage.getItem('zf-v4-auto')) ?? false);
  const [weather, setWeather] = useState('SUNNY');
  const [weatherTicks, setWeatherTicks] = useState(15);
  const [selectedSeed, setSelectedSeed] = useState(CROPS.WHEAT);

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const unlockedPlotsCount = level >= 5 ? 9 : level >= 3 ? 6 : 3;

  useEffect(() => {
    localStorage.setItem('zf-v4-money', JSON.stringify(money));
    localStorage.setItem('zf-v4-xp', JSON.stringify(xp));
    localStorage.setItem('zf-v4-plots', JSON.stringify(plots));
    localStorage.setItem('zf-v4-auto', JSON.stringify(hasAuto));
  }, [money, xp, plots, hasAuto]);

  // Main Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Weather Update
      setWeatherTicks(prev => {
        if (prev <= 1) {
          const types = Object.keys(WEATHER_TYPES);
          setWeather(types[Math.floor(Math.random() * types.length)]);
          return 15 + Math.floor(Math.random() * 15);
        }
        return prev - 1;
      });

      // 2. Plot Updates
      let earnedMoney = 0;
      let earnedXp = 0;

      setPlots(currentPlots => currentPlots.map(plot => {
        if (!plot) return null;

        // Auto-harvest (only if no pests)
        if (plot.stage === 2 && hasAuto && !plot.hasPest) {
          earnedMoney += plot.type.revenue;
          earnedXp += plot.type.xp;
          return null;
        }

        if (plot.stage === 2) return plot;

        // Pest Spawning (5% chance if crop is growing and doesn't have a pest)
        if (!plot.hasPest && Math.random() < 0.05) {
          return { ...plot, hasPest: true };
        }

        // Growth: Halted by pests
        if (plot.hasPest) return plot;

        const growthStep = (100 / plot.type.growthTime) * WEATHER_TYPES[weather].multiplier;
        const newProgress = Math.min(plot.progress + growthStep, 100);
        return { 
          ...plot, 
          progress: newProgress, 
          stage: newProgress >= 100 ? 2 : (newProgress >= 50 ? 1 : 0) 
        };
      }));

      if (earnedMoney > 0) setMoney(m => m + earnedMoney);
      if (earnedXp > 0) setXp(x => x + earnedXp);
    }, 1000);

    return () => clearInterval(interval);
  }, [weather, hasAuto]);

  const handlePlotClick = (index, e) => {
    const plot = plots[index];
    if (!plot && index < unlockedPlotsCount) {
        if (money >= selectedSeed.cost && level >= selectedSeed.minLevel) {
            setMoney(m => m - selectedSeed.cost);
            setPlots(ps => ps.map((p, i) => i === index ? { type: selectedSeed, stage: 0, progress: 0, hasPest: false } : p));
        }
        return;
    }

    // Handle Pest Click (Stop propagation to prevent accidental harvest)
    if (plot?.hasPest) {
      e.stopPropagation();
      setPlots(ps => ps.map((p, i) => i === index ? { ...p, hasPest: false } : p));
      return;
    }

    // Manual Harvest
    if (plot?.stage === 2) {
      setMoney(m => m + plot.type.revenue);
      setXp(x => x + plot.type.xp);
      setPlots(ps => ps.map((p, i) => i === index ? null : p));
    }
  };

  return (
    <GameContainer bgColor={WEATHER_TYPES[weather].color}>
      <Header>
        <h2 style={{ margin: 0 }}>Zen Farmer Lvl {level}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '10px 0' }}>
          <span>💰 {money}</span> <span>✨ {xp} XP</span>
        </div>
        <ProgressBar style={{ width: '100%', background: '#3e2723' }}>
            <ProgressFill progress={(xp % XP_PER_LEVEL) / 2} style={{ background: '#00e5ff' }} />
        </ProgressBar>
      </Header>

      <HUD>
        <Badge>{WEATHER_TYPES[weather].icon} {WEATHER_TYPES[weather].label} ({weatherTicks}s)</Badge>
        {hasAuto && <Badge>🛸 Drone On</Badge>}
      </HUD>

      <FarmGrid>
        {plots.map((plot, i) => (
          <Plot key={i} locked={i >= unlockedPlotsCount} isReady={plot?.stage === 2 && !plot.hasPest} onClick={(e) => handlePlotClick(i, e)}>
            {plot?.hasPest && <PestOverlay>🐛</PestOverlay>}
            {i >= unlockedPlotsCount ? '🔒' : plot ? (
              <>
                <span style={{ fontSize: '32px', filter: plot.hasPest ? 'grayscale(0.5)' : 'none' }}>
                  {plot.stage === 2 ? (plot.type.id === 'WHEAT' ? '🌾' : plot.type.id === 'CORN' ? '🌽' : '🥕') : (plot.stage === 1 ? '🌿' : '🌱')}
                </span>
                {!plot.hasPest && <ProgressBar><ProgressFill progress={plot.progress} /></ProgressBar>}
                {plot.hasPest && <span style={{ fontSize: '10px', color: '#b71c1c', fontWeight: 'bold' }}>INFESTED!</span>}
              </>
            ) : <span style={{ opacity: 0.1, fontSize: '24px' }}>+</span>}
          </Plot>
        ))}
      </FarmGrid>

      <Controls>
        <ButtonGroup>
          {Object.values(CROPS).map(crop => (
            <Button key={crop.id} active={selectedSeed.id === crop.id} disabled={level < crop.minLevel} onClick={() => setSelectedSeed(crop)}>
              {level < crop.minLevel ? `Lvl ${crop.minLevel}` : `${crop.name}`}
            </Button>
          ))}
        </ButtonGroup>
        {!hasAuto && (
          <Button variant="upgrade" disabled={money < AUTO_HARVESTER_COST || level < 4} onClick={() => { setMoney(m => m - AUTO_HARVESTER_COST); setHasAuto(true); }}>
            Buy Drone (500g)
          </Button>
        )}
      </Controls>

      <button onClick={() => {localStorage.clear(); window.location.reload();}} style={{ marginTop: '30px', opacity: 0.3, border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}>Reset All Progress</button>
    </GameContainer>
  );
}