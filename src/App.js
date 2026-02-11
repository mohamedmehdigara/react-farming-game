import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const sparkle = keyframes` 0% { filter: brightness(1); } 50% { filter: brightness(1.4) saturate(1.5); } 100% { filter: brightness(1); } `;

const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, basePrice: 25, time: 8, drain: 15 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, basePrice: 100, time: 15, drain: 25 },
  GOLD_WHEAT: { id: 'GOLD_WHEAT', icon: '✨🌾', basePrice: 250 },
  GOLD_CORN: { id: 'GOLD_CORN', icon: '✨🌽', basePrice: 1000 }
};

const WEATHER_TYPES = {
  CLEAR: { id: 'CLEAR', icon: '☀️', color: '#f1f8e9', speed: 1 },
  RAIN: { id: 'RAIN', icon: '🌧️', color: '#e3f2fd', speed: 2 }
};

// --- Styled Components ---
const GameWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; min-height: 100vh;
  background: ${props => props.isNight ? '#0d1117' : props.weatherColor}; 
  color: ${props => props.isNight ? '#c9d1d9' : '#24292e'};
  transition: 1s; padding: 15px; font-family: 'Segoe UI', sans-serif;
`;

const Section = styled.div`
  background: ${props => props.dark ? 'rgba(22, 27, 34, 0.9)' : 'rgba(255,255,255,0.9)'};
  border: 1px solid #ccc; border-radius: 12px; width: 100%; max-width: 440px; padding: 15px; margin-bottom: 10px;
`;

const PlotGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); 
  gap: 10px; width: 100%; max-width: 440px;
`;

const Plot = styled.div`
  aspect-ratio: 1/1; 
  background: ${props => props.isGreenhouse ? '#c8e6c9' : (props.isSuper ? '#5d4037' : '#f6f8fa')}; 
  border: 2px solid ${props => props.isGreenhouse ? '#4caf50' : (props.isGolden ? '#ffd700' : 'rgba(0,0,0,0.1)')}; 
  border-radius: 12px; position: relative; display: flex; flex-direction: column; 
  align-items: center; justify-content: center; cursor: pointer; overflow: hidden;
  animation: ${props => props.isGolden ? sparkle : 'none'} 2s infinite;
`;

const Badge = styled.div`
  position: absolute; ${props => props.side}: 4px; top: 4px; font-size: 9px; 
  font-weight: bold; background: rgba(0,0,0,0.6); color: white; 
  padding: 1px 4px; border-radius: 3px; z-index: 5;
`;

const ActionBtn = styled.button`
  background: ${props => props.active ? '#2ea44f' : (props.color || '#30363d')}; color: white;
  border: none; padding: 5px; border-radius: 5px; font-size: 10px; cursor: pointer; margin: 1px;
  flex: 1; min-width: 32px;
`;

const Meter = styled.div`
  width: 80%; height: 5px; background: rgba(0,0,0,0.1); border-radius: 10px; 
  margin: 2px 0; overflow: hidden;
  & > div { height: 100%; width: ${props => props.val}%; background: ${props => props.color}; transition: width 0.3s; }
`;

