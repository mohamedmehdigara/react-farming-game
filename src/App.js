import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Animations ---
const slide = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

// --- Data ---
const WEATHER = {
  CLEAR: { id: 'CLEAR', icon: '☀️', speed: 1, color: '#e8f5e9' },
  RAIN: { id: 'RAIN', icon: '🌧️', speed: 2, color: '#cfd8dc' },
  HEAT: { id: 'HEAT', icon: '🔥', speed: 3, color: '#ffe0b2' }
};

const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, price: 25, time: 8 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, price: 100, time: 15 },
};

// --- Styled Components ---
const GameWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; min-height: 100vh;
  background: ${props => props.bg}; transition: 2s; padding: 20px; font-family: 'Segoe UI', sans-serif;
`;

const TickerBar = styled.div`
  background: #3e2723; color: #ffeb3b; width: 100%; max-width: 450px; 
  padding: 5px; overflow: hidden; white-space: nowrap; border-radius: 5px; margin-bottom: 10px;
  font-weight: bold; font-size: 0.9rem; border: 2px solid #ffd600;
`;

const TickerText = styled.div`
  display: inline-block; animation: ${slide} 15s linear infinite;
`;

const Section = styled.div`
  background: white; border: 3px solid #3e2723; border-radius: 12px; width: 100%; max-width: 450px; padding: 15px; margin-bottom: 10px;
`;

const Plot = styled.div`
  aspect-ratio: 1/1; background: #8d6e63; border: 3px solid #3e2723; border-radius: 10px;
  position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;
`;

export default function App() {
  const [money, setMoney] = useState(250);
  const [inv, setInv] = useState({ WHEAT: 0, CORN: 0 });
  const [weather, setWeather] = useState(WEATHER.CLEAR);
  const [staff, setStaff] = useState({ harvester: false });
  const [plots, setPlots] = useState(Array(9).fill({ type: null, progress: 0, pest: false, water: 100 }));
  
  // Market Ticker State
  const [trend, setTrend] = useState('WHEAT');
  const [news, setNews] = useState("Market is stable. Wheat prices are steady.");

  // --- Market Logic ---
  useEffect(() => {
    const marketInterval = setInterval(() => {
      const keys = Object.keys(CROPS);
      const newTrend = keys[Math.floor(Math.random() * keys.length)];
      setTrend(newTrend);
      setNews(`🔥 BOOM! High demand for ${newTrend}! Prices DOUBLED for a limited time! 🔥`);
    }, 30000); // Change trend every 30s
    return () => clearInterval(marketInterval);
  }, []);

  // --- Weather Logic ---
  useEffect(() => {
    const wTimer = setInterval(() => {
      const keys = Object.keys(WEATHER);
      setWeather(WEATHER[keys[Math.floor(Math.random() * keys.length)]]);
    }, 15000);
    return () => clearInterval(wTimer);
  }, []);

  // --- Core Game Loop ---
  useEffect(() => {
    const ticker = setInterval(() => {
      setPlots(currentPlots => currentPlots.map(p => {
        if (!p.type) return p;

        let currentWater = p.water;
        if (weather.id === 'HEAT') currentWater = Math.max(0, currentWater - 5);
        if (weather.id === 'RAIN') currentWater = Math.min(100, currentWater + 10);

        const canGrow = !p.pest && currentWater > 0;
        const growth = canGrow ? (100 / p.type.time) * weather.speed : 0;
        const nextProgress = Math.min(p.progress + growth, 100);

        if (nextProgress >= 100 && staff.harvester) {
          setInv(prev => ({ ...prev, [p.type.id]: (prev[p.type.id] || 0) + 1 }));
          return { type: null, progress: 0, pest: false, water: 100 };
        }

        return { ...p, progress: nextProgress, water: currentWater };
      }));
    }, 1000);
    return () => clearInterval(ticker);
  }, [weather, staff.harvester]);

  const plant = (i, crop) => {
    if (money >= crop.cost) {
      setMoney(prev => prev - crop.cost);
      setPlots(ps => ps.map((x, idx) => idx === i ? { type: crop, progress: 0, pest: false, water: 100 } : x));
    }
  };

  const sellAll = () => {
    let totalGain = 0;
    Object.entries(inv).forEach(([id, count]) => {
      const multiplier = id === trend ? 2 : 1;
      totalGain += count * CROPS[id].price * multiplier;
    });
    if (totalGain > 0) {
      setMoney(prev => prev + totalGain);
      setInv({ WHEAT: 0, CORN: 0 });
    }
  };

  return (
    <GameWrap bg={weather.color}>
      <TickerBar>
        <TickerText>{news}</TickerText>
      </TickerBar>

      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>💰 {money}g</h2>
          <span>{weather.icon} {weather.id}</span>
        </div>
        <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
          <button onClick={sellAll} style={{ background: '#2e7d32', color: 'white', flex: 1, padding: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
            SELL ALL (Bonus on {CROPS[trend].icon})
          </button>
        </div>
      </Section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%', maxWidth: '400px' }}>
        {plots.map((p, i) => (
          <Plot key={i} onClick={() => p.type && p.progress >= 100 && (setInv(prev => ({ ...prev, [p.type.id]: prev[p.type.id] + 1 })), setPlots(ps => ps.map((x, idx) => idx === i ? { type: null, progress: 0, pest: false, water: 100 } : x)))}>
            {p.type ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</div>
                <div style={{ fontSize: '10px' }}>{Math.floor(p.progress)}%</div>
                {p.water < 30 && <div style={{ color: 'blue', fontSize: '10px' }}>💧 WATER!</div>}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '4px' }}>
                {Object.values(CROPS).map(c => <button key={c.id} onClick={() => plant(i, c)}>{c.icon}</button>)}
              </div>
            )}
          </Plot>
        ))}
      </div>

      <Section style={{ marginTop: '15px' }}>
        <b>Storage Bin:</b> 🌾 {inv.WHEAT} | 🌽 {inv.CORN}
      </Section>
    </GameWrap>
  );
}