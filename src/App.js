import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';

// --- Constants ---
const TICK_RATE = 1000;
const MILL_TIME = 10;
const COOP_TIME = 20;
const SEASONS = [
  { name: 'Spring', color: '#dcfce7', icon: '🌸', growthMod: 1.2, drainMod: 0.8 },
  { name: 'Summer', color: '#fef3c7', icon: '☀️', growthMod: 1.5, drainMod: 1.5 },
  { name: 'Fall', color: '#ffedd5', icon: '🍂', growthMod: 1.0, drainMod: 1.0 },
  { name: 'Winter', color: '#f1f5f9', icon: '❄️', growthMod: 0.2, drainMod: 0.5 }
];

const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', basePrice: 25, cost: 10, time: 8, drain: 15, xp: 10 },
  CORN: { id: 'CORN', icon: '🌽', basePrice: 100, cost: 40, time: 15, drain: 25, xp: 30 },
  FLOUR: { id: 'FLOUR', icon: '🥖', basePrice: 150, xp: 50 },
  EGG: { id: 'EGG', icon: '🥚', basePrice: 400, xp: 100 }
};

function useGameEngine() {
  const [money, setMoney] = useState(1000);
  const [inventory, setInventory] = useState({ WHEAT: 0, CORN: 0, FLOUR: 0, EGG: 0 });
  const [plots, setPlots] = useState(Array(9).fill({ type: null, progress: 0, soil: 100 }));
  const [mill, setMill] = useState({ active: false, progress: 0, timeLeft: 0 });
  const [coop, setCoop] = useState({ hasCoop: false, active: false, progress: 0, timeLeft: 0 });
  const [messages, setMessages] = useState([]);
  const [barnLevel, setBarnLevel] = useState(1);
  const [hasFarmhand, setHasFarmhand] = useState(false);
  const [xp, setXp] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const [warpTimeLeft, setWarpTimeLeft] = useState(0);
  const [marketModifiers, setMarketModifiers] = useState({ WHEAT: 1, CORN: 1, FLOUR: 1, EGG: 1 });
  const [seasonIndex, setSeasonIndex] = useState(0);
  const [seasonTimeLeft, setSeasonTimeLeft] = useState(60);
  const [weather, setWeather] = useState({ type: 'Clear', icon: '☀️', mod: 1 });
  const [greenhousePlots, setGreenhousePlots] = useState([]);
  const [scarecrowPlots, setScarecrowPlots] = useState([]);

  const currentSeason = SEASONS[seasonIndex];
  const playerLevel = useMemo(() => Math.floor(xp / 100) + 1, [xp]);
  const xpInCurrentLevel = xp % 100;
  const maxCapacity = barnLevel * 20;
  const currentStock = useMemo(() => inventory.WHEAT + inventory.CORN + inventory.FLOUR + inventory.EGG, [inventory]);

  const addLog = useCallback((text, type = 'info') => {
    const id = Date.now();
    setMessages(prev => [{ id, text, type }, ...prev].slice(0, 3));
    setTimeout(() => setMessages(prev => prev.filter(m => m.id !== id)), 4000);
  }, []);

  // 1. Environmental & Bird Ticker
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

      if (Math.random() < 0.1) {
        const weathers = [{ type: 'Clear', icon: '☀️', mod: 1 }, { type: 'Rain', icon: '🌧️', mod: 0.5 }, { type: 'Heatwave', icon: '🔥', mod: 2 }];
        setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
      }

      if (Math.random() < 0.05) {
        setPlots(current => current.map((p, i) => {
          if (p.type && p.progress >= 100 && !scarecrowPlots.includes(i)) {
            addLog("🐦 A crow ate your crop!", "bad");
            return { ...p, type: null, progress: 0 };
          }
          return p;
        }));
      }
    }, 1000);
    return () => clearInterval(envTicker);
  }, [seasonIndex, addLog, scarecrowPlots]);

  // 2. Crop Growth Logic
  useEffect(() => {
    const ticker = setInterval(() => {
      setPlots(current => current.map((p, i) => {
        const isProtected = greenhousePlots.includes(i);
        const soilRecover = weather.type === 'Rain' ? 2 : 1;
        if (!p.type || p.progress >= 100) return !p.type && p.soil < 100 ? { ...p, soil: Math.min(100, p.soil + soilRecover) } : p;
        
        const warpMult = isWarping ? 5 : 1;
        const levelBonus = 1 + (playerLevel * 0.02);
        const effectiveGrowthMod = (isProtected && currentSeason.name === 'Winter') ? 1.0 : currentSeason.growthMod;
        const effectiveWeatherMod = (isProtected && weather.type === 'Heatwave') ? 1.0 : weather.mod;
        const growth = (100 / p.type.time) * (p.soil / 100) * levelBonus * warpMult * effectiveGrowthMod;
        const soilDrain = (p.type.drain / p.type.time) * effectiveWeatherMod * currentSeason.drainMod;

        return { ...p, progress: Math.min(100, p.progress + growth), soil: Math.max(0, p.soil - (soilDrain / 10)) };
      }));
    }, TICK_RATE);
    return () => clearInterval(ticker);
  }, [playerLevel, isWarping, currentSeason, weather, greenhousePlots]);

  // 3. Mill & Coop Logics
  useEffect(() => {
    let millTimer;
    if (mill.active && mill.timeLeft > 0) {
      millTimer = setInterval(() => {
        setMill(prev => {
          if (prev.timeLeft <= 0) {
            clearInterval(millTimer);
            setInventory(inv => ({ ...inv, FLOUR: inv.FLOUR + 1 }));
            setXp(x => x + CROPS.FLOUR.xp);
            addLog("Milling complete!", "good");
            return { active: false, progress: 0, timeLeft: 0 };
          }
          const warpMult = isWarping ? 5 : 1;
          const nextTime = Math.max(0, prev.timeLeft - (1 * warpMult));
          return { ...prev, timeLeft: nextTime, progress: ((MILL_TIME - nextTime) / MILL_TIME) * 100 };
        });
      }, TICK_RATE);
    }
    return () => clearInterval(millTimer);
  }, [mill.active, isWarping, addLog]);

  useEffect(() => {
    let coopTimer;
    if (coop.active && coop.timeLeft > 0) {
      coopTimer = setInterval(() => {
        setCoop(prev => {
          if (prev.timeLeft <= 0) {
            clearInterval(coopTimer);
            setInventory(inv => ({ ...inv, EGG: inv.EGG + 1 }));
            setXp(x => x + CROPS.EGG.xp);
            addLog("Egg produced!", "good");
            return { ...prev, active: false, progress: 0, timeLeft: 0 };
          }
          const warpMult = isWarping ? 5 : 1;
          const nextTime = Math.max(0, prev.timeLeft - (1 * warpMult));
          return { ...prev, timeLeft: nextTime, progress: ((COOP_TIME - nextTime) / COOP_TIME) * 100 };
        });
      }, TICK_RATE);
    }
    return () => clearInterval(coopTimer);
  }, [coop.active, isWarping, addLog]);

  // 4. Core Actions
  const harvest = useCallback((index) => {
    if (currentStock >= maxCapacity) { addLog("Barn Full!", "bad"); return; }
    setPlots(prev => {
      const p = prev[index];
      if (!p.type || p.progress < 100) return prev;
      setInventory(inv => ({ ...inv, [p.type.id]: (inv[p.type.id] || 0) + 1 }));
      setXp(x => x + p.type.xp);
      return prev.map((item, i) => i === index ? { ...item, type: null, progress: 0 } : item);
    });
  }, [currentStock, maxCapacity, addLog]);

  // 5. Automation & Warp Logic
  useEffect(() => {
    if (hasFarmhand) {
      const automation = setInterval(() => {
        plots.forEach((p, i) => { if (p.type && p.progress >= 100 && currentStock < maxCapacity) harvest(i); });
      }, 2000);
      return () => clearInterval(automation);
    }
  }, [hasFarmhand, plots, currentStock, maxCapacity, harvest]);

  useEffect(() => {
    if (isWarping && warpTimeLeft > 0) {
      const warpTimer = setInterval(() => setWarpTimeLeft(t => t <= 1 ? (setIsWarping(false) || 0) : t - 1), 1000);
      return () => clearInterval(warpTimer);
    }
  }, [isWarping, warpTimeLeft]);

  // 6. Market Logic
  useEffect(() => {
    const marketTicker = setInterval(() => {
      setMarketModifiers({
        WHEAT: Number((0.5 + Math.random() * 1).toFixed(2)),
        CORN: Number((0.7 + Math.random() * 0.8).toFixed(2)),
        FLOUR: Number((0.9 + Math.random() * 0.4).toFixed(2)),
        EGG: Number((0.8 + Math.random() * 0.6).toFixed(2))
      });
    }, 30000);
    return () => clearInterval(marketTicker);
  }, []);

  return { 
    money, setMoney, inventory, setInventory, plots, harvest, mill, coop,
    messages, currentStock, maxCapacity, barnLevel, setBarnLevel, hasFarmhand, setHasFarmhand,
    playerLevel, xpInCurrentLevel, isWarping, warpTimeLeft, xp, setXp,
    marketModifiers, seasonTimeLeft, currentSeason, weather, greenhousePlots, 
    buyGreenhouse: () => { if (money >= 5000 && greenhousePlots.length < 9) { setMoney(m => m - 5000); setGreenhousePlots(prev => [...prev, greenhousePlots.length]); } },
    scarecrowPlots, buyScarecrow: (i) => { if (money >= 300 && !scarecrowPlots.includes(i)) { setMoney(m => m - 300); setScarecrowPlots(prev => [...prev, i]); } },
    plant: (i, id) => { if (money >= CROPS[id].cost) { setMoney(m => m - CROPS[id].cost); setPlots(ps => ps.map((p, idx) => idx === i ? { ...p, type: CROPS[id], progress: 0 } : p)); } },
    triggerWarp: () => { if (xp >= 500 && !isWarping) { setXp(x => x - 500); setIsWarping(true); setWarpTimeLeft(10); } },
    startMilling: () => { if (inventory.WHEAT >= 5 && !mill.active) { setInventory(prev => ({ ...prev, WHEAT: prev.WHEAT - 5 })); setMill({ active: true, progress: 0, timeLeft: MILL_TIME }); } },
    feedChicken: () => { if (inventory.CORN >= 3 && !coop.active && coop.hasCoop) { setInventory(prev => ({ ...prev, CORN: prev.CORN - 3 })); setCoop(prev => ({ ...prev, active: true, timeLeft: COOP_TIME, progress: 0 })); } },
    buyCoop: () => { if (money >= 3000 && !coop.hasCoop) { setMoney(m => m - 3000); setCoop(prev => ({ ...prev, hasCoop: true })); } }
  };
}

