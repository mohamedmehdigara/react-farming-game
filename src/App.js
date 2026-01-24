import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Animations ---
const slide = keyframes` 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } `;

// --- Data ---
const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, price: 25, time: 8, drain: 10 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, price: 100, time: 15, drain: 20 },
  CLOVER: { id: 'CLOVER', icon: '☘️', cost: 5, price: 0, time: 5, drain: -40 },
  SUNGRAIN: { id: 'SUNGRAIN', icon: '✨', cost: 0, price: 1500, time: 30, drain: 50 }
};

const WEATHER = {
  CLEAR: { id: 'CLEAR', icon: '☀️', speed: 1, color: '#e8f5e9' },
  RAIN: { id: 'RAIN', icon: '🌧️', speed: 2, color: '#cfd8dc' },
  HEAT: { id: 'HEAT', icon: '🔥', speed: 3, color: '#ffe0b2' }
};

// --- Styled Components ---
const GameWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; min-height: 100vh;
  background: ${props => props.bg}; transition: 3s; padding: 15px; font-family: sans-serif;
`;

const Ticker = styled.div`
  background: #263238; color: #00e676; width: 100%; max-width: 480px; padding: 8px; 
  overflow: hidden; white-space: nowrap; border-radius: 8px; margin-bottom: 10px; border: 2px solid #ffd600;
`;

const TickerText = styled.div` display: inline-block; animation: ${slide} 15s linear infinite; `;

const Section = styled.div`
  background: white; border: 3px solid #37474f; border-radius: 12px; width: 100%; max-width: 480px; padding: 12px; margin-bottom: 10px;
`;

const Plot = styled.div`
  aspect-ratio: 1/1; background: #8d6e63; border: 3px solid #3e2723; border-radius: 10px;
  position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;
`;

const Meter = styled.div`
  width: 80%; height: 5px; background: #eee; border-radius: 2px; margin-top: 3px;
  & > div { height: 100%; background: ${props => props.color}; width: ${props => props.val}%; transition: 0.3s; }
