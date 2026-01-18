import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// --- Static Data ---
const CROP_DATA = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, price: 25, time: 5 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, price: 100, time: 12 },
  CARROT: { id: 'CARROT', icon: '🥕', cost: 100, price: 300, time: 25 },
};

const ALMANAC_GOALS = [
  { id: 'RICH', name: 'The Gilded Farmer', goal: 10000, desc: 'Accumulate 10,000g', icon: '🏆' },
  { id: 'HARVESTER', name: 'Master Reaper', goal: 100, desc: 'Harvest 100 Crops', icon: '🚜' },
  { id: 'BOTANIST', name: 'Seed Sage', goal: 50, desc: 'Plant 50 Carrots', icon: '📔' },
];

const SEASONS = {
  SPRING: { icon: '🌸', color: '#e8f5e9', mult: 1.5, next: 'SUMMER' },
  SUMMER: { icon: '☀️', color: '#fffde7', mult: 0.8, next: 'FALL' },
  FALL: { icon: '🍂', color: '#fff3e0', mult: 1.2, next: 'WINTER' },
  WINTER: { icon: '❄️', color: '#e3f2fd', mult: 0.4, next: 'SPRING' },
};

// --- Styled Components ---
const GameContainer = styled.div`
  display: flex; flex-direction: column; align-items: center; min-height: 100vh;
  background: ${props => props.bgColor}; transition: 2s; padding: 20px; font-family: 'Courier New', Courier, monospace;
`;

const Section = styled.div`
  background: #fff; border: 4px solid #3e2723; border-radius: 15px;
  width: 100%; max-width: 500px; padding: 15px; margin-bottom: 15px; box-shadow: 6px 6px 0 #3e2723;
`;

const TrophyShelf = styled.div`
  display: flex; gap: 10px; justify-content: center; margin-top: 10px;
  min-height: 40px; background: #efebe9; padding: 8px; border-radius: 8px;
`;

const FarmGrid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; `;
const Plot = styled.div`
  aspect-ratio: 1/1; background: ${props => props.ready ? '#9ccc65' : '#a1887f'};
  border: 4px solid #3e2723; border-radius: 12px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
`;

const Button = styled.button`
  background: #5d4037; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold;
  &:hover { background: #3e2723; }
  &:disabled { opacity: 0.4; }
`;

export default function App() {
  const [money, setMoney] = useState(200);
  const [plots, setPlots] = useState(Array(9).fill(null));
  const [stats, setStats] = useState({ totalHarvested: 0, totalCarrots: 0, maxMoney: 200 });
  const [unlockedTrophies, setUnlockedTrophies] = useState([]);
  const [season, setSeason] = useState('SPRING');
  const [activeTab, setActiveTab] = useState('farm');

  // --- Almanac Check ---
  useEffect(() => {
    ALMANAC_GOALS.forEach(g => {
      if (!unlockedTrophies.includes(g.id)) {
        if (g.id === 'RICH' && money >= g.goal) unlock(g.id);
        if (g.id === 'HARVESTER' && stats.totalHarvested >= g.goal) unlock(g.id);
        if (g.id === 'BOTANIST' && stats.totalCarrots >= g.goal) unlock(g.id);
      }
    });
  }, [money, stats]);

  const unlock = (id) => {
    setUnlockedTrophies(prev => [...prev, id]);
  };

  // --- Engine ---
  useEffect(() => {
    const timer = setInterval(() => {
      setPlots(prev => prev.map(p => {
        if (!p) return null;
        const masteryBonus = 1 + (unlockedTrophies.length * 0.02); // 2% faster per trophy
        const inc = (100 / p.type.time) * SEASONS[season].mult * masteryBonus;
        return { ...p, progress: Math.min(p.progress + inc, 100) };
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [season, unlockedTrophies]);

  const harvest = (i) => {
    const p = plots[i];
    if (p.progress >= 100) {
      setMoney(m => m + p.type.price);
      setStats(s => ({ ...s, totalHarvested: s.totalHarvested + 1 }));
      setPlots(ps => ps.map((x, idx) => idx === i ? null : x));
    }
  };

  const plant = (i, crop) => {
    if (money >= crop.cost) {
      setMoney(m => m - crop.cost);
      if (crop.id === 'CARROT') setStats(s => ({ ...s, totalCarrots: s.totalCarrots + 1 }));
      setPlots(ps => ps.map((x, idx) => idx === i ? { type: crop, progress: 0 } : x));
    }
  };

  return (
    <GameContainer bgColor={SEASONS[season].color}>
      <Section style={{ textAlign: 'center', background: '#3e2723', color: 'white' }}>
        <h2 style={{ margin: 0 }}>{SEASONS[season].icon} {season}</h2>
        <div style={{ fontSize: '20px', margin: '10px 0' }}>💰 {money.toLocaleString()}g</div>
        <TrophyShelf>
          {ALMANAC_GOALS.map(g => unlockedTrophies.includes(g.id) ? 
            <span key={g.id} title={g.name}>{g.icon}</span> : 
            <span key={g.id} style={{ opacity: 0.1 }}>❓</span>
          )}
        </TrophyShelf>
      </Section>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <Button onClick={() => setActiveTab('farm')}>MY FARM</Button>
        <Button onClick={() => setActiveTab('almanac')}>ALMANAC</Button>
        <Button onClick={() => setSeason(curr => SEASONS[curr].next)}>⏭️ NEXT SEASON</Button>
      </div>

      {activeTab === 'farm' ? (
        <FarmGrid>
          {plots.map((p, i) => (
            <Plot key={i} ready={p?.progress === 100} onClick={() => p?.progress === 100 && harvest(i)}>
              {p ? (
                <>
                  <span style={{ fontSize: '2rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</span>
                  <div style={{ fontSize: '10px', marginTop: '5px' }}>{Math.floor(p.progress)}%</div>
                </>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
                  {Object.values(CROP_DATA).map(c => (
                    <button key={c.id} style={{ padding: '4px' }} onClick={() => plant(i, c)} disabled={money < c.cost}>{c.icon}</button>
                  ))}
                </div>
              )}
            </Plot>
          ))}
        </FarmGrid>
      ) : (
        <Section>
          <h3>📔 THE FARMER'S ALMANAC</h3>
          {ALMANAC_GOALS.map(g => (
            <div key={g.id} style={{ padding: '10px', borderBottom: '1px solid #eee', opacity: unlockedTrophies.includes(g.id) ? 1 : 0.4 }}>
              <b>{g.icon} {g.name}</b>
              <div style={{ fontSize: '12px' }}>{g.desc}</div>
              {unlockedTrophies.includes(g.id) ? 
                <small style={{ color: 'green' }}>✓ ACHIEVED</small> : 
                <small style={{ color: '#999' }}>IN PROGRESS...</small>
              }
            </div>
          ))}
          <div style={{ marginTop: '15px', fontSize: '12px', background: '#fff9c4', padding: '10px', borderRadius: '5px' }}>
            💡 <i>Every trophy unlocked increases your global growth speed by 2%.</i>
          </div>
        </Section>
      )}
    </GameContainer>
  );
}