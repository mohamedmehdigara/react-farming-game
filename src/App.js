import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Animations ---
const slide = keyframes` 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } `;
const growSilo = keyframes` from { transform: scaleY(0); } to { transform: scaleY(1); } `;

const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, basePrice: 25, time: 8, drain: 10 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, basePrice: 100, time: 15, drain: 20 },
  CLOVER: { id: 'CLOVER', icon: '☘️', cost: 5, basePrice: 0, time: 5, drain: -40 },
  SUNGRAIN: { id: 'SUNGRAIN', icon: '✨', cost: 0, basePrice: 1500, time: 30, drain: 50 },
  BEAN: { id: 'BEAN', icon: '🫘', cost: 0, basePrice: 300, time: 10, drain: -60 }
};

const WEATHER = {
  CLEAR: { id: 'CLEAR', icon: '☀️', speed: 1, color: '#f1f8e9' },
  RAIN: { id: 'RAIN', icon: '🌧️', speed: 2, color: '#e1f5fe' },
  NIGHT: { id: 'NIGHT', icon: '🌙', speed: 0.5, color: '#0d1117' }
};

// --- Styled Components ---
const GameWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; min-height: 100vh;
  background: ${props => props.isNight ? '#0d1117' : props.bg}; 
  color: ${props => props.isNight ? '#c9d1d9' : '#24292e'};
  transition: 2s; padding: 10px; font-family: 'Inter', sans-serif;
