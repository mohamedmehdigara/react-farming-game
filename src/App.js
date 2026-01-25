import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Animations ---
const slide = keyframes` 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } `;

const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, basePrice: 25, time: 8, drain: 10 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, basePrice: 100, time: 15, drain: 20 },
  CLOVER: { id: 'CLOVER', icon: '☘️', cost: 5, basePrice: 0, time: 5, drain: -40 },
  SUNGRAIN: { id: 'SUNGRAIN', icon: '✨', cost: 0, basePrice: 1500, time: 30, drain: 50 },
  BEAN: { id: 'BEAN', icon: '🫘', cost: 0, basePrice: 300, time: 10, drain: -60 }
};

const WEATHER = {
  CLEAR: { id: 'CLEAR', icon: '☀️', speed: 1, color: '#e8f5e9' },
  RAIN: { id: 'RAIN', icon: '🌧️', speed: 2, color: '#cfd8dc' },
  NIGHT: { id: 'NIGHT', icon: '🌙', speed: 0.5, color: '#0d1117' }
};

// --- Styled Components ---
const GameWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; min-height: 100vh;
  background: ${props => props.isNight ? '#0d1117' : props.bg}; 
  color: ${props => props.isNight ? '#c9d1d9' : '#24292e'};
  transition: 2s; padding: 15px; font-family: sans-serif;
`;

const Ticker = styled.div`
  background: #263238; color: #00e676; width: 100%; max-width: 480px; padding: 8px; 
  overflow: hidden; white-space: nowrap; border-radius: 8px; margin-bottom: 10px; border: 2px solid #ffd600;
`;

const TickerText = styled.div` display: inline-block; animation: ${slide} 15s linear infinite; `;

const Section = styled.div`
  background: ${props => props.dark ? '#161b22' : 'white'};
  border: 2px solid #30363d; border-radius: 12px; width: 100%; max-width: 480px; padding: 12px; margin-bottom: 10px;
`;

const PlotGrid = styled.div`
  display: grid; grid-template-columns: repeat(${props => props.cols || 3}, 1fr); gap: 8px; width: 100%;
`;

const Plot = styled.div`
  aspect-ratio: 1/1; background: ${props => props.isSuper ? '#3e2723' : (props.isNight ? '#21262d' : '#8d6e63')}; 
  border: ${props => props.isSuper ? '2px solid #ffd700' : '2px solid #3e2723'}; border-radius: 10px;
  position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;
`;

const Meter = styled.div`
  width: 80%; height: 5px; background: #eee; border-radius: 2px; margin-top: 3px;
  & > div { height: 100%; background: ${props => props.color || '#4caf50'}; width: ${props => props.val || 0}%; transition: 0.3s; }
