import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Animations ---
const pulse = keyframes` 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } `;
const sparkle = keyframes` 0% { filter: brightness(1); } 50% { filter: brightness(1.2) saturate(1.2); } 100% { filter: brightness(1); } `;

const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, basePrice: 25, time: 8, drain: 15 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, basePrice: 100, time: 15, drain: 25 },
  SUNGRAIN: { id: 'SUNGRAIN', icon: '✨', cost: 0, basePrice: 1500, time: 30, drain: 50 }
};

// --- Styled Components ---
const GameWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; min-height: 100vh;
  background: ${props => props.isNight ? '#0d1117' : '#f1f8e9'}; 
  color: ${props => props.isNight ? '#c9d1d9' : '#24292e'};
  transition: 1.5s; padding: 15px; font-family: 'Segoe UI', Tahoma, sans-serif;
`;

const Section = styled.div`
  background: ${props => props.dark ? 'rgba(22, 27, 34, 0.9)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(12px); border: 1px solid ${props => props.dark ? '#444' : '#ccc'};
  border-radius: 16px; width: 100%; max-width: 420px; padding: 15px; margin-bottom: 12px;
`;

const PlotGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); 
  gap: 12px; width: 100%; max-width: 420px;
`;

const Plot = styled.div`
  aspect-ratio: 1/1; 
  background: ${props => props.isSaturated ? '#3e2723' : (props.isSuper ? '#5d4037' : (props.isNight ? '#1c2128' : '#f6f8fa'))}; 
  border: ${props => props.isSuper ? '3px solid #ffd700' : '1px solid rgba(0,0,0,0.1)'}; 
  border-radius: 14px; position: relative; display: flex; flex-direction: column; 
  align-items: center; justify-content: center; cursor: pointer;
  animation: ${props => props.isSuper ? sparkle : 'none'} 3s infinite;
  transition: transform 0.2s;
  &:active { transform: scale(0.95); }
`;

const Meter = styled.div`
  width: 85%; height: 6px; background: rgba(0,0,0,0.1); border-radius: 10px; margin-top: 4px; overflow: hidden;
  & > div { height: 100%; background: ${props => props.color || '#4caf50'}; width: ${props => props.val || 0}%; transition: 0.4s; }
`;

const ActionBtn = styled.button`
  background: ${props => props.active ? '#2ea44f' : (props.color || '#30363d')}; color: white;
  border: none; padding: 6px; border-radius: 6px; font-size: 11px; cursor: pointer; margin: 2px;
  flex: 1; display: flex; align-items: center; justify-content: center;
  &:disabled { opacity: 0.2; cursor: not-allowed; }
`;

const ShopItem = styled.div`
  display: flex; justify-content: space-between; align-items: center; 
  padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.1);
  &:last-child { border: none; }
`;

export default function App() {
  const [money, setMoney] = useState(() => Number(JSON.parse(localStorage.getItem('zf_money'))) || 1000);
  const [inv, setInv] = useState(() => JSON.parse(localStorage.getItem('zf_inv')) || { WHEAT: 0, CORN: 0, SUNGRAIN: 0, COMPOST: 0, KELP: 0 });
  const [plots, setPlots] = useState(() => JSON.parse(localStorage.getItem('zf_plots')) || Array(9).fill({ type: null, progress: 0, soil: 100, isSuper: false, isSaturated: false }));
  const [tech, setTech] = useState({ sprinkler: false, greenhouse: false });
  const [staff, setStaff] = useState({ harvester: false });
  const [water, setWater] = useState(100);
  const [uiState, setUiState] = useState('farm');
  const [isNight, setIsNight] = useState(false);

  // --- Logic Helpers ---
  const handleHarvest = (i, p) => {
    setInv(v => ({ ...v, [p.type.id]: (v[p.type.id] || 0) + 1 }));
    setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: null, progress: 0, isSuper: false, soil: Math.max(0, p.soil - p.type.drain) } : x));
  };

  const renewSoil = (i, type) => {
    if (inv[type] > 0) {
      setInv(v => ({ ...v, [type]: v[type] - 1 }));
      setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, isSuper: true, soil: 100 } : x));
    }
  };

  const buySupply = (type, cost) => {
    if (money >= cost) {
      setMoney(m => m - cost);
      setInv(v => ({ ...v, [type]: (v[type] || 0) + 1 }));
    }
  };

  // --- Game Loop ---
  useEffect(() => {
    const ticker = setInterval(() => {
      setWater(w => Math.max(0, Math.min(100, w + 0.2 - (tech.sprinkler ? 0.4 : 0))));

      setPlots(current => current.map((p, i) => {
        let currentSoil = p.soil || 0;
        const sprinklerActive = tech.sprinkler && water > 0;
        if (sprinklerActive) currentSoil = Math.min(100, currentSoil + 2.5);
        
        if (!p.type) return { ...p, soil: currentSoil, isSaturated: sprinklerActive };

        const isGH = tech.greenhouse && i < 4;
        const timeMod = (isNight && !isGH) ? 0.5 : 1;
        const growth = (100 / p.type.time) * timeMod * (currentSoil / 100) * (p.isSuper ? 3 : 1);
        const nextProgress = Math.min(p.progress + growth, 100);

        if (nextProgress >= 100 && staff.harvester) {
          setInv(v => ({ ...v, [p.type.id]: (v[p.type.id] || 0) + 1 }));
          return { ...p, type: null, progress: 0, isSuper: false, soil: Math.max(0, currentSoil - p.type.drain) };
        }

        return { ...p, progress: nextProgress, soil: currentSoil, isSaturated: sprinklerActive };
      }));
    }, 1000);
    return () => clearInterval(ticker);
  }, [isNight, tech, water, staff.harvester]);

  return (
    <GameWrap isNight={isNight}>
      <Section dark={isNight}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <b>💰 {money.toLocaleString()}</b>
          <b style={{ color: water < 20 ? '#ff4444' : '#2196f3' }}>💧 {Math.floor(water)}%</b>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['farm', 'barn', 'shop'].map(m => (
            <ActionBtn key={m} active={uiState === m} onClick={() => setUiState(m)}>{m.toUpperCase()}</ActionBtn>
          ))}
          <ActionBtn color="#f39c12" onClick={() => setIsNight(!isNight)}>{isNight ? '☀️' : '🌙'}</ActionBtn>
        </div>
      </Section>

      {uiState === 'farm' && (
        <>
          <PlotGrid>
            {plots.map((p, i) => (
              <Plot key={i} isNight={isNight} isSuper={p.isSuper} isSaturated={p.isSaturated} onClick={() => p.progress >= 100 && handleHarvest(i, p)}>
                {p.type ? (
                  <>
                    <span style={{ fontSize: '2.2rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</span>
                    <Meter color="#4caf50" val={p.progress}><div /></Meter>
                  </>
                ) : (
                  <div style={{ width: '100%', padding: '2px' }}>
                    <div style={{ display: 'flex' }}>
                      <ActionBtn onClick={(e) => { e.stopPropagation(); if(money>=10){setMoney(m=>m-10); setPlots(ps=>ps.map((x,idx)=>idx===i?{...x, type:CROPS.WHEAT, progress:0}:x))} }}>🌾</ActionBtn>
                      <ActionBtn onClick={(e) => { e.stopPropagation(); if(money>=40){setMoney(m=>m-40); setPlots(ps=>ps.map((x,idx)=>idx===i?{...x, type:CROPS.CORN, progress:0}:x))} }}>🌽</ActionBtn>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <ActionBtn disabled={inv.COMPOST <= 0} onClick={(e) => { e.stopPropagation(); renewSoil(i, 'COMPOST'); }}>💩 ({inv.COMPOST})</ActionBtn>
                      <ActionBtn disabled={inv.KELP <= 0} onClick={(e) => { e.stopPropagation(); renewSoil(i, 'KELP'); }}>🌿 ({inv.KELP})</ActionBtn>
                    </div>
                  </div>
                )}
                <Meter color="#795548" val={p.soil}><div /></Meter>
              </Plot>
            ))}
          </PlotGrid>
          <ActionBtn active={tech.sprinkler} style={{ width: '100%', maxWidth: '420px', marginTop: '12px', padding: '12px' }} onClick={() => setTech(t => ({...t, sprinkler: !t.sprinkler}))}>
            {tech.sprinkler ? '🚿 SPRINKLERS ACTIVE' : '🚿 START SPRINKLERS'}
          </ActionBtn>
        </>
      )}

      {uiState === 'barn' && (
        <Section dark={isNight}>
          <h3>Barn Storage</h3>
          <p>🌾 Wheat: {inv.WHEAT} | 🌽 Corn: {inv.CORN}</p>
          <ActionBtn color="#2ea44f" style={{ width: '100%' }} onClick={() => {
            setMoney(m => m + (inv.WHEAT * 25) + (inv.CORN * 100));
            setInv(v => ({ ...v, WHEAT: 0, CORN: 0 }));
          }}>SELL ALL HARVEST</ActionBtn>
        </Section>
      )}

      {uiState === 'shop' && (
        <Section dark={isNight}>
          <h3>Estate Supplies</h3>
          <ShopItem>
            <span>💩 Compost (Instant 100% Soil)</span>
            <ActionBtn onClick={() => buySupply('COMPOST', 150)}>Buy: 150g</ActionBtn>
          </ShopItem>
          <ShopItem>
            <span>🌿 Kelp (Super Growth Soil)</span>
            <ActionBtn onClick={() => buySupply('KELP', 500)}>Buy: 500g</ActionBtn>
          </ShopItem>
          <h3>Automation</h3>
          <ActionBtn disabled={staff.harvester || money < 2000} onClick={() => { setMoney(m => m - 2000); setStaff({ harvester: true }); }}>
            🤖 Buy Auto-Harvester (2,000g)
          </ActionBtn>
        </Section>
      )}
    </GameWrap>
  );
}