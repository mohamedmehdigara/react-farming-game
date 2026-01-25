import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Animations ---
const slide = keyframes` 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } `;

const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, price: 25, time: 8, drain: 10 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, price: 100, time: 15, drain: 20 },
  CLOVER: { id: 'CLOVER', icon: '☘️', cost: 5, price: 0, time: 5, drain: -40 },
  SUNGRAIN: { id: 'SUNGRAIN', icon: '✨', cost: 0, price: 1500, time: 30, drain: 50 },
  BEAN: { id: 'BEAN', icon: '🫘', cost: 0, price: 300, time: 10, drain: -60 }
};

const WEATHER = {
  CLEAR: { id: 'CLEAR', icon: '☀️', speed: 1, color: '#e8f5e9' },
  RAIN: { id: 'RAIN', icon: '🌧️', speed: 2, color: '#cfd8dc' },
  HEAT: { id: 'HEAT', icon: '🔥', speed: 3, color: '#ffe0b2' },
  NIGHT: { id: 'NIGHT', icon: '🌙', speed: 0.5, color: '#1a237e' }
};

// --- Styled Components ---
const GameWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; min-height: 100vh;
  background: ${props => props.isNight ? '#1a237e' : props.bg}; 
  color: ${props => props.isNight ? 'white' : 'black'};
  transition: 3s; padding: 15px; font-family: sans-serif;
`;

const Ticker = styled.div`
  background: #263238; color: #00e676; width: 100%; max-width: 480px; padding: 8px; 
  overflow: hidden; white-space: nowrap; border-radius: 8px; margin-bottom: 10px; border: 2px solid #ffd600;
`;

const TickerText = styled.div` display: inline-block; animation: ${slide} 15s linear infinite; `;

const Section = styled.div`
  background: ${props => props.dark ? '#283593' : 'white'}; 
  color: ${props => props.dark ? 'white' : 'black'};
  border: 3px solid #37474f; border-radius: 12px; width: 100%; max-width: 480px; padding: 12px; margin-bottom: 10px;
`;

const PlotGrid = styled.div`
  display: grid; grid-template-columns: repeat(${props => props.cols || 3}, 1fr); 
  gap: 8px; width: 100%; max-width: 450px;
`;

const Plot = styled.div`
  aspect-ratio: 1/1; background: ${props => props.isSuper ? '#4e342e' : (props.isNight ? '#3949ab' : '#8d6e63')}; 
  border: ${props => props.isSuper ? '3px solid #ffd600' : '3px solid #3e2723'}; border-radius: 10px;
  position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;
  box-shadow: ${props => props.isSuper ? 'inset 0 0 10px #ffd600' : 'none'};
`;

const Meter = styled.div`
  width: 80%; height: 5px; background: #eee; border-radius: 2px; margin-top: 3px;
  & > div { height: 100%; background: ${props => props.color}; width: ${props => props.val || 0}%; transition: 0.3s; }
