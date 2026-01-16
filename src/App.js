import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Constants ---
const CROPS = {
  WHEAT: { id: 'WHEAT', name: 'Wheat', cost: 10, basePrice: 25, growthTime: 5, xp: 15, minLevel: 1, icon: '🌾' },
  CORN: { id: 'CORN', name: 'Corn', cost: 40, basePrice: 100, growthTime: 12, xp: 45, minLevel: 3, icon: '🌽' },
  CARROT: { id: 'CARROT', name: 'Carrot', cost: 100, basePrice: 300, growthTime: 25, xp: 120, minLevel: 5, icon: '🥕' },
};

const WEATHER = {
  SUNNY: { label: 'Sunny', mult: 1, color: '#FFF9C4', icon: '☀️' },
  RAIN: { label: 'Rain', mult: 2, color: '#B3E5FC', icon: '🌧️' },
  HEAT: { label: 'Heatwave', mult: 0.5, color: '#FFCCBC', icon: '🔥' },
};

// --- Animations ---
const sparkle = keyframes`
  0% { filter: brightness(1) drop-shadow(0 0 0 gold); }
  50% { filter: brightness(1.5) drop-shadow(0 0 10px gold); }
  100% { filter: brightness(1) drop-shadow(0 0 0 gold); }
`;

// --- Styled Components ---
const GameContainer = styled.div`
  display: flex; flex-direction: column; align-items: center;
  font-family: 'Segoe UI', sans-serif; background-color: ${props => props.bgColor};
  transition: background-color 2s ease; min-height: 100vh; padding: 15px;
`;

const Section = styled.div`
  background: white; border: 3px solid #5d4037; border-radius: 12px;
  width: 100%; max-width: 450px; padding: 12px; margin-bottom: 12px; box-shadow: 0 4px 0 #5d4037;
`;

const TrophyRack = styled.div`
  display: flex; gap: 8px; justify-content: center; margin-top: 10px; flex-wrap: wrap;
`;

const Trophy = styled.div`
  font-size: 20px; filter: ${props => props.unlocked ? 'none' : 'grayscale(1) opacity(0.3)'};
  background: #f5f5f5; padding: 5px; border-radius: 50%; border: 2px solid #ddd;
  transition: all 0.5s ease;
`;

const Plot = styled.div`
  aspect-ratio: 1/1; background: ${props => props.isReady ? '#aed581' : '#8d6e63'};
  border: 4px solid ${props => props.isGolden ? '#ffd700' : '#5d4037'};
  border-radius: 10px; position: relative; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  animation: ${props => props.isGolden ? sparkle : 'none'} 1s infinite;
`;

const GoldenTag = styled.div`
  position: absolute; top: -10px; background: gold; color: #5d4037;
  font-size: 9px; font-weight: bold; padding: 2px 5px; border-radius: 5px; border: 1px solid #5d4037;
`;

const Button = styled.button`
  background: ${props => props.variant === 'prestige' ? '#673ab7' : props.primary ? '#388e3c' : '#5d4037'};
  color: white; border: none; padding: 10px 15px; border-radius: 8px; font-weight: bold; cursor: pointer;
  &:disabled { opacity: 0.3; }
`;

