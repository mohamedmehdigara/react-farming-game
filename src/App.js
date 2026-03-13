import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';

// --- Constants ---
const TICK_RATE = 1000;
const MILL_TIME = 10;
const SEASONS = [
  { name: 'Spring', color: '#dcfce7', icon: '🌸', growthMod: 1.2, drainMod: 0.8 },
  { name: 'Summer', color: '#fef3c7', icon: '☀️', growthMod: 1.5, drainMod: 1.5 },
  { name: 'Fall', color: '#ffedd5', icon: '🍂', growthMod: 1.0, drainMod: 1.0 },
  { name: 'Winter', color: '#f1f5f9', icon: '❄️', growthMod: 0.2, drainMod: 0.5 }
];

const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', basePrice: 25, cost: 10, time: 8, drain: 15, xp: 10 },
  CORN: { id: 'CORN', icon: '🌽', basePrice: 100, cost: 40, time: 15, drain: 25, xp: 30 },
  FLOUR: { id: 'FLOUR', icon: '🥖', basePrice: 150, sell: 150, xp: 50 }
};

function useGameEngine() {
  const [money, setMoney] = useState(1000);
  const [inventory, setInventory] = useState({ WHEAT: 0, CORN: 0, FLOUR: 0 });
  const [plots, setPlots] = useState(Array(9).fill({ type: null, progress: 0, soil: 100 }));
  const [mill, setMill] = useState({ active: false, progress: 0, timeLeft: 0 });
  const [messages, setMessages] = useState([]);
  const [barnLevel, setBarnLevel] = useState(1);
  const [hasFarmhand, setHasFarmhand] = useState(false);
  const [xp, setXp] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const [warpTimeLeft, setWarpTimeLeft] = useState(0);
  const [marketModifiers, setMarketModifiers] = useState({ WHEAT: 1, CORN: 1, FLOUR: 1 });

  // --- NEW: Weather & Season State ---
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [seasonTimeLeft, setSeasonTimeLeft] = useState(60);
  const [weather, setWeather] = useState({ type: 'Clear', icon: '☀️', mod: 1 });

  const currentSeason = SEASONS[seasonIndex];
  const playerLevel = useMemo(() => Math.floor(xp / 100) + 1, [xp]);
  const xpInCurrentLevel = xp % 100;
  const maxCapacity = barnLevel * 20;
  const currentStock = useMemo(() => inventory.WHEAT + inventory.CORN + inventory.FLOUR, [inventory]);

  const addLog = useCallback((text, type = 'info') => {
    const id = Date.now();
    setMessages(prev => [{ id, text, type }, ...prev].slice(0, 3));
    setTimeout(() => setMessages(prev => prev.filter(m => m.id !== id)), 4000);
  }, []);

  // 1. Season & Weather Controller
  useEffect(() => {
    const envTicker = setInterval(() => {
      setSeasonTimeLeft(t => {
        if (t <= 1) {
          setSeasonIndex(prev => (prev + 1) % 4);
          addLog(`Season changed to ${SEASONS[(seasonIndex + 1) % 4].name}!`, "warn");
          return 60;
        }
        return t - 1;
      });

      // Random Weather Logic (10% chance to change every second)
      if (Math.random() < 0.1) {
        const weathers = [
          { type: 'Clear', icon: '☀️', mod: 1 },
          { type: 'Rain', icon: '🌧️', mod: 0.5 }, // Helps soil, slows growth slightly
          { type: 'Heatwave', icon: '🔥', mod: 2 }   // Drains soil fast
        ];
        const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
        setWeather(newWeather);
      }
    }, 1000);
    return () => clearInterval(envTicker);
  }, [seasonIndex, addLog]);

  // 2. Market Logic (Kept from previous)
  useEffect(() => {
    const marketTicker = setInterval(() => {
      setMarketModifiers({
        WHEAT: Number((0.5 + Math.random() * 1).toFixed(2)),
        CORN: Number((0.7 + Math.random() * 0.8).toFixed(2)),
        FLOUR: Number((0.9 + Math.random() * 0.4).toFixed(2))
      });
    }, 30000);
    return () => clearInterval(marketTicker);
  }, []);

  // 3. Time Warp Logic
  useEffect(() => {
    if (isWarping && warpTimeLeft > 0) {
      const warpTimer = setInterval(() => {
        setWarpTimeLeft(t => {
          if (t <= 1) { setIsWarping(false); return 0; }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(warpTimer);
    }
  }, [isWarping, warpTimeLeft]);

  // 4. Crop Growth Logic (Injected Season/Weather modifiers)
  useEffect(() => {
    const ticker = setInterval(() => {
      setPlots(current => current.map(p => {
        const soilRecover = weather.type === 'Rain' ? 2 : 1;
        if (!p.type || p.progress >= 100) {
          return !p.type && p.soil < 100 ? { ...p, soil: Math.min(100, p.soil + soilRecover) } : p;
        }

        const warpMult = isWarping ? 5 : 1;
        const levelBonus = 1 + (playerLevel * 0.02);
        
        // COMBINED PHYSICS: Season Growth * Level * Warp
        const growth = (100 / p.type.time) * (p.soil / 100) * levelBonus * warpMult * currentSeason.growthMod;
        
        // SOIL PHYSICS: Base Drain * Weather Modifier * Season Modifier
        const soilDrain = (p.type.drain / p.type.time) * weather.mod * currentSeason.drainMod;

        return { 
          ...p, 
          progress: Math.min(100, p.progress + growth),
          soil: Math.max(0, p.soil - (soilDrain / 10)) // Divided for smooth decay
        };
      }));
    }, TICK_RATE);
    return () => clearInterval(ticker);
  }, [playerLevel, isWarping, currentSeason, weather]);

  // 5. Mill Logic
  useEffect(() => {
    let timer;
    if (mill.active && mill.timeLeft > 0) {
      timer = setInterval(() => {
        setMill(prev => {
          if (prev.timeLeft <= 0) {
            clearInterval(timer);
            setInventory(inv => ({ ...inv, FLOUR: inv.FLOUR + 1 }));
            setXp(x => x + CROPS.FLOUR.xp);
            return { active: false, progress: 0, timeLeft: 0 };
          }
          const warpMult = isWarping ? 5 : 1;
          const nextTime = Math.max(0, prev.timeLeft - (1 * warpMult));
          return { ...prev, timeLeft: nextTime, progress: ((MILL_TIME - nextTime) / MILL_TIME) * 100 };
        });
      }, TICK_RATE);
    }
    return () => clearInterval(timer);
  }, [mill.active, isWarping]);

  // Actions (Plant, Harvest, Mill, Warp, etc. - Kept exactly the same)
  const plant = (index, cropId) => {
    const crop = CROPS[cropId];
    if (money >= crop.cost) {
      setMoney(m => m - crop.cost);
      setPlots(ps => ps.map((p, i) => i === index ? { ...p, type: crop, progress: 0 } : p));
    }
  };

  const harvest = useCallback((index) => {
    if (currentStock >= maxCapacity) { addLog("Barn Full!", "bad"); return; }
    setPlots(prev => {
      const p = prev[index];
      if (!p.type || p.progress < 100) return prev;
      setInventory(inv => ({ ...inv, [p.type.id]: (inv[p.type.id] || 0) + 1 }));
      setXp(x => x + p.type.xp);
      const next = [...prev];
      next[index] = { ...p, type: null, progress: 0 };
      return next;
    });
  }, [currentStock, maxCapacity, addLog]);

  useEffect(() => {
    if (hasFarmhand) {
      const automation = setInterval(() => {
        plots.forEach((p, i) => {
          if (p.type && p.progress >= 100 && currentStock < maxCapacity) harvest(i);
        });
      }, 2000);
      return () => clearInterval(automation);
    }
  }, [hasFarmhand, plots, currentStock, maxCapacity, harvest]);

  const startMilling = () => {
    if (inventory.WHEAT >= 5 && !mill.active) {
      setInventory(prev => ({ ...prev, WHEAT: prev.WHEAT - 5 }));
      setMill({ active: true, progress: 0, timeLeft: MILL_TIME });
    }
  };

  const triggerWarp = () => {
    if (xp >= 500 && !isWarping) {
      setXp(x => x - 500); setIsWarping(true); setWarpTimeLeft(10);
    }
  };

  return { 
    money, setMoney, inventory, setInventory, plots, plant, harvest, 
    mill, startMilling, messages, currentStock, maxCapacity, 
    barnLevel, setBarnLevel, hasFarmhand, setHasFarmhand, 
    playerLevel, xpInCurrentLevel, isWarping, warpTimeLeft, triggerWarp,
    marketModifiers, seasonTimeLeft, currentSeason, weather 
  };
}

const Container = styled.div` 
  max-width: 500px; margin: 0 auto; padding: 20px; font-family: sans-serif; 
  background: ${props => props.bg}; transition: background 2s ease; min-height: 100vh; 
`;

const Grid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; `;
const PlotUI = styled.div` background: rgba(255,255,255,0.8); border-radius: 10px; aspect-ratio: 1; border: 1px solid #e5e7eb; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; `;
const Bar = styled.div` width: 70%; height: 6px; background: #eee; border-radius: 5px; overflow: hidden; &::after { content: ''; display: block; height: 100%; width: ${props => props.val}%; background: ${props => props.color || '#10b981'}; transition: 0.3s; } `;

export default function App() {
  const e = useGameEngine();

  const handleSell = () => {
    const total = 
      (e.inventory.WHEAT * CROPS.WHEAT.basePrice * e.marketModifiers.WHEAT) + 
      (e.inventory.CORN * CROPS.CORN.basePrice * e.marketModifiers.CORN) + 
      (e.inventory.FLOUR * CROPS.FLOUR.basePrice * e.marketModifiers.FLOUR);
    e.setMoney(m => m + Math.floor(total));
    e.setInventory({ WHEAT: 0, CORN: 0, FLOUR: 0 });
  };

  return (
    <Container bg={e.currentSeason.color} style={{filter: e.isWarping ? 'hue-rotate(45deg)' : 'none'}}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{margin: 0}}>{e.currentSeason.icon} {e.currentSeason.name} ({e.seasonTimeLeft}s)</h2>
          <small>Weather: {e.weather.icon} {e.weather.type}</small>
        </div>
        <div style={{textAlign: 'right'}}>
            <b>💰 {e.money}g</b><br/>
            <small>Lvl {e.playerLevel}</small>
        </div>
      </header>

      <div style={{ minHeight: '30px', fontSize: '12px', marginTop: '10px' }}>
        {e.messages.map(m => <div key={m.id} style={{ color: m.type === 'good' ? 'green' : 'orange' }}>• {m.text}</div>)}
      </div>

      <Grid>
        {e.plots.map((p, i) => (
          <PlotUI key={i} onClick={() => p.progress >= 100 && e.harvest(i)}>
            <div style={{ position: 'absolute', top: 4, left: 4, fontSize: '9px' }}>S: {Math.floor(p.soil)}%</div>
            {p.type ? (
              <><span style={{ fontSize: '1.8rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</span><Bar val={p.progress} /></>
            ) : (
              <div style={{ display: 'flex', gap: '2px' }}><button onClick={(ev) => { ev.stopPropagation(); e.plant(i, 'WHEAT'); }}>🌾</button><button onClick={(ev) => { ev.stopPropagation(); e.plant(i, 'CORN'); }}>🌽</button></div>
            )}
          </PlotUI>
        ))}
      </Grid>

      <section style={{ background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><h4>Silo</h4><small>{e.currentStock}/{e.maxCapacity}</small></div>
        <Bar val={(e.currentStock / e.maxCapacity) * 100} color={e.currentStock >= e.maxCapacity ? "red" : "#3b82f6"} style={{width: '100%', height: '8px'}} />
        
        <div style={{fontSize: '11px', margin: '10px 0', background: '#f8fafc', padding: '5px'}}>
          <strong>Market Prices:</strong> 🌾{Math.floor(CROPS.WHEAT.basePrice * e.marketModifiers.WHEAT)}g | 🌽{Math.floor(CROPS.CORN.basePrice * e.marketModifiers.CORN)}g
        </div>

        <div style={{ marginTop: '10px', padding: '10px', background: '#fffbeb', borderRadius: '8px' }}>
          <strong>🏗️ The Mill</strong>
          {e.mill.active ? <Bar val={e.mill.progress} color="#f59e0b" style={{ width: '100%' }} /> : <button onClick={e.startMilling} disabled={e.inventory.WHEAT < 5} style={{width:'100%'}}>Process 5 Wheat</button>}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <button onClick={handleSell} style={{flex:2, padding:'10px', background:'#10b981', color:'white', border:'none', cursor:'pointer'}}>Sell All</button>
          <button onClick={() => { const cost = e.barnLevel * 500; if(e.money >= cost) { e.setMoney(m=>m-cost); e.setBarnLevel(l=>l+1); } }} style={{flex:1}}>Expand Silo</button>
        </div>

        <button onClick={e.triggerWarp} disabled={e.isWarping} style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '5px' }}>
          {e.isWarping ? `WARPING (${e.warpTimeLeft}s)` : '🚀 TIME WARP (500 XP)'}
        </button>
      </section>
    </Container>
  );
}