`;

export default function App() {
  // --- States ---
  const [money, setMoney] = useState(() => Number(JSON.parse(localStorage.getItem('zf_money'))) || 1000);
  const [diamonds, setDiamonds] = useState(() => Number(JSON.parse(localStorage.getItem('zf_diamonds'))) || 0);
  const [inv, setInv] = useState(() => JSON.parse(localStorage.getItem('zf_inv')) || { WHEAT: 0, CORN: 0, SUNGRAIN: 0, BEAN: 0, MEAL: 0, COMPOST: 0 });
  const [staff, setStaff] = useState(() => JSON.parse(localStorage.getItem('zf_staff')) || { harvester: false, onMission: false, missionTime: 0, buffTime: 0 });
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('zf_stats')) || { totalGold: 1000, totalHarvested: 0, xp: 0, level: 1, cropCounts: { WHEAT: 0, CORN: 0, SUNGRAIN: 0, BEAN: 0 } });
  const [plots, setPlots] = useState(() => JSON.parse(localStorage.getItem('zf_plots')) || Array(9).fill({ type: null, progress: 0, soil: 100, isSuper: false }));
  const [almanac, setAlmanac] = useState(() => JSON.parse(localStorage.getItem('zf_almanac')) || { botanist: false, merchant: false, alchemist: false });
  const [animals, setAnimals] = useState(() => JSON.parse(localStorage.getItem('zf_animals')) || { chickens: 0, cows: 0 });
  const [decor, setDecor] = useState(() => JSON.parse(localStorage.getItem('zf_decor')) || { fountain: false });

  const [weather, setWeather] = useState(WEATHER.CLEAR);
  const [isNight, setIsNight] = useState(false);
  const [water, setWater] = useState(100);
  const [uiState, setUiState] = useState('farm');
  const [contract, setContract] = useState({ type: 'CORN', amt: 10, reward: 2 });

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('zf_money', JSON.stringify(money));
    localStorage.setItem('zf_diamonds', JSON.stringify(diamonds));
    localStorage.setItem('zf_inv', JSON.stringify(inv));
    localStorage.setItem('zf_staff', JSON.stringify(staff));
    localStorage.setItem('zf_plots', JSON.stringify(plots));
    localStorage.setItem('zf_stats', JSON.stringify(stats));
    localStorage.setItem('zf_almanac', JSON.stringify(almanac));
    localStorage.setItem('zf_animals', JSON.stringify(animals));
    localStorage.setItem('zf_decor', JSON.stringify(decor));

    const xp = stats.xp || 0;
    if (xp >= 1500 && stats.level < 3) {
      setStats(s => ({ ...s, level: 3 }));
      setPlots(prev => prev.length < 16 ? [...prev, ...Array(16 - prev.length).fill({ type: null, progress: 0, soil: 100, isSuper: false })] : prev);
    } else if (xp >= 500 && stats.level < 2) {
      setStats(s => ({ ...s, level: 2 }));
      setPlots(prev => prev.length < 12 ? [...prev, ...Array(12 - prev.length).fill({ type: null, progress: 0, soil: 100, isSuper: false })] : prev);
    }
  }, [money, diamonds, inv, staff, plots, stats, almanac, animals, decor]);

  useEffect(() => {
    const cycle = setInterval(() => setIsNight(prev => !prev), 60000);
    return () => clearInterval(cycle);
  }, []);

  // --- Logic Helpers ---
  const handleHarvestLogic = (i, p) => {
    const tid = p.type.id;
    setInv(v => ({ ...v, [tid]: (v[tid] || 0) + 1 }));
    setStats(s => ({ 
      ...s, 
      totalHarvested: (s.totalHarvested || 0) + 1, 
      xp: (s.xp || 0) + 10, 
      cropCounts: { ...s.cropCounts, [tid]: ((s.cropCounts && s.cropCounts[tid]) || 0) + 1 } 
    }));
    
    let mutChance = (almanac.alchemist ? 0.15 : 0.1) * (isNight ? 2 : 1);
    [i-1, i+1, i-3, i-4, i+4].forEach(n => {
      if (plots[n] && plots[n].type && plots[n].type.id !== tid && Math.random() < mutChance) {
        setInv(v => ({ ...v, SUNGRAIN: (v.SUNGRAIN || 0) + 1 }));
      }
    });
  };

  const manualHarvest = (i) => {
    const p = plots[i];
    if (p && p.progress >= 100) {
      handleHarvestLogic(i, p);
      setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: null, progress: 0, soil: Math.max(0, Math.min(100, (p.soil || 100) - (p.type.drain || 10))) } : x));
    } else if (p && !p.type && inv.COMPOST > 0 && !p.isSuper) {
        setInv(v => ({...v, COMPOST: v.COMPOST - 1}));
        setPlots(ps => ps.map((x, idx) => idx === i ? {...x, isSuper: true} : x));
    }
  };

  const sellAll = () => {
    let gain = 0;
    Object.entries(inv).forEach(([id, count]) => {
      if (!['MEAL', 'COMPOST'].includes(id) && CROPS[id]) gain += (count || 0) * (CROPS[id].price || 0);
    });
    setMoney(m => (m || 0) + gain);
    setInv(v => ({ WHEAT: 0, CORN: 0, SUNGRAIN: 0, BEAN: 0, MEAL: v.MEAL || 0, COMPOST: v.COMPOST || 0 }));
  };

  // --- Engine ---
  useEffect(() => {
    const ticker = setInterval(() => {
      if (weather.id === 'RAIN' || decor.fountain) setWater(w => Math.min(100, (w || 0) + (decor.fountain ? 0.3 : 2)));
      
      setPlots(current => current.map((p, i) => {
        let currentSoil = p.soil || 0;
        if (!p.type) {
            currentSoil = Math.min(100, currentSoil + ((animals.chickens || 0) * 0.5) + ((animals.cows || 0) * 2));
            return { ...p, soil: currentSoil };
        }

        const timeMod = isNight ? 0.5 : (weather.speed || 1);
        let robotSpeed = (staff.buffTime > 0 && !staff.onMission) ? 2 : 1;
        let superMod = p.isSuper ? 3 : 1;
        let mult = timeMod * (currentSoil / 100) * (almanac.botanist ? 1.2 : 1) * robotSpeed * superMod;
        
        const growth = (water > 0 || weather.id === 'RAIN' || decor.fountain) ? (100 / (p.type.time || 10)) * mult : 0;
        if (weather.id !== 'RAIN' && !decor.fountain) setWater(w => Math.max(0, (w || 0) - 0.02));

        if (Math.min((p.progress || 0) + growth, 100) >= 100 && staff.harvester && !staff.onMission) {
          handleHarvestLogic(i, p);
          return { ...p, type: null, progress: 0, soil: Math.max(0, Math.min(100, currentSoil - (p.type.drain || 10))) };
        }
        return { ...p, progress: Math.min((p.progress || 0) + growth, 100), soil: currentSoil };
      }));
    }, 1000);
    return () => clearInterval(ticker);
  }, [weather, water, staff, almanac, animals, decor, isNight, plots.length]);

  return (
    <GameWrap bg={weather.color} isNight={isNight}>
      <Ticker>
        <TickerText>
          {isNight ? "🌙 NIGHT | " : "☀️ DAY | "}
          {inv.COMPOST > 0 ? `💩 COMPOST READY: Click empty plot to boost | ` : ""}
          💰 {Math.floor(money).toLocaleString()}g | $💎: {diamonds || 0}
        </TickerText>
      </Ticker>

      <Section dark={isNight}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <b>{Math.floor(money).toLocaleString()}g</b>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['farm', 'barn', 'chef', 'trade', 'almanac'].map(mode => (
              <button key={mode} onClick={() => setUiState(mode)} style={{ opacity: uiState === mode ? 1 : 0.5, padding: '5px' }}>
                {mode === 'farm' ? '🌾' : mode === 'barn' ? '🐣' : mode === 'chef' ? '🍳' : mode === 'trade' ? '🌐' : '📚'}
              </button>
            ))}
          </div>
        </div>
        <Meter color="#2196f3" val={water}><div /></Meter>
      </Section>

      {uiState === 'chef' && (
        <Section dark={isNight}>
          <h4>👨‍🍳 Production Lab</h4>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px'}}>
            <button onClick={() => setInv(v => ({ ...v, WHEAT: v.WHEAT - 1, CORN: v.CORN - 1, BEAN: v.BEAN - 1, MEAL: v.MEAL + 1 }))} disabled={inv.WHEAT < 1 || inv.CORN < 1 || inv.BEAN < 1}>Cook Meal (🥘)</button>
            <button onClick={() => setInv(v => ({ ...v, WHEAT: v.WHEAT - 10, COMPOST: (v.COMPOST || 0) + 1 }))} disabled={inv.WHEAT < 10}>Make Compost (10 🌾)</button>
          </div>
          <p style={{fontSize:'12px', marginTop:'10px'}}>Meals: {inv.MEAL} | Compost: {inv.COMPOST}</p>
        </Section>
      )}

      {uiState === 'farm' && (
        <>
          <PlotGrid cols={stats.level === 3 ? 4 : 3}>
            {plots.map((p, i) => (
              <Plot key={i} isNight={isNight} isSuper={p.isSuper} onClick={() => manualHarvest(i)}>
                {p && p.type ? (
                  <>
                    <div style={{ fontSize: stats.level === 3 ? '1.2rem' : '2rem' }}>{(p.progress || 0) >= 100 ? p.type.icon : '🌱'}</div>
                    <Meter color="#4caf50" val={p.progress}><div /></Meter>
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {p.isSuper && <span style={{fontSize:'0.6rem', position:'absolute', top:'2px'}}>✨</span>}
                    {['WHEAT', 'CORN', 'CLOVER'].map(k => (
                      <button key={k} style={{ fontSize: '0.6rem' }} onClick={(e) => { e.stopPropagation(); if (money >= CROPS[k].cost) { setMoney(m => m - CROPS[k].cost); setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: CROPS[k], progress: 0 } : x)); } }}>{CROPS[k].icon}</button>
                    ))}
                  </div>
                )}
                <Meter color="#795548" val={p ? p.soil : 100}><div /></Meter>
              </Plot>
            ))}
          </PlotGrid>
          <button onClick={sellAll} style={{ width: '100%', maxWidth: '450px', marginTop: '10px', background: '#2e7d32', color: 'white', padding: '10px', borderRadius: '8px', border: 'none' }}>SELL HARVEST</button>
        </>
      )}

      <Section dark={isNight} style={{ fontSize: '11px', textAlign: 'center' }}>
        🌾:{inv.WHEAT || 0} | 🌽:{inv.CORN || 0} | 🫘:{inv.BEAN || 0} | ✨:{inv.SUNGRAIN || 0} | ⭐ XP: {stats.xp || 0}
      </Section>
    </GameWrap>
  );
}