import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Animations ---
const slide = keyframes` 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } `;

// --- Constants ---
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
  
  // --- Almanac State ---
  const [almanac, setAlmanac] = useState(() => JSON.parse(localStorage.getItem('zf_almanac')) || {
    botanist: false, // 100 Wheat -> +20% Soil Speed
    merchant: false, // 10k Gold -> -5s Event Dur
    alchemist: false // 5 SunGrain -> +5% Mutation
  });

  const [weather, setWeather] = useState(WEATHER.CLEAR);
  const [water, setWater] = useState(100);
  const [event, setEvent] = useState({ name: "Stable Market", type: 'NONE' });
  const [showAlmanac, setShowAlmanac] = useState(false);

  // --- Persistence & Almanac Check ---
  useEffect(() => {
    localStorage.setItem('zf_money', JSON.stringify(money));
    localStorage.setItem('zf_inv', JSON.stringify(inv));
    localStorage.setItem('zf_staff', JSON.stringify(staff));
    localStorage.setItem('zf_plots', JSON.stringify(plots));
    localStorage.setItem('zf_stats', JSON.stringify(stats));
    localStorage.setItem('zf_almanac', JSON.stringify(almanac));

    // Check for unlocks
    if (!almanac.botanist && stats.cropCounts.WHEAT >= 100) setAlmanac(a => ({...a, botanist: true}));
    if (!almanac.merchant && stats.totalGold >= 10000) setAlmanac(a => ({...a, merchant: true}));
    if (!almanac.alchemist && stats.cropCounts.SUNGRAIN >= 5) setAlmanac(a => ({...a, alchemist: true}));
  }, [money, inv, staff, plots, stats, almanac]);

  // --- Main Engine ---
  useEffect(() => {
    const ticker = setInterval(() => {
      if (weather.id === 'RAIN') setWater(w => Math.min(100, w + 2));
      setPlots(current => current.map((p, i) => {
        if (!p.type) return p;
        
        let soilEff = p.soil / 100;
        if (almanac.botanist) soilEff *= 1.2; // PERK: Better soil efficiency

        let mult = weather.speed * soilEff;
        if (event.type === 'LADYBUG') mult *= 3;
        
        const growth = (water > 0 || weather.id === 'RAIN') ? (100 / p.type.time) * mult : 0;
        if (weather.id !== 'RAIN') setWater(w => Math.max(0, w - 0.02));

        if (Math.min(p.progress + growth, 100) >= 100 && staff.harvester) {
          handleHarvestLogic(i, p);
          return { type: null, progress: 0, soil: Math.max(0, Math.min(100, p.soil - p.type.drain)) };
        }
        return { ...p, progress: Math.min(p.progress + growth, 100) };
      }));
    }, 1000);
    return () => clearInterval(ticker);
  }, [weather, event, water, staff.harvester, almanac]);

  const handleHarvestLogic = (i, p) => {
    const typeId = p.type.id;
    setInv(v => ({ ...v, [typeId]: v[typeId] + 1 }));
    setStats(s => ({
      ...s,
      totalHarvested: s.totalHarvested + 1,
      cropCounts: { ...s.cropCounts, [typeId]: (s.cropCounts[typeId] || 0) + 1 }
    }));

    // Hybrid logic
    let mutChance = 0.1;
    if (almanac.alchemist) mutChance = 0.15; // PERK: Higher mutation

    [i-1, i+1, i-3, i+3].forEach(n => {
      if (plots[n]?.type && plots[n].type.id !== typeId && Math.random() < mutChance) {
        setInv(v => ({ ...v, SUNGRAIN: v.SUNGRAIN + 1 }));
        setStats(s => ({ ...s, cropCounts: { ...s.cropCounts, SUNGRAIN: (s.cropCounts.SUNGRAIN || 0) + 1 } }));
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

  return (
    <GameWrap bg={weather.color}>
      <Ticker><TickerText>{event.name} | Check the 📚 Almanac for Perks!</TickerText></Ticker>

      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <b>💰 {money.toLocaleString()}g</b>
          <button onClick={() => setShowAlmanac(!showAlmanac)} style={{ background: '#5d4037', color: 'white', borderRadius: '4px', border: 'none', padding: '5px 10px' }}>📚 Almanac</button>
        </div>
        <Meter color="#2196f3" val={water}><div /></Meter>
        <button onClick={() => {
            let gain = 0;
            const mod = event.type === 'CRASH' ? 0.5 : 1;
            Object.entries(inv).forEach(([id, count]) => gain += count * (CROPS[id]?.price || 0) * mod);
            setMoney(m => m + gain);
            setStats(s => ({ ...s, totalGold: s.totalGold + gain }));
            setInv({ WHEAT: 0, CORN: 0, SUNGRAIN: 0 });
        }} style={{ width: '100%', marginTop: '10px', background: '#2e7d32', color: 'white', padding: '10px' }}>SELL ALL HARVEST</button>
      </Section>

      {showAlmanac && (
        <Section style={{ background: '#fff9c4' }}>
          <h4 style={{margin: '0 0 10px 0'}}>📚 Mastery Rewards</h4>
          <div style={{fontSize: '13px'}}>
            <p>{almanac.botanist ? "✅" : "❌"} <b>Botanist:</b> Harvest 100 Wheat (+20% Soil Speed)</p>
            <p>{almanac.merchant ? "✅" : "❌"} <b>Merchant:</b> 10k Gold Earned (-5s Market Events)</p>
            <p>{almanac.alchemist ? "✅" : "❌"} <b>Alchemist:</b> 5 SunGrains Found (+5% Mutation)</p>
          </div>
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

      <Section style={{fontSize: '12px', textAlign: 'center'}}>
        🌾 {inv.WHEAT} | 🌽 {inv.CORN} | ✨ {inv.SUNGRAIN}
      </Section>
    </GameWrap>
  );
}