const Container = styled.div` max-width: 500px; margin: 0 auto; padding: 20px; font-family: sans-serif; background: ${props => props.bg}; transition: background 2s ease; min-height: 100vh; `;
const Grid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; `;
const PlotUI = styled.div` background: ${props => props.isGlass ? 'rgba(200, 240, 255, 0.9)' : 'rgba(255,255,255,0.8)'}; border-radius: 10px; aspect-ratio: 1; border: ${props => props.isGlass ? '3px solid #3b82f6' : '1px solid #e5e7eb'}; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; cursor: pointer; `;
const Bar = styled.div` width: 70%; height: 6px; background: #eee; border-radius: 5px; overflow: hidden; position: relative; &::after { content: ''; display: block; height: 100%; width: ${props => props.val}%; background: ${props => props.color || '#10b981'}; transition: 0.3s; } `;

export default function App() {
  const e = useGameEngine();

  const handleSell = () => {
    const total = 
      (e.inventory.WHEAT * CROPS.WHEAT.basePrice * e.marketModifiers.WHEAT) + 
      (e.inventory.CORN * CROPS.CORN.basePrice * e.marketModifiers.CORN) + 
      (e.inventory.FLOUR * CROPS.FLOUR.basePrice * e.marketModifiers.FLOUR) +
      (e.inventory.EGG * CROPS.EGG.basePrice * e.marketModifiers.EGG);
    e.setMoney(m => m + Math.floor(total));
    e.setInventory({ WHEAT: 0, CORN: 0, FLOUR: 0, EGG: 0 });
  };

  return (
    <Container bg={e.currentSeason.color} style={{filter: e.isWarping ? 'hue-rotate(45deg)' : 'none'}}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{margin:0}}>{e.currentSeason.icon} {e.currentSeason.name}</h2>
          <small>{e.weather.icon} {e.weather.type} ({e.seasonTimeLeft}s)</small>
          <div style={{marginTop: '5px'}}>
            <small>LVL {e.playerLevel}</small>
            <div style={{width: '60px', height: '4px', background: '#ccc'}}><div style={{width: `${e.xpInCurrentLevel}%`, height: '100%', background: '#8b5cf6'}}></div></div>
          </div>
        </div>
        <div style={{textAlign: 'right'}}>
          <b style={{fontSize: '1.2rem'}}>💰 {e.money}g</b><br/>
          <small>XP: {e.xp}</small>
        </div>
      </header>

      <div style={{ minHeight: '35px', margin: '10px 0', fontSize: '11px' }}>
        {e.messages.map(m => <div key={m.id} style={{ color: m.type === 'good' ? 'green' : m.type === 'bad' ? 'red' : 'orange' }}>• {m.text}</div>)}
      </div>

      <Grid>
        {e.plots.map((p, i) => (
          <PlotUI key={i} isGlass={e.greenhousePlots.includes(i)} onClick={() => p.progress >= 100 && e.harvest(i)}>
            <div style={{ position: 'absolute', top: 4, left: 4, fontSize: '9px' }}>S: {Math.floor(p.soil)}%</div>
            {e.scarecrowPlots.includes(i) && <div style={{ position: 'absolute', top: 2, right: 2 }}>👨‍🌾</div>}
            {p.type ? <><span style={{ fontSize: '1.8rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</span><Bar val={p.progress} /></> : 
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px' }}>
                <button onClick={(ev) => { ev.stopPropagation(); e.plant(i, 'WHEAT'); }}>🌾</button>
                <button onClick={(ev) => { ev.stopPropagation(); e.plant(i, 'CORN'); }}>🌽</button>
                {!e.scarecrowPlots.includes(i) && <button onClick={(ev) => { ev.stopPropagation(); e.buyScarecrow(i); }}>🛡️</button>}
              </div>}
          </PlotUI>
        ))}
      </Grid>

      <section style={{ background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{margin:0}}>Silo Capacity</h4>
          <small>{e.currentStock} / {e.maxCapacity}</small>
        </div>
        <Bar val={(e.currentStock / e.maxCapacity) * 100} color={e.currentStock >= e.maxCapacity ? "red" : "#3b82f6"} style={{width: '100%', height: '10px', margin: '8px 0'}} />
        <p style={{fontSize: '11px', fontWeight: 'bold'}}>🌾:{e.inventory.WHEAT} | 🌽:{e.inventory.CORN} | 🥖:{e.inventory.FLOUR} | 🥚:{e.inventory.EGG}</p>
        
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={handleSell} style={{flex:2, background:'#10b981', color:'white', border:'none', padding:'10px', borderRadius:'4px', cursor:'pointer'}}>Sell All Goods</button>
          <button onClick={() => { const cost = e.barnLevel * 500; if(e.money >= cost) { e.setMoney(m=>m-cost); e.setBarnLevel(l=>l+1); } }} style={{flex:1, fontSize:'10px'}}>Expand Silo ({e.barnLevel * 500}g)</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <div style={{ flex: 1, padding: '10px', background: '#fdf2f8', borderRadius: '8px', border: '1px solid #fbcfe8' }}>
            <small>🏗️ <b>The Mill</b></small>
            {e.mill.active ? <Bar val={e.mill.progress} color="#db2777" style={{ width: '100%', marginTop: '5px' }} /> : <button onClick={e.startMilling} style={{width:'100%', marginTop: '5px', fontSize:'10px'}}>Mill 5 Wheat</button>}
          </div>
          <div style={{ flex: 1, padding: '10px', background: '#fff7ed', borderRadius: '8px', border: '1px solid #fdba74' }}>
            <small>🐔 <b>The Coop</b></small>
            {!e.coop.hasCoop ? <button onClick={e.buyCoop} style={{width:'100%', marginTop: '5px', fontSize:'10px'}}>Build (3k)</button> : 
              e.coop.active ? <Bar val={e.coop.progress} color="#f97316" style={{ width: '100%', marginTop: '5px' }} /> : 
              <button onClick={e.feedChicken} disabled={e.inventory.CORN < 3} style={{width:'100%', marginTop: '5px', fontSize:'10px'}}>Feed 3 Corn</button>}
          </div>
        </div>

        <div style={{marginTop: '12px', display: 'flex', gap: '5px'}}>
          <button onClick={e.buyGreenhouse} disabled={e.greenhousePlots.length >= 9} style={{flex:1, background: '#3b82f6', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', fontSize: '10px'}}>+ Greenhouse (5k)</button>
          <button onClick={e.triggerWarp} disabled={e.isWarping} style={{flex:1, background: '#f59e0b', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', fontSize: '10px'}}>
            {e.isWarping ? `WARP ${e.warpTimeLeft}s` : '🚀 TIME WARP (500XP)'}
          </button>
        </div>

        {!e.hasFarmhand && (
          <button onClick={() => { if(e.money >= 2000) { e.setMoney(m=>m-2000); e.setHasFarmhand(true); } }} style={{width: '100%', marginTop: '8px', padding: '10px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '4px'}}>
            Hire Farmhand (2000g)
          </button>
        )}
      </section>
    </Container>
  );
}