`;

export default function App() {
  // --- States with Robust Fail-safes ---
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
  const [uiState, setUiState] = useState('farm');
  const [weather, setWeather] = useState(WEATHER.CLEAR);
  const [fishing, setFishing] = useState({ active: false, progress: 0 });
  const [tech, setTech] = useState({ beehive: false, greenhouse: false });

  // --- Persistence & Leveling ---
  useEffect(() => {
    localStorage.setItem('zf_money', JSON.stringify(money));
    localStorage.setItem('zf_diamonds', JSON.stringify(diamonds));
    localStorage.setItem('zf_inv', JSON.stringify(inv));
    localStorage.setItem('zf_staff', JSON.stringify(staff));
    localStorage.setItem('zf_plots', JSON.stringify(plots));
    localStorage.setItem('zf_stats', JSON.stringify(stats));

    if ((stats?.xp || 0) >= 1500 && stats.level < 3) {
      setStats(s => ({ ...s, level: 3 }));
      setPlots(prev => prev.length < 16 ? [...prev, ...Array(16 - prev.length).fill({ type: null, progress: 0, soil: 100, isSuper: false })] : prev);
    } else if ((stats?.xp || 0) >= 500 && stats.level < 2) {
      setStats(s => ({ ...s, level: 2 }));
      setPlots(prev => prev.length < 12 ? [...prev, ...Array(12 - prev.length).fill({ type: null, progress: 0, soil: 100, isSuper: false })] : prev);
    }
  }, [money, diamonds, inv, staff, plots, stats]);

  // --- Main Engine ---
  useEffect(() => {
    const ticker = setInterval(() => {
      setWater(w => Math.min(100, (w || 0) + 0.15));

      setStaff(s => {
        const isMissionEnd = s.onMission && s.missionTime <= 1;
        if (isMissionEnd) setInv(v => ({ ...v, BEAN: (v.BEAN || 0) + 2 }));
        return { ...s, missionTime: Math.max(0, s.missionTime - 1), onMission: s.onMission && s.missionTime > 1, buffTime: Math.max(0, s.buffTime - 1) };
      });

      if (fishing.active) {
        setFishing(f => {
          if (f.progress >= 100) {
            const caughtKelp = Math.random() > 0.4;
            setInv(v => ({ ...v, [caughtKelp ? 'KELP' : 'FISH']: (v[caughtKelp ? 'KELP' : 'FISH'] || 0) + 1 }));
            return { active: false, progress: 0 };
          }
          return { ...f, progress: (f.progress || 0) + 10 };
        });
      }

      setPlots(current => current.map((p, i) => {
        let currentSoil = p.soil || 0;
        if (!p.type) {
          currentSoil = Math.min(100, currentSoil + ((animals?.chickens || 0) * 0.5) + ((animals?.cows || 0) * 2));
          return { ...p, soil: currentSoil };
        }

        const timeMod = isNight ? 0.5 : (weather.speed || 1);
        let robotSpeed = (staff.buffTime > 0 && !staff.onMission) ? 2 : 1;
        let superMod = p.isSuper ? 3 : 1;
        let beeMod = tech.beehive ? 1.2 : 1;
        let mult = timeMod * (currentSoil / 100) * (almanac.botanist ? 1.2 : 1) * robotSpeed * superMod * beeMod;
        
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
  }, [isNight, tech, fishing.active, weather, staff, almanac, animals]);

  // --- Market & Day Cycle ---
  useEffect(() => {
    const marketInt = setInterval(() => {
      setMarket({ 
        WHEAT: Math.max(10, 25 + (Math.random() * 20 - 10)), 
        CORN: Math.max(50, 100 + (Math.random() * 40 - 20)),
        trend: Math.random() > 0.5 ? 'bull' : 'bear'
      });
    }, 15000);
    const timeInt = setInterval(() => setIsNight(n => !n), 60000);
    return () => { clearInterval(marketInt); clearInterval(timeInt); };
  }, []);

  const handleHarvestLogic = (i, p) => {
    const tid = p.type.id;
    setInv(v => ({ ...v, [tid]: (v[tid] || 0) + 1 }));
    setStats(s => ({ ...s, xp: (s.xp || 0) + 10 }));
    let mutChance = (almanac.alchemist ? 0.15 : 0.1) * (isNight ? 2 : 1);
    if (Math.random() < mutChance) setInv(v => ({ ...v, SUNGRAIN: (v.SUNGRAIN || 0) + 1 }));
  };

  const manualHarvest = (i) => {
    const p = plots[i];
    if (p?.progress >= 100) {
      handleHarvestLogic(i, p);
      setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: null, progress: 0, isSuper: false, soil: Math.max(0, (p.soil || 0) - (p.type.drain || 10)) } : x));
    } else if (p && !p.type && ((inv?.COMPOST || 0) > 0 || (inv?.KELP || 0) > 0) && !p.isSuper) {
      const type = (inv?.KELP || 0) > 0 ? 'KELP' : 'COMPOST';
      setInv(v => ({ ...v, [type]: v[type] - 1 }));
      setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, isSuper: true } : x));
    }
  };

  const sellAll = () => {
    const mW = stats?.mastery?.WHEAT || 1;
    const mC = stats?.mastery?.CORN || 1;
    let total = ((inv?.WHEAT || 0) * market.WHEAT * mW) + 
                ((inv?.CORN || 0) * market.CORN * mC) + 
                ((inv?.SUNGRAIN || 0) * 1500) + 
                ((inv?.FISH || 0) * 500);
    setMoney(m => (m || 0) + total);
    setInv(v => ({ ...v, WHEAT: 0, CORN: 0, SUNGRAIN: 0, FISH: 0 }));
  };

  return (
    <GameWrap bg={weather.color} isNight={isNight}>
      <Ticker>
        <TickerText>
          {isNight ? "🌙 NIGHT CYCLE | " : "☀️ DAY CYCLE | "}
          💰 {Math.floor(money).toLocaleString()}g | {market.trend === 'bull' ? '📈 Bull Market' : '📉 Bear Market'}
        </TickerText>
      </Ticker>

      <Section dark={isNight}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <b>💰 {Math.floor(money).toLocaleString()}g</b>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['farm', 'chef', 'pier', 'trade', 'barn'].map(m => (
              <button key={m} onClick={() => setUiState(m)} style={{ opacity: uiState === m ? 1 : 0.6, fontSize: '10px', padding: '5px' }}>{m.toUpperCase()}</button>
            ))}
          </div>
        </div>
        <Meter color="#2196f3" val={water}><div /></Meter>
      </Section>

      {uiState === 'farm' && (
        <>
          <PlotGrid cols={stats.level === 3 ? 4 : 3}>
            {plots.map((p, i) => (
              <Plot key={i} isNight={isNight} isSuper={p.isSuper} onClick={() => manualHarvest(i)}>
                {p.type ? (
                  <>
                    <span style={{ fontSize: '1.5rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</span>
                    <Meter color="#4caf50" val={p.progress}><div /></Meter>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center' }}>
                    {['WHEAT', 'CORN'].map(k => (
                      <button key={k} style={{fontSize:'10px'}} onClick={(e) => { e.stopPropagation(); if (money >= CROPS[k].cost) { setMoney(m => m - CROPS[k].cost); setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: CROPS[k], progress: 0 } : x)); } }}>{CROPS[k].icon}</button>
                    ))}
                  </div>
                )}
                <Meter color="#795548" val={p.soil}><div /></Meter>
              </Plot>
            ))}
          </PlotGrid>
          <button onClick={sellAll} style={{ width: '100%', maxWidth:'480px', marginTop: '10px', background: '#2e7d32', color: 'white', padding: '10px', borderRadius: '8px', border: 'none' }}>SELL ALL HARVEST</button>
        </>
      )}

      {uiState === 'pier' && (
        <Section dark={isNight}>
          <h4>🎣 Pier (🌿 Kelp or 🐟 Fish)</h4>
          <Meter color="#03a9f4" val={fishing.progress}><div /></Meter>
          <button disabled={fishing.active || water < 20} onClick={() => { setWater(w => w - 20); setFishing({ active: true, progress: 0 }); }} style={{ width: '100%', marginTop: '10px', padding: '10px' }}>
            {fishing.active ? 'Casting Line...' : 'Cast Line (20% Water)'}
          </button>
        </Section>
      )}

      {uiState === 'chef' && (
        <Section dark={isNight}>
          <h4>👨‍🍳 Culinary & Bio Lab</h4>
          <button onClick={() => setInv(v => ({ ...v, WHEAT: v.WHEAT - 10, COMPOST: (v.COMPOST || 0) + 1 }))} disabled={(inv?.WHEAT || 0) < 10}>Make Compost (10 🌾)</button>
          <button onClick={() => { setInv(v => ({ ...v, MEAL: v.MEAL - 1 })); setStaff(s => ({ ...s, buffTime: 60 })); }} disabled={(inv?.MEAL || 0) < 1 || !staff.harvester} style={{ marginLeft: '5px' }}>Feed Robot (⚡)</button>
          <button onClick={() => { setInv(v => ({ ...v, CORN: v.CORN - 50 })); setStats(s => ({ ...s, mastery: { ...s.mastery, CORN: (s.mastery?.CORN || 1) + 0.1 } })); }} disabled={(inv?.CORN || 0) < 50} style={{ display: 'block', width: '100%', marginTop: '5px' }}>Study Corn (+0.1 Mastery)</button>
        </Section>
      )}

      {uiState === 'trade' && (
        <Section dark={isNight}>
          <h4>💹 Tech & Almanac</h4>
          <button disabled={tech.beehive || money < 5000} onClick={() => { setMoney(m => m - 5000); setTech(t => ({ ...t, beehive: true })); }}>🐝 Beehive (5k)</button>
          <button disabled={almanac.botanist || diamonds < 5} onClick={() => { setDiamonds(d => d - 5); setAlmanac(a => ({ ...a, botanist: true })); }}>📖 Botanist (5💎)</button>
          {!staff.harvester && <button onClick={() => money >= 2000 && (setMoney(m => m - 2000), setStaff(s => ({ ...s, harvester: true })))}>🤖 Buy Robot (2k)</button>}
        </Section>
      )}

      <Section dark={isNight} style={{ fontSize: '11px', textAlign: 'center' }}>
        Inventory: 🌾:{inv?.WHEAT || 0} | 🌽:{inv?.CORN || 0} | 🌿:{inv?.KELP || 0} | 🐟:{inv?.FISH || 0} | 💩:{inv?.COMPOST || 0}
      </Section>
    </GameWrap>
  );
}