// --- Main App ---
export default function App() {
  const [money, setMoney] = useState(() => JSON.parse(localStorage.getItem('zf-v8-money')) ?? 50);
  const [xp, setXp] = useState(() => JSON.parse(localStorage.getItem('zf-v8-xp')) ?? 0);
  const [multiplier, setMultiplier] = useState(() => JSON.parse(localStorage.getItem('zf-v8-mult')) ?? 1);
  const [inventory, setInventory] = useState(() => JSON.parse(localStorage.getItem('zf-v8-inv')) ?? { WHEAT: 0, CORN: 0, CARROT: 0 });
  const [plots, setPlots] = useState(() => JSON.parse(localStorage.getItem('zf-v8-plots')) ?? Array(9).fill(null));
  const [hasAuto, setHasAuto] = useState(() => JSON.parse(localStorage.getItem('zf-v8-auto')) ?? false);
  const [weather, setWeather] = useState('SUNNY');
  const [market, setMarket] = useState({ WHEAT: 25, CORN: 100, CARROT: 300 });

  const level = Math.floor(xp / 250) + 1;
  const netWorth = Math.floor(money + Object.keys(inventory).reduce((acc, k) => acc + (inventory[k] * market[k] * multiplier), 0));

  // Trophies Logic
  const trophies = useMemo(() => [
    { id: 'rich', icon: '💰', label: 'Millionaire', hint: '10k Net Worth', unlocked: netWorth >= 10000 },
    { id: 'prestige', icon: '👑', label: 'Royal Lineage', hint: 'Prestige once', unlocked: multiplier > 1 },
    { id: 'automation', icon: '🤖', label: 'Robo-Farm', hint: 'Buy Drone', unlocked: hasAuto },
    { id: 'expert', icon: '🎓', label: 'Master', hint: 'Level 10', unlocked: level >= 10 },
  ], [netWorth, multiplier, hasAuto, level]);

  useEffect(() => {
    localStorage.setItem('zf-v8-money', JSON.stringify(money));
    localStorage.setItem('zf-v8-xp', JSON.stringify(xp));
    localStorage.setItem('zf-v8-mult', JSON.stringify(multiplier));
    localStorage.setItem('zf-v8-inv', JSON.stringify(inventory));
    localStorage.setItem('zf-v8-plots', JSON.stringify(plots));
    localStorage.setItem('zf-v8-auto', JSON.stringify(hasAuto));
  }, [money, xp, multiplier, inventory, plots, hasAuto]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() < 0.1) setWeather(Object.keys(WEATHER)[Math.floor(Math.random() * 3)]);
      
      setPlots(prev => prev.map((p, i) => {
        if (!p) return null;
        
        // Random Golden Event (0.5% chance per tick for non-golden growing crops)
        if (!p.isGolden && p.progress < 100 && Math.random() < 0.005) {
          return { ...p, isGolden: true };
        }

        const inc = (100 / p.type.growthTime) * WEATHER[weather].mult;
        const newProg = Math.min(p.progress + inc, 100);

        if (newProg === 100 && hasAuto && !p.hasPest) {
          const goldBonus = p.isGolden ? 10 : 1;
          setXp(v => v + (p.type.xp * multiplier * goldBonus));
          if (p.isGolden) setMoney(m => m + (p.type.basePrice * multiplier * 10)); // Instant cash for gold auto-harvest
          else setInventory(inv => ({ ...inv, [p.type.id]: inv[p.type.id] + 1 }));
          return null;
        }
        return { ...p, progress: newProg };
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [weather, hasAuto, multiplier]);

  const handleHarvest = (p, i) => {
    const goldBonus = p.isGolden ? 10 : 1;
    setXp(v => v + (p.type.xp * multiplier * goldBonus));
    if (p.isGolden) {
        setMoney(m => m + (p.type.basePrice * multiplier * goldBonus));
    } else {
        setInventory(inv => ({ ...inv, [p.type.id]: inv[p.type.id] + 1 }));
    }
    setPlots(ps => ps.map((x, idx) => idx === i ? null : x));
  };

  return (
    <GameContainer bgColor={WEATHER[weather].color}>
      <Section style={{ background: '#5d4037', color: 'white', textAlign: 'center' }}>
        <h2 style={{ margin: 0 }}>Zen Farmer Gen. {multiplier}</h2>
        <TrophyRack>
          {trophies.map(t => <Trophy key={t.id} unlocked={t.unlocked} title={`${t.label}: ${t.hint}`}>{t.icon}</Trophy>)}
        </TrophyRack>
      </Section>

      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span>{WEATHER[weather].icon} {WEATHER[weather].label}</span>
          <span>💰 {money}g | Level {level}</span>
        </div>
      </Section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%', maxWidth: '400px' }}>
        {plots.map((p, i) => (
          <Plot key={i} isGolden={p?.isGolden} isReady={p?.progress === 100} onClick={() => p?.progress === 100 && handleHarvest(p, i)}>
            {p?.isGolden && <GoldenTag>10X GOLD</GoldenTag>}
            {p ? (
              <span style={{ fontSize: '2.5rem' }}>{p.progress === 100 ? CROPS[p.type.id].icon : '🌱'}</span>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {Object.values(CROPS).map(c => (
                  <button key={c.id} onClick={() => setPlots(ps => ps.map((x, idx) => idx === i ? { type: c, progress: 0, isGolden: false } : x))} disabled={level < c.minLevel || money < c.cost} style={{ fontSize: '9px' }}>{c.icon}</button>
                ))}
              </div>
            )}
          </Plot>
        ))}
      </div>

      <Section style={{ marginTop: '15px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>BARN (STOCK)</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '10px 0' }}>
          {Object.keys(inventory).map(id => <div key={id}>{CROPS[id].icon} {inventory[id]}</div>)}
        </div>
        <Button primary style={{ width: '100%' }} onClick={() => {
          let total = 0;
          Object.keys(inventory).forEach(id => total += inventory[id] * market[id] * multiplier);
          setMoney(m => m + total);
          setInventory({ WHEAT: 0, CORN: 0, CARROT: 0 });
        }}>Sell for {Object.keys(inventory).reduce((acc, k) => acc + (inventory[k] * market[k] * multiplier), 0)}g</Button>
      </Section>

      <Button variant="prestige" disabled={netWorth < 10000} onClick={() => {
         setMultiplier(m => m + 1); setMoney(50); setXp(0); setPlots(Array(9).fill(null)); setHasAuto(false);
      }} style={{ width: '100%', maxWidth: '450px' }}>
        {netWorth < 10000 ? 'Ascension Requires 10k Worth' : '🚀 ASCEND TO NEXT GEN'}
      </Button>
    </GameContainer>
  );
}