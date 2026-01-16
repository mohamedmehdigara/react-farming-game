import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// --- Constants ---
const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, price: 25, time: 5 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, price: 100, time: 12 },
  CARROT: { id: 'CARROT', icon: '🥕', cost: 100, price: 300, time: 25 },
  MOON_BERRY: { id: 'MOON_BERRY', icon: '🫐', cost: 0, price: 2000, time: 40, exotic: true },
};

const SEASONS = {
  SPRING: { name: 'Spring', icon: '🌸', color: '#e8f5e9', mult: 1.5, next: 'SUMMER' },
  SUMMER: { name: 'Summer', icon: '☀️', color: '#fffde7', mult: 0.8, next: 'FALL' },
  FALL: { name: 'Fall', icon: '🍂', color: '#fff3e0', mult: 1.2, next: 'WINTER' },
  WINTER: { name: 'Winter', icon: '❄️', color: '#e3f2fd', mult: 0.4, next: 'SPRING' },
};

// --- Styled Components ---
const GameWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; min-height: 100vh;
  background: ${props => props.bgColor}; transition: 2s; padding: 15px; font-family: sans-serif;
`;

const Section = styled.div`
  background: white; border: 3px solid #2e7d32; border-radius: 12px;
  width: 100%; max-width: 500px; padding: 12px; margin-bottom: 10px;
`;

const FarmGrid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; `;
const Plot = styled.div`
  aspect-ratio: 1/1; background: ${props => props.isGh ? '#c8e6c9' : '#a1887f'};
  border: ${props => props.isGh ? '4px solid #4caf50' : '3px solid #5d4037'};
  border-radius: 12px; display: flex; align-items: center; justify-content: center; position: relative;
`;

const Badge = styled.div` position: absolute; top: 2px; right: 2px; font-size: 10px; background: gold; border-radius: 4px; padding: 2px; `;

const Button = styled.button`
  background: #2e7d32; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer;
  &:disabled { opacity: 0.3; }
`;

export default function App() {
  const [money, setMoney] = useState(1000);
  const [plots, setPlots] = useState(Array(9).fill({ type: null, progress: 0, hasBee: false, isGreenhouse: false }));
  const [inv, setInv] = useState({ WHEAT: 0, CORN: 0, CARROT: 0, MOON_BERRY: 0 });
  const [season, setSeason] = useState('SPRING');
  const [airshipBusy, setAirshipBusy] = useState(false);
  const [ecoLvl, setEcoLvl] = useState(0);

  // --- Core Engine ---
  useEffect(() => {
    const timer = setInterval(() => {
      setPlots(prev => prev.map((p, i) => {
        if (!p.type) return p;
        
        // Multipliers: Season (unless Greenhouse) + Bees + Eco Restoration
        let mult = p.isGreenhouse ? 1.5 : SEASONS[season].mult;
        if (p.hasBee) mult += 0.3;
        mult += (ecoLvl * 0.05);

        const inc = (100 / p.type.time) * mult;
        return { ...p, progress: Math.min(p.progress + inc, 100) };
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [season, ecoLvl]);

  const harvest = (i) => {
    const p = plots[i];
    if (p.progress >= 100) {
      setInv(v => ({ ...v, [p.type.id]: v[p.type.id] + 1 }));
      setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: null, progress: 0 } : x));
    }
  };

  const plant = (i, crop) => {
    if (money >= crop.cost) {
      setMoney(m => m - crop.cost);
      setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: crop, progress: 0 } : x));
    }
  };

  const sendAirship = () => {
    if (inv.WHEAT >= 10 && inv.CARROT >= 5) {
      setAirshipBusy(true);
      setInv(v => ({ ...v, WHEAT: v.WHEAT - 10, CARROT: v.CARROT - 5 }));
      setTimeout(() => {
        setInv(v => ({ ...v, MOON_BERRY: v.MOON_BERRY + 3 }));
        setAirshipBusy(false);
        alert("Airship returned with Exotic Moon Berries! 🌙");
      }, 10000);
    }
  };

  const upgradePlot = (i, type) => {
    const cost = type === 'GH' ? 5000 : 1000;
    if (money >= cost) {
      setMoney(m => m - cost);
      setPlots(ps => ps.map((x, idx) => idx === i ? (type === 'GH' ? { ...x, isGreenhouse: true } : { ...x, hasBee: true }) : x));
    }
  };

  return (
    <GameWrap bgColor={ecoLvl > 5 ? '#a5d6a7' : SEASONS[season].color}>
      <Section style={{ background: '#1b5e20', color: 'white', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>💰 {money.toLocaleString()}g</span>
          <span>🌳 Eco Level: {ecoLvl}</span>
        </div>
        <h2>{SEASONS[season].icon} {SEASONS[season].name}</h2>
        <Button onClick={() => setSeason(curr => SEASONS[curr].next)}>Skip Season</Button>
      </Section>

      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><b>🚢 Airship Dock</b><br/><small>Trade 10 Wheat + 5 Carrots</small></div>
          <Button disabled={airshipBusy || inv.WHEAT < 10} onClick={sendAirship}>
            {airshipBusy ? 'Exploring...' : 'Launch Expedition'}
          </Button>
        </div>
      </Section>

      <FarmGrid>
        {plots.map((p, i) => (
          <Plot key={i} isGh={p.isGreenhouse} ready={p.progress === 100} onClick={() => p.progress === 100 && harvest(i)}>
            {p.isGreenhouse && <Badge>GH</Badge>}
            {p.hasBee && <span style={{ position: 'absolute', bottom: 2, left: 2 }}>🐝</span>}
            
            {p.type ? (
              <span style={{ fontSize: '2rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</span>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                {Object.values(CROPS).map(c => (
                  (!c.exotic || inv[c.id] > 0) && (
                    <button key={c.id} onClick={() => c.exotic ? (setInv(v=>({...v, [c.id]: v[c.id]-1})), setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: c, progress: 0 } : x))) : plant(i, c)}>
                      {c.icon}
                    </button>
                  )
                ))}
                <button onClick={() => upgradePlot(i, 'BEE')}>🐝</button>
                <button onClick={() => upgradePlot(i, 'GH')}>🏠</button>
              </div>
            )}
          </Plot>
        ))}
      </FarmGrid>

      <Section style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
          {Object.entries(inv).map(([k, v]) => v > 0 && <span key={k}>{CROPS[k].icon} x{v}</span>)}
        </div>
        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
          <Button style={{ flex: 1 }} onClick={() => {
            let t = 0;
            Object.entries(inv).forEach(([k, v]) => t += v * CROPS[k].price);
            setMoney(m => m + t); setInv({ WHEAT: 0, CORN: 0, CARROT: 0, MOON_BERRY: 0 });
          }}>Sell All</Button>
          <Button style={{ flex: 1, background: '#4527a0' }} disabled={money < 10000} onClick={() => { setMoney(m => m - 10000); setEcoLvl(e => e + 1); }}>
            Restoration (10k)
          </Button>
        </div>
      </Section>
    </GameWrap>
  );
}