export default function App() {
  const [money, setMoney] = useState(1000);
  const [inv, setInv] = useState({ WHEAT: 0, CORN: 0, GOLD_WHEAT: 0, GOLD_CORN: 0, COMPOST: 0, SCARECROW: 0 });
  const [vault, setVault] = useState({ WHEAT: 0, CORN: 0 });
  const [market, setMarket] = useState({ WHEAT: 1, CORN: 1 });
  const [tech, setTech] = useState({ scientist: false, sprinkler: false });
  const [weather, setWeather] = useState(WEATHER_TYPES.CLEAR);
  const [isNight, setIsNight] = useState(false);
  const [plots, setPlots] = useState(Array(9).fill({ 
    type: null, progress: 0, soil: 100, isSuper: false, 
    isGolden: false, isScarecrow: false, isGreenhouse: false, timeLeft: 0 
  }));
  const [uiState, setUiState] = useState('farm');

  // --- Market Logic ---
  const getPrice = (id) => {
    let base = CROPS[id].basePrice;
    let mastery = vault[id] >= 10 ? 1.1 : 1;
    let marketMod = market[id] || 1;
    return Math.floor(base * mastery * marketMod);
  };

  const handleCycle = () => {
    if (isNight) {
      setMarket({ WHEAT: 0.8 + Math.random() * 0.4, CORN: 0.8 + Math.random() * 0.4 });
      setWeather(Math.random() > 0.7 ? WEATHER_TYPES.RAIN : WEATHER_TYPES.CLEAR);
    }
    setIsNight(!isNight);
  };

  // --- Actions ---
  const applyItem = (i, key) => {
    if (inv[key] > 0) {
      setInv(v => ({ ...v, [key]: v[key] - 1 }));
      setPlots(ps => ps.map((p, idx) => idx === i ? (key === 'SCARECROW' ? { ...p, isScarecrow: true } : { ...p, isSuper: true, soil: 100 }) : p));
    }
  };

  const harvest = (i) => {
    const p = plots[i];
    if (p.isScarecrow) {
      setInv(v => ({ ...v, SCARECROW: v.SCARECROW + 1 }));
      setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, isScarecrow: false } : x));
      return;
    }
    const type = p.isGolden ? `GOLD_${p.type.id}` : p.type.id;
    setInv(v => ({ ...v, [type]: v[type] + 1 }));
    setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: null, progress: 0, isSuper: false, isGolden: false, soil: Math.max(0, p.soil - p.type.drain) } : x));
  };

  // --- Game Loop ---
  useEffect(() => {
    const ticker = setInterval(() => {
      setPlots(current => current.map(p => {
        let s = p.soil;
        if (!p.type && s < 100) s = Math.min(100, s + 1);
        if (tech.sprinkler || weather.id === 'RAIN') s = Math.min(100, s + 5);

        if (!p.type || p.progress >= 100 || p.isScarecrow) return { ...p, soil: s };

        const growth = (100 / p.type.time) * (p.isSuper ? 2 : 1) * (isNight ? 0.5 : 1) * weather.speed * (s / 100);
        const nextP = Math.min(100, p.progress + growth);
        return { ...p, progress: nextP, soil: s, timeLeft: Math.ceil((100 - nextP) / growth), isGolden: p.isGolden || (nextP >= 100 && Math.random() < 0.1) };
      }));
    }, 1000);
    return () => clearInterval(ticker);
  }, [isNight, weather, tech.sprinkler]);

  return (
    <GameWrap isNight={isNight} weatherColor={weather.color}>
      <Section dark={isNight}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <b>💰 {money.toLocaleString()}</b>
          <span>{weather.icon} {weather.id}</span>
          <ActionBtn color="#f39c12" onClick={handleCycle}>{isNight ? '☀️' : '🌙'}</ActionBtn>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['farm', 'barn', 'shop'].map(m => <ActionBtn key={m} active={uiState === m} onClick={() => setUiState(m)}>{m.toUpperCase()}</ActionBtn>)}
        </div>
      </Section>

      {uiState === 'farm' && (
        <PlotGrid>
          {plots.map((p, i) => (
            <Plot key={i} isSuper={p.isSuper} isGolden={p.isGolden} isGreenhouse={p.isGreenhouse} onClick={() => (p.progress >= 100 || p.isScarecrow) && harvest(i)}>
              <Badge side="left" style={{background: '#795548'}}>S:{Math.floor(p.soil)}%</Badge>
              {tech.scientist && p.type && p.progress < 100 && <Badge side="right">{p.timeLeft}s</Badge>}
              
              {p.isScarecrow ? <span style={{fontSize: '30px'}}>👤</span> : p.type ? (
                <>
                  <span style={{fontSize: '28px'}}>{p.progress >= 100 ? (p.isGolden ? '⭐' : p.type.icon) : '🌱'}</span>
                  <Meter val={p.progress} color={p.isGolden ? '#ffd700' : '#4caf50'}><div /></Meter>
                </>
              ) : (
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                  <ActionBtn onClick={(e) => { e.stopPropagation(); if(money>=10){setMoney(m=>m-10); setPlots(ps=>ps.map((x,idx)=>idx===i?{...x, type:CROPS.WHEAT, progress:0}:x))} }}>🌾</ActionBtn>
                  <ActionBtn onClick={(e) => { e.stopPropagation(); if(money>=40){setMoney(m=>m-40); setPlots(ps=>ps.map((x,idx)=>idx===i?{...x, type:CROPS.CORN, progress:0}:x))} }}>🌽</ActionBtn>
                  {inv.COMPOST > 0 && <ActionBtn color="#795548" onClick={(e) => { e.stopPropagation(); applyItem(i, 'COMPOST') }}>💩</ActionBtn>}
                  {inv.SCARECROW > 0 && <ActionBtn color="#5c6bc0" onClick={(e) => { e.stopPropagation(); applyItem(i, 'SCARECROW') }}>👤</ActionBtn>}
                  {!p.isGreenhouse && money >= 1500 && <ActionBtn color="#4caf50" onClick={(e) => { e.stopPropagation(); setMoney(m=>m-1500); setPlots(ps=>ps.map((x,idx)=>idx===i?{...x, isGreenhouse:true}:x)) }}>🏠</ActionBtn>}
                </div>
              )}
              <div style={{position:'absolute', bottom:0, width:'100%', height:'3px', background:'#a1887f', opacity:0.5, width:`${p.soil}%`}} />
            </Plot>
          ))}
        </PlotGrid>
      )}

      {uiState === 'barn' && (
        <Section dark={isNight}>
          <div style={{background:'rgba(0,0,0,0.1)', padding:'8px', borderRadius:'8px', marginBottom:'10px'}}>
            <small>MARKET: WHEAT {Math.round(market.WHEAT*100)}% | CORN {Math.round(market.CORN*100)}%</small>
          </div>
          <p>🌾: {inv.WHEAT} (@{getPrice('WHEAT')}g) | 🌽: {inv.CORN} (@{getPrice('CORN')}g)</p>
          <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
             <ActionBtn disabled={inv.WHEAT < 10} onClick={() => { setInv(v=>({...v, WHEAT: v.WHEAT-10})); setVault(v=>({...v, WHEAT:10})) }}>Bank 10 🌾</ActionBtn>
             <ActionBtn disabled={inv.CORN < 10} onClick={() => { setInv(v=>({...v, CORN: v.CORN-10})); setVault(v=>({...v, CORN:10})) }}>Bank 10 🌽</ActionBtn>
          </div>
          <ActionBtn color="#2ea44f" style={{width:'100%', padding:'12px'}} onClick={() => {
            setMoney(m => m + (inv.WHEAT * getPrice('WHEAT')) + (inv.CORN * getPrice('CORN')) + (inv.GOLD_WHEAT * 250) + (inv.GOLD_CORN * 1000));
            setInv(v => ({ ...v, WHEAT: 0, CORN: 0, GOLD_WHEAT: 0, GOLD_CORN: 0 }));
          }}>SELL ALL</ActionBtn>
        </Section>
      )}

      {uiState === 'shop' && (
        <Section dark={isNight}>
          <h3>Shop</h3>
          {!tech.scientist && <ActionBtn color="#673ab7" onClick={() => { if(money>=2000){setMoney(m=>m-2000); setTech(t=>({...t, scientist:true}))} }}>Scientist (2,000g)</ActionBtn>}
          <ActionBtn active={tech.sprinkler} onClick={() => { if(money>=1000){setMoney(m=>m-1000); setTech(t=>({...t, sprinkler:true}))} }}>Sprinklers (1,000g)</ActionBtn>
          <ActionBtn onClick={() => { if(money>=300){setMoney(m=>m-300); setInv(v=>({...v, SCARECROW: v.SCARECROW+1}))} }}>Scarecrow (300g)</ActionBtn>
          <ActionBtn onClick={() => { if(money>=150){setMoney(m=>m-150); setInv(v=>({...v, COMPOST: v.COMPOST+1}))} }}>Compost (150g)</ActionBtn>
        </Section>
      )}
    </GameWrap>
  );
}