`;

export default function App() {
  // --- Persistent States ---
  const [money, setMoney] = useState(() => JSON.parse(localStorage.getItem('zf_money')) || 1000);
  const [inv, setInv] = useState(() => JSON.parse(localStorage.getItem('zf_inv')) || { WHEAT: 0, CORN: 0, SUNGRAIN: 0 });
  const [staff, setStaff] = useState(() => JSON.parse(localStorage.getItem('zf_staff')) || { harvester: false });
  const [plots, setPlots] = useState(() => JSON.parse(localStorage.getItem('zf_plots')) || Array(9).fill({ type: null, progress: 0, soil: 100 }));
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('zf_stats')) || { totalGold: 1000, totalHarvested: 0, cropCounts: { WHEAT: 0, CORN: 0, SUNGRAIN: 0 } });

  const [weather, setWeather] = useState(WEATHER.CLEAR);
  const [water, setWater] = useState(100);
  const [event, setEvent] = useState({ name: "Stable Market", type: 'NONE' });
  const [showStats, setShowStats] = useState(false);

  // --- Auto-Save Effect ---
  useEffect(() => {
    localStorage.setItem('zf_money', JSON.stringify(money));
    localStorage.setItem('zf_inv', JSON.stringify(inv));
    localStorage.setItem('zf_staff', JSON.stringify(staff));
    localStorage.setItem('zf_plots', JSON.stringify(plots));
    localStorage.setItem('zf_stats', JSON.stringify(stats));
  }, [money, inv, staff, plots, stats]);

  // --- Event Engine ---
  useEffect(() => {
    const eTimer = setInterval(() => {
      const events = [
        { name: "🐞 LADYBUG BLITZ: 3x GROWTH SPEED!", type: 'LADYBUG' },
        { name: "📉 MARKET CRASH: SELL PRICES HALVED!", type: 'CRASH' },
        { name: "🌞 HEATWAVE: WATER DEPLETING FAST!", type: 'HEAT' }
      ];
      const selected = events[Math.floor(Math.random() * events.length)];
      setEvent(selected);
      if (selected.type === 'HEAT') setWeather(WEATHER.HEAT);
      setTimeout(() => { setEvent({ name: "Stable Market", type: 'NONE' }); setWeather(WEATHER.CLEAR); }, 15000);
    }, 45000);
    return () => clearInterval(eTimer);
  }, []);

  // --- Main Engine ---
  useEffect(() => {
    const ticker = setInterval(() => {
      if (weather.id === 'RAIN') setWater(w => Math.min(100, w + 2));
      setPlots(current => current.map((p, i) => {
        if (!p.type) return p;
        let mult = weather.speed * (p.soil / 100);
        if (event.type === 'LADYBUG') mult *= 3;
        if (water <= 0 && weather.id !== 'RAIN') return p;
        const growth = (100 / p.type.time) * mult;
        const nextProgress = Math.min(p.progress + growth, 100);
        setWater(w => Math.max(0, w - 0.02));
        if (nextProgress >= 100 && staff.harvester) {
          handleHarvestLogic(i, p);
          return { type: null, progress: 0, soil: Math.max(0, Math.min(100, p.soil - p.type.drain)) };
        }
        return { ...p, progress: nextProgress };
      }));
    }, 1000);
    return () => clearInterval(ticker);
  }, [weather, event, water, staff.harvester]);

  const handleHarvestLogic = (i, p) => {
    const typeId = p.type.id;
    setInv(v => ({ ...v, [typeId]: v[typeId] + 1 }));
    setStats(s => ({
      ...s,
      totalHarvested: s.totalHarvested + 1,
      cropCounts: { ...s.cropCounts, [typeId]: (s.cropCounts[typeId] || 0) + 1 }
    }));
    // Hybrid logic check
    [i-1, i+1, i-3, i+3].forEach(n => {
      if (plots[n]?.type && plots[n].type.id !== typeId && Math.random() < 0.1) {
        setInv(v => ({ ...v, SUNGRAIN: v.SUNGRAIN + 1 }));
        setStats(s => ({ ...s, cropCounts: { ...s.cropCounts, SUNGRAIN: s.cropCounts.SUNGRAIN + 1 } }));
      }
    });
  };

  const manualHarvest = (i) => {
    const p = plots[i];
    if (p.progress >= 100) {
      handleHarvestLogic(i, p);
      setPlots(ps => ps.map((x, idx) => idx === i ? { type: null, progress: 0, soil: Math.max(0, Math.min(100, p.soil - p.type.drain)) } : x));
    }
  };

  const sellAll = () => {
    let gain = 0;
    const mod = event.type === 'CRASH' ? 0.5 : 1;
    Object.entries(inv).forEach(([id, count]) => gain += count * (CROPS[id]?.price || 0) * mod);
    setMoney(m => m + gain);
    setStats(s => ({ ...s, totalGold: s.totalGold + gain }));
    setInv({ WHEAT: 0, CORN: 0, SUNGRAIN: 0 });
  };

  const mostGrown = Object.keys(stats.cropCounts).reduce((a, b) => stats.cropCounts[a] > stats.cropCounts[b] ? a : b);

  return (
    <GameWrap bg={weather.color}>
      <Ticker><TickerText>{event.name} | Click the stats icon to see your legacy!</TickerText></Ticker>

      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <b>💰 {money.toLocaleString()}g</b>
          <button onClick={() => setShowStats(!showStats)} style={{ background: '#37474f', color: 'white', borderRadius: '50%', width: '30px', height: '30px', border: 'none' }}>📊</button>
        </div>
        <Meter color="#2196f3" val={water}><div /></Meter>
        <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
          <button onClick={sellAll} style={{ flex: 1, background: '#2e7d32', color: 'white', fontWeight: 'bold', padding: '10px', cursor: 'pointer' }}>SELL ALL</button>
          {!staff.harvester && <button onClick={() => money >= 2000 && (setMoney(m=>m-2000), setStaff({harvester:true}))}>Hire Bot (2k)</button>}
        </div>
      </Section>

      {showStats && (
        <Section style={{ background: '#f5f5f5', border: '2px dashed #37474f' }}>
          <h4>👨‍🌾 Farm Records</h4>
          <p>Total Gold Earned: {stats.totalGold.toLocaleString()}g</p>
          <p>Crops Harvested: {stats.totalHarvested}</p>
          <p>Most Grown: {CROPS[mostGrown]?.icon} {mostGrown}</p>
        </Section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', width: '100%', maxWidth: '420px' }}>
        {plots.map((p, i) => (
          <Plot key={i} onClick={() => p.progress >= 100 && manualHarvest(i)}>
            {p.type ? (
              <>
                <div style={{ fontSize: '2rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</div>
                <Meter color="#4caf50" val={p.progress}><div /></Meter>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '2px' }}>
                {['WHEAT', 'CORN', 'CLOVER'].map(k => (
                  <button key={k} onClick={(e) => { e.stopPropagation(); if(money >= CROPS[k].cost) { setMoney(m=>m-CROPS[k].cost); setPlots(ps => ps.map((x,idx)=>idx===i?{...x, type:CROPS[k], progress:0}:x)); } }}>{CROPS[k].icon}</button>
                ))}
              </div>
            )}
            <Meter color="#795548" val={p.soil}><div /></Meter>
          </Plot>
        ))}
      </div>

      <Section style={{ fontSize: '12px', textAlign: 'center' }}>
        <b>Storage:</b> 🌾:{inv.WHEAT} | 🌽:{inv.CORN} | ✨:{inv.SUNGRAIN}
      </Section>
    </GameWrap>
  );
}