import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// --- 1. CONSTANTS & CONFIG (Separated from Logic) ---
const TICK_RATE = 1000;
const INITIAL_MONEY = 1000;
const PLOT_COUNT = 9;

const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, basePrice: 25, time: 8, drain: 15 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, basePrice: 100, time: 15, drain: 25 },
};

// --- 2. CUSTOM HOOK: The "Brain" of the Farm ---
// This is what makes it "Mid-Level". Logic is decoupled from the View.
function useGameEngine() {
  const [money, setMoney] = useState(INITIAL_MONEY);
  const [inventory, setInventory] = useState({ WHEAT: 0, CORN: 0, GOLD_WHEAT: 0, GOLD_CORN: 0, SCARECROW: 0 });
  const [plots, setPlots] = useState(Array(PLOT_COUNT).fill({ 
    type: null, progress: 0, soil: 100, isGolden: false, isScarecrow: false 
  }));
  const [isNight, setIsNight] = useState(false);

  // Memoized derived state (Performance optimization)
  const totalAssets = useMemo(() => {
    return money + Object.values(inventory).reduce((a, b) => a + b, 0);
  }, [money, inventory]);

  const plant = useCallback((index, cropId) => {
    const crop = CROPS[cropId];
    if (money >= crop.cost) {
      setMoney(m => m - crop.cost);
      setPlots(prev => prev.map((p, i) => i === index ? { ...p, type: crop, progress: 0 } : p));
    }
  }, [money]);

  const harvest = useCallback((index) => {
    setPlots(prev => {
      const newPlots = [...prev];
      const p = newPlots[index];
      if (!p.type && !p.isScarecrow) return prev;

      if (p.isScarecrow) {
        setInventory(inv => ({ ...inv, SCARECROW: inv.SCARECROW + 1 }));
        newPlots[index] = { ...p, isScarecrow: false };
      } else {
        const cropKey = p.isGolden ? `GOLD_${p.type.id}` : p.type.id;
        setInventory(inv => ({ ...inv, [cropKey]: (inv[cropKey] || 0) + 1 }));
        newPlots[index] = { ...p, type: null, progress: 0, isGolden: false, soil: Math.max(0, p.soil - p.type.drain) };
      }
      return newPlots;
    });
  }, []);

  // Centralized Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setPlots(current => current.map(p => {
        if (!p.type || p.progress >= 100 || p.isScarecrow) {
            return !p.type && p.soil < 100 ? { ...p, soil: p.soil + 1 } : p;
        }
        const growth = (100 / p.type.time) * (isNight ? 0.5 : 1) * (p.soil / 100);
        const nextP = Math.min(100, p.progress + growth);
        return { ...p, progress: nextP, isGolden: p.isGolden || (nextP >= 100 && Math.random() < 0.1) };
      }));
    }, TICK_RATE);
    return () => clearInterval(timer);
  }, [isNight]);

  return { money, setMoney, inventory, setInventory, plots, isNight, setIsNight, plant, harvest, totalAssets };
}

// --- 3. STYLED COMPONENTS (The Design System) ---
const Container = styled.div`
  max-width: 480px; margin: 0 auto; padding: 20px; font-family: system-ui;
  background: ${props => props.dark ? '#1a1a1a' : '#f0f4f0'};
  color: ${props => props.dark ? '#fff' : '#333'};
  min-height: 100vh; transition: background 0.5s;
`;

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 20px;
`;

const PlotCard = styled.div`
  aspect-ratio: 1; border-radius: 12px; background: ${props => props.dark ? '#333' : '#fff'};
  border: 2px solid ${props => props.gold ? '#ffd700' : 'transparent'};
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer; position: relative;
`;

const ProgressBar = styled.div`
  width: 80%; height: 6px; background: #eee; border-radius: 3px; margin-top: 8px; overflow: hidden;
  &:after { content: ''; display: block; height: 100%; width: ${props => props.progress}%; background: #4caf50; transition: width 0.3s; }
`;

// --- 4. SUB-COMPONENTS (Component Atomization) ---
const StatBar = ({ money, isNight, onToggleNight }) => (
  <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h2>💰 {money.toLocaleString()}</h2>
    <button onClick={onToggleNight} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer' }}>
      {isNight ? '🌙 Night' : '☀️ Day'}
    </button>
  </header>
);

// --- 5. MAIN COMPONENT (The Orchestrator) ---
export default function App() {
  const { money, setMoney, inventory, plots, isNight, setIsNight, plant, harvest } = useGameEngine();
  const [view, setView] = useState('farm');

  return (
    <Container dark={isNight}>
      <StatBar money={money} isNight={isNight} onToggleNight={() => setIsNight(!isNight)} />
      
      <nav style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button onClick={() => setView('farm')}>Farm</button>
        <button onClick={() => setView('barn')}>Barn</button>
      </nav>

      {view === 'farm' ? (
        <Grid>
          {plots.map((p, i) => (
            <PlotCard key={i} dark={isNight} gold={p.isGolden} onClick={() => p.progress >= 100 && harvest(i)}>
              {p.type ? (
                <>
                  <span style={{ fontSize: '2rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</span>
                  <ProgressBar progress={p.progress} />
                </>
              ) : (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={(e) => { e.stopPropagation(); plant(i, 'WHEAT'); }}>🌾</button>
                  <button onClick={(e) => { e.stopPropagation(); plant(i, 'CORN'); }}>🌽</button>
                </div>
              )}
              <small style={{ position: 'absolute', bottom: '5px', fontSize: '10px' }}>Soil: {p.soil}%</small>
            </PlotCard>
          ))}
        </Grid>
      ) : (
        <div style={{ background: 'white', color: 'black', padding: '20px', borderRadius: '12px' }}>
          <h3>Inventory</h3>
          <p>Wheat: {inventory.WHEAT} | Corn: {inventory.CORN}</p>
          <button onClick={() => {
            const sale = (inventory.WHEAT * 25) + (inventory.CORN * 100);
            setMoney(m => m + sale);
            // In a mid-level app, you'd use a single "resetInventory" function
          }}>Sell All</button>
        </div>
      )}
    </Container>
  );
}