`;

const Section = styled.div`
  background: ${props => props.dark ? 'rgba(22, 27, 34, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(10px); border: 1px solid ${props => props.dark ? '#30363d' : '#e1e4e8'};
  border-radius: 12px; width: 100%; max-width: 380px; padding: 10px; margin-bottom: 8px;
`;

const PlotGrid = styled.div`
  display: grid; grid-template-columns: repeat(${props => props.cols || 3}, 1fr); 
  gap: 6px; width: 100%; max-width: 380px;
`;

const Plot = styled.div`
  aspect-ratio: 1/1; background: ${props => props.isSuper ? '#3e2723' : (props.isNight ? '#161b22' : '#efebe9')}; 
  border: ${props => props.isSuper ? '2px solid #ffd700' : '1px solid rgba(0,0,0,0.1)'}; 
  border-radius: 10px; position: relative; display: flex; flex-direction: column; 
  align-items: center; justify-content: center; cursor: pointer;
`;

const Meter = styled.div`
  width: 75%; height: 4px; background: rgba(0,0,0,0.1); border-radius: 4px; margin-top: 3px;
  & > div { height: 100%; background: ${props => props.color || '#4caf50'}; width: ${props => props.val || 0}%; transition: 0.3s; }
`;

const MiniBtn = styled.button`
  background: ${props => props.active ? '#2ea44f' : '#30363d'}; color: white;
  border: none; padding: 5px 8px; border-radius: 6px; font-size: 10px; cursor: pointer; margin: 2px;
`;

// --- New Visual Silo Styles ---
const SiloContainer = styled.div`
  display: flex; align-items: flex-end; gap: 4px; height: 100px; padding: 10px; background: #eee; border-radius: 8px;
`;
const SiloPillar = styled.div`
  flex: 1; background: ${props => props.color}; border-radius: 4px 4px 0 0; position: relative;
  height: ${props => props.height}%; animation: ${growSilo} 0.5s ease-out;
  &::after { content: '${props => props.icon}'; position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 12px; }
`;

export default function App() {
  // --- States (Total Logic Set) ---
  const [money, setMoney] = useState(() => Number(JSON.parse(localStorage.getItem('zf_money'))) || 1000);
  const [diamonds, setDiamonds] = useState(() => Number(JSON.parse(localStorage.getItem('zf_diamonds'))) || 0);
  const [inv, setInv] = useState(() => JSON.parse(localStorage.getItem('zf_inv')) || { WHEAT: 0, CORN: 0, SUNGRAIN: 0, BEAN: 0, MEAL: 0, COMPOST: 0, KELP: 0, FISH: 0 });
  const [staff, setStaff] = useState(() => JSON.parse(localStorage.getItem('zf_staff')) || { harvester: false, onMission: false, missionTime: 0, buffTime: 0 });
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('zf_stats')) || { xp: 0, level: 1, mastery: { WHEAT: 1, CORN: 1 } });
  const [plots, setPlots] = useState(() => JSON.parse(localStorage.getItem('zf_plots')) || Array(9).fill({ type: null, progress: 0, soil: 100, isSuper: false }));
  const [almanac, setAlmanac] = useState(() => JSON.parse(localStorage.getItem('zf_almanac')) || { botanist: false, alchemist: false });
  const [animals, setAnimals] = useState(() => JSON.parse(localStorage.getItem('zf_animals')) || { chickens: 0, cows: 0 });
  
  const [market, setMarket] = useState({ WHEAT: 25, CORN: 100, trend: 'stable' });
  const [isNight, setIsNight] = useState(false);
  const [water, setWater] = useState(100);
  const [maxWater, setMaxWater] = useState(100);
  const [uiState, setUiState] = useState('farm');
  const [weather, setWeather] = useState(WEATHER.CLEAR);
  const [fishing, setFishing] = useState({ active: false, progress: 0 });
  const [tech, setTech] = useState({ beehive: false, greenhouse: false });

  // --- Persistence ---
  useEffect(() => {
    const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));
    save('zf_money', money); save('zf_inv', inv); save('zf_staff', staff);
    save('zf_plots', plots); save('zf_stats', stats); save('zf_almanac', almanac);
    save('zf_animals', animals); save('zf_diamonds', diamonds);
  }, [money, inv, staff, plots, stats, almanac, animals, diamonds]);

  // --- Game Loop ---
  useEffect(() => {
    const ticker = setInterval(() => {
      // Water Logic
      setWater(w => Math.min(maxWater, (w || 0) + (tech.greenhouse ? 0.3 : 0.15)));

      // Robot Mission Logic
      setStaff(s => {
        if (s.onMission && s.missionTime === 1) setInv(v => ({ ...v, BEAN: (v.BEAN || 0) + 2 }));
        return { ...s, missionTime: Math.max(0, s.missionTime - 1), onMission: s.onMission && s.missionTime > 1, buffTime: Math.max(0, s.buffTime - 1) };
      });

      // Fishing Logic
      if (fishing.active) {
        setFishing(f => {
          if (f.progress >= 100) {
            const caughtKelp = Math.random() > 0.4;
            setInv(v => ({ ...v, [caughtKelp ? 'KELP' : 'FISH']: (v[caughtKelp ? 'KELP' : 'FISH'] || 0) + 1 }));
            return { active: false, progress: 0 };
          }
          return { ...f, progress: f.progress + 10 };
        });
      }

      // Plot & Animal Logic
      setPlots(current => current.map((p, i) => {
        let currentSoil = p.soil || 0;
        if (!p.type) {
          currentSoil = Math.min(100, currentSoil + ((animals?.chickens || 0) * 0.5) + ((animals?.cows || 0) * 2));
          return { ...p, soil: currentSoil };
        }
        const timeMod = isNight ? 0.5 : (weather.speed || 1);
        let robotSpeed = (staff.buffTime > 0 && !staff.onMission) ? 2 : 1;
        let beeMod = tech.beehive ? 1.2 : 1;
        let mult = timeMod * (currentSoil / 100) * (almanac.botanist ? 1.2 : 1) * robotSpeed * (p.isSuper ? 3 : 1) * beeMod;
        const growth = (100 / (p.type.time || 10)) * mult;
        const nextProgress = Math.min((p.progress || 0) + growth, 100);

        if (nextProgress >= 100 && staff.harvester && !staff.onMission) {
          handleHarvestLogic(i, p);
          return { ...p, type: null, progress: 0, soil: Math.max(0, currentSoil - (p.type.drain || 10)), isSuper: false };
        }
        return { ...p, progress: nextProgress, soil: currentSoil };
      }));
    }, 1000);
    return () => clearInterval(ticker);
  }, [isNight, tech, fishing.active, weather, staff, almanac, animals, maxWater]);

  const handleHarvestLogic = (i, p) => {
    setInv(v => ({ ...v, [p.type.id]: (v[p.type.id] || 0) + 1 }));
    setStats(s => ({ ...s, xp: (s.xp || 0) + 10 }));
    if (Math.random() < (isNight ? 0.2 : 0.1)) setInv(v => ({ ...v, SUNGRAIN: (v.SUNGRAIN || 0) + 1 }));
  };

  const manualAction = (i) => {
    const p = plots[i];
    if (p?.progress >= 100) {
      handleHarvestLogic(i, p);
      setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: null, progress: 0, isSuper: false, soil: Math.max(0, p.soil - p.type.drain) } : x));
    } else if (p && !p.type && (inv.COMPOST > 0 || inv.KELP > 0) && !p.isSuper) {
      setInv(v => ({ ...v, [inv.KELP > 0 ? 'KELP' : 'COMPOST']: v[inv.KELP > 0 ? 'KELP' : 'COMPOST'] - 1 }));
      setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, isSuper: true } : x));
    }
  };

  return (
    <GameWrap bg={weather.color} isNight={isNight}>
      <Section dark={isNight}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <b>💰 {money.toLocaleString()}</b>
          <span>💎 {diamonds} | 💧 {Math.floor((water/maxWater)*100)}%</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginTop: '8px' }}>
          {['farm', 'barn', 'chef', 'pier', 'trade'].map(m => (
            <MiniBtn key={m} active={uiState === m} onClick={() => setUiState(m)}>{m.toUpperCase()}</MiniBtn>
          ))}
        </div>
      </Section>

      {uiState === 'farm' && (
        <PlotGrid cols={stats.level === 3 ? 4 : 3}>
          {plots.map((p, i) => (
            <Plot key={i} isNight={isNight} isSuper={p.isSuper} onClick={() => manualAction(i)}>
              {p.type ? (
                <>
                  <span style={{ fontSize: stats.level === 3 ? '1.1rem' : '1.6rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</span>
                  <Meter color="#4caf50" val={p.progress}><div /></Meter>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '2px' }}>
                  <MiniBtn onClick={(e) => { e.stopPropagation(); if (money >= 10) { setMoney(m => m - 10); setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: CROPS.WHEAT, progress: 0 } : x)); } }}>🌾</MiniBtn>
                  <MiniBtn onClick={(e) => { e.stopPropagation(); if (money >= 40) { setMoney(m => m - 40); setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: CROPS.CORN, progress: 0 } : x)); } }}>🌽</MiniBtn>
                </div>
              )}
              <Meter color="#795548" val={p.soil}><div /></Meter>
            </Plot>
          ))}
        </PlotGrid>
      )}

      {uiState === 'barn' && (
        <Section dark={isNight}>
          <h4 style={{margin:'0 0 10px 0'}}>📦 Storage Silo</h4>
          <SiloContainer>
            <SiloPillar color="#ffd54f" icon="🌾" height={Math.min(100, inv.WHEAT * 2)} />
            <SiloPillar color="#ffb74d" icon="🌽" height={Math.min(100, inv.CORN * 2)} />
            <SiloPillar color="#64b5f6" icon="🐟" height={Math.min(100, inv.FISH * 10)} />
            <SiloPillar color="#81c784" icon="🌿" height={Math.min(100, inv.KELP * 10)} />
          </SiloContainer>
          <MiniBtn active style={{width:'100%', marginTop:'10px'}} onClick={() => {
            setMoney(m => m + (inv.WHEAT * market.WHEAT) + (inv.CORN * market.CORN) + (inv.FISH * 500));
            setInv(v => ({ ...v, WHEAT: 0, CORN: 0, FISH: 0 }));
          }}>LIQUIDATE ALL</MiniBtn>
        </Section>
      )}

      {uiState === 'trade' && (
        <Section dark={isNight}>
          <h4>🏪 Expansion Store</h4>
          <MiniBtn disabled={maxWater >= 250 || money < 3000} onClick={() => { setMoney(m => m - 3000); setMaxWater(250); }}>Upgrade Tank (3000g)</MiniBtn>
          <MiniBtn disabled={staff.harvester || money < 2000} onClick={() => { setMoney(m => m - 2000); setStaff(s => ({ ...s, harvester: true })); }}>🤖 Hire Robot (2000g)</MiniBtn>
          <MiniBtn disabled={tech.beehive || money < 5000} onClick={() => { setMoney(m => m - 5000); setTech(t => ({ ...t, beehive: true })); }}>🐝 Beehive (5000g)</MiniBtn>
        </Section>
      )}

      {uiState === 'chef' && (
        <Section dark={isNight}>
          <h4>👨‍🔬 Bio Lab</h4>
          <MiniBtn onClick={() => setInv(v => ({ ...v, WHEAT: v.WHEAT - 10, COMPOST: v.COMPOST + 1 }))} disabled={inv.WHEAT < 10}>Make Compost</MiniBtn>
          <MiniBtn onClick={() => { setStaff(s => ({ ...s, onMission: true, missionTime: 30 })); }} disabled={!staff.harvester || staff.onMission}>Robot Mission (30s)</MiniBtn>
        </Section>
      )}

      <Section dark={isNight} style={{ fontSize: '10px', textAlign: 'center', opacity: 0.7 }}>
        LVL: {stats.level} | XP: {stats.xp} | Market Trend: {market.trend.toUpperCase()}
      </Section>
    </GameWrap>
  );
}