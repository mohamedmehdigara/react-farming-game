import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const WEATHER = {
  CLEAR: { id: 'CLEAR', icon: '☀️', speed: 1, color: '#e8f5e9' },
  RAIN: { id: 'RAIN', icon: '🌧️', speed: 2, color: '#cfd8dc' },
  HEAT: { id: 'HEAT', icon: '🔥', speed: 3, color: '#ffe0b2' }
};

const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, price: 25, time: 8 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, price: 100, time: 15 },
};

const GameWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; min-height: 100vh;
  background: ${props => props.bg}; transition: 2s; padding: 20px; font-family: 'Courier New', Courier, monospace;
`;

const Section = styled.div`
  background: white; border: 3px solid #3e2723; border-radius: 12px; width: 100%; max-width: 450px; padding: 15px; margin-bottom: 10px;
  box-shadow: 4px 4px 0px #3e2723;
`;

const Plot = styled.div`
  aspect-ratio: 1/1; background: #8d6e63; border: 3px solid #3e2723; border-radius: 10px;
  position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;
  &:hover { filter: brightness(1.1); }
`;

export default function App() {
  const [money, setMoney] = useState(250);
  const [inv, setInv] = useState({ WHEAT: 0, CORN: 0 });
  const [weather, setWeather] = useState(WEATHER.CLEAR);
  const [staff, setStaff] = useState({ harvester: false });
  const [plots, setPlots] = useState(Array(9).fill({ type: null, progress: 0, pest: false, water: 100 }));

  // --- Weather Logic ---
  useEffect(() => {
    const wTimer = setInterval(() => {
      const keys = Object.keys(WEATHER);
      setWeather(WEATHER[keys[Math.floor(Math.random() * keys.length)]]);
    }, 10000);
    return () => clearInterval(wTimer);
  }, []);

  // --- Core Game Loop (Optimized for State Consistency) ---
  useEffect(() => {
    const ticker = setInterval(() => {
      setPlots(currentPlots => currentPlots.map(p => {
        if (!p.type) return p;

        let isPest = p.pest;
        if (!isPest && Math.random() < 0.005) isPest = true;

        let currentWater = p.water;
        if (weather.id === 'HEAT') currentWater = Math.max(0, currentWater - 5);
        if (weather.id === 'RAIN') currentWater = Math.min(100, currentWater + 10);

        const canGrow = !isPest && currentWater > 0;
        const growth = canGrow ? (100 / p.type.time) * weather.speed : 0;
        const nextProgress = Math.min(p.progress + growth, 100);

        // Auto-Harvester Logic
        if (nextProgress >= 100 && staff.harvester) {
          setInv(prevInv => ({ 
            ...prevInv, 
            [p.type.id]: (prevInv[p.type.id] || 0) + 1 
          }));
          return { type: null, progress: 0, pest: false, water: 100 };
        }

        return { ...p, progress: nextProgress, pest: isPest, water: currentWater };
      }));
    }, 1000);
    return () => clearInterval(ticker);
  }, [weather, staff.harvester]); // Staff.harvester added as dependency

  const plant = (i, crop) => {
    if (money >= crop.cost) {
      setMoney(prev => prev - crop.cost);
      setPlots(ps => ps.map((x, idx) => idx === i ? { type: crop, progress: 0, pest: false, water: 100 } : x));
    }
  };

  const manualHarvest = (i) => {
    const p = plots[i];
    if (p?.type && p.progress >= 100) {
      setInv(prev => ({ ...prev, [p.type.id]: prev[p.type.id] + 1 }));
      setPlots(ps => ps.map((x, idx) => idx === i ? { type: null, progress: 0, pest: false, water: 100 } : x));
    }
  };

  const sellAll = () => {
    let totalGain = 0;
    Object.entries(inv).forEach(([id, count]) => {
      totalGain += count * CROPS[id].price;
    });
    if (totalGain > 0) {
      setMoney(prev => prev + totalGain);
      setInv({ WHEAT: 0, CORN: 0 });
    }
  };

  return (
    <GameWrap bg={weather.color}>
      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '1.2rem' }}>💰 {money}g</h1>
          <span style={{ fontSize: '1.5rem' }}>{weather.icon} {weather.id}</span>
        </div>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          {!staff.harvester && (
            <button onClick={() => money >= 1000 && (setMoney(m=>m-1000), setStaff(s=>({...s, harvester:true})))}>
              Hire Robot (1000g)
            </button>
          )}
          <button onClick={sellAll} style={{ background: '#2e7d32', color: 'white' }}>Sell All Crops</button>
        </div>
      </Section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%', maxWidth: '400px' }}>
        {plots.map((p, i) => (
          <Plot key={i} onClick={() => manualHarvest(i)}>
            {p.pest && <div style={{position:'absolute', top: -10, right: -10, fontSize: '1.5rem'}} onClick={(e)=>{e.stopPropagation(); setPlots(ps=>ps.map((x,idx)=>idx===i?{...x, pest:false}:x))}}>🐦</div>}
            
            {p.type ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</div>
                <div style={{ fontSize: '10px', fontWeight: 'bold' }}>{Math.floor(p.progress)}%</div>
                {p.water < 30 && <div onClick={(e) => {e.stopPropagation(); setPlots(ps => ps.map((x, idx) => idx === i ? {...x, water: 100} : x))}} style={{fontSize: '0.8rem', color: 'blue', cursor: 'pointer'}}>💧 WATER ME</div>}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '5px' }}>
                {Object.values(CROPS).map(c => <button key={c.id} onClick={() => plant(i, c)}>{c.icon}</button>)}
              </div>
            )}
          </Plot>
        ))}
      </div>

      <Section style={{ marginTop: '20px' }}>
        <b>Storage:</b> Wheat: {inv.WHEAT} | Corn: {inv.CORN}
      </Section>
    </GameWrap>
  );
}