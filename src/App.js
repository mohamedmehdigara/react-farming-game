import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Global Styles & Animations ---
const fadeIn = keyframes` from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } `;
const pulseGreen = keyframes` 0% { box-shadow: 0 0 0px #10b981; } 50% { box-shadow: 0 0 10px #10b981; } 100% { box-shadow: 0 0 0px #10b981; } `;

// --- Constants ---
const PRESTIGE_BASE = 25000;
const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, time: 8, xp: 10, price: 25 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, time: 15, xp: 30, price: 100 }
};

function useGameEngine() {
  const [money, setMoney] = useState(1500);
  const [inventory, setInventory] = useState({ WHEAT: 0, CORN: 0 });
  const [prestigePoints, setPrestigePoints] = useState(0);
  const [automation, setAutomation] = useState({ autoPlant: false, autoSell: false });
  const [gridSize, setGridSize] = useState(9); 
  const [plots, setPlots] = useState(Array(9).fill({ type: null, progress: 0, soil: 100, lastCrop: 'WHEAT' }));
  const [xp, setXp] = useState(0);
  const [stats, setStats] = useState({ totalEarned: 0, lastGPM: 0 });
  
  const moneyRef = useRef(money); // For automation access without re-renders
  useEffect(() => { moneyRef.current = money; }, [money]);

  const farmValue = useMemo(() => money + (inventory.WHEAT * 25) + (inventory.CORN * 100), [money, inventory]);
  const canPrestige = farmValue >= PRESTIGE_BASE;

  // 1. Core Growth & Automation Engine
  useEffect(() => {
    const ticker = setInterval(() => {
      setPlots(current => current.map(p => {
        // Growth Logic
        if (p.type && p.progress < 100) {
          const growth = (100 / p.type.time) * (p.soil / 100);
          return { ...p, progress: Math.min(100, p.progress + growth), soil: Math.max(0, p.soil - 1.5) };
        }
        // Passive Soil Recovery
        if (!p.type) return { ...p, soil: Math.min(100, p.soil + 2) };
        return p;
      }));
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // 2. Logistics: Auto-Sell (Every 10s)
  useEffect(() => {
    if (automation.autoSell) {
      const seller = setInterval(() => {
        setInventory(inv => {
          const income = (inv.WHEAT * 25) + (inv.CORN * 100);
          if (income > 0) {
            setMoney(m => m + income);
            setStats(s => ({ ...s, totalEarned: s.totalEarned + income }));
          }
          return { WHEAT: 0, CORN: 0 };
        });
      }, 10000);
      return () => clearInterval(seller);
    }
  }, [automation.autoSell]);

  // 3. Harvest & Auto-Planting Logic
  const harvest = useCallback((index) => {
    setPlots(prev => {
      const p = prev[index];
      if (!p.type || p.progress < 100) return prev;
      
      const cropId = p.type.id;
      setInventory(inv => ({ ...inv, [cropId]: inv[cropId] + 1 }));
      setXp(x => x + p.type.xp);

      return prev.map((item, i) => {
        if (i === index) {
          // If Auto-Plant is on, check funds and replant
          if (automation.autoPlant && moneyRef.current >= CROPS[cropId].cost) {
            setMoney(m => m - CROPS[cropId].cost);
            return { ...item, type: CROPS[cropId], progress: 0, lastCrop: cropId };
          }
          return { ...item, type: null, progress: 0, lastCrop: cropId };
        }
        return item;
      });
    });
  }, [automation.autoPlant]);

  const plant = (i, id) => {
    if (money >= CROPS[id].cost && !plots[i].type) {
      setMoney(m => m - CROPS[id].cost);
      setPlots(ps => ps.map((p, idx) => idx === i ? { ...p, type: CROPS[id], progress: 0, lastCrop: id } : p));
    }
  };

  const prestige = () => {
    if (!canPrestige) return;
    setPrestigePoints(p => p + Math.floor(farmValue / 10000));
    setMoney(5000);
    setInventory({ WHEAT: 0, CORN: 0 });
    setGridSize(16);
    setPlots(Array(16).fill({ type: null, progress: 0, soil: 100, lastCrop: 'WHEAT' }));
    setAutomation({ autoPlant: false, autoSell: false });
  };

  return { money, inventory, plots, harvest, plant, prestige, prestigePoints, automation, setAutomation, gridSize, xp, farmValue, canPrestige, setMoney };
}

// --- Styled Components ---
const Container = styled.div` max-width: 600px; margin: 0 auto; padding: 20px; background: #f1f5f9; min-height: 100vh; font-family: 'Inter', sans-serif; `;
const HUD = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; `;
const Card = styled.div` background: white; padding: 15px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); `;
const Grid = styled.div` display: grid; grid-template-columns: repeat(${p => Math.sqrt(p.size)}, 1fr); gap: 10px; margin-bottom: 20px; `;
const PlotUI = styled.div` background: ${p => p.active ? '#fff' : '#e2e8f0'}; border-radius: 10px; aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; cursor: pointer; border: 2px solid transparent; &:hover { border-color: #cbd5e1; } `;
const ProgressBar = styled.div` width: 60%; height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; margin-top: 5px; &::after { content: ''; display: block; height: 100%; width: ${p => p.val}%; background: #10b981; transition: 0.5s; } `;
const Toggle = styled.button` background: ${p => p.active ? '#10b981' : '#94a3b8'}; color: white; border: none; border-radius: 20px; padding: 5px 15px; font-size: 10px; cursor: pointer; `;

export default function App() {
  const e = useGameEngine();

  return (
    <Container>
      <HUD>
        <Card>
          <small>Balance</small>
          <h2 style={{margin:0}}>💰 {e.money.toLocaleString()}g</h2>
          <small style={{color:'#64748b'}}>Net Worth: {e.farmValue.toLocaleString()}g</small>
        </Card>
        <Card>
          <small>Legacy Credits</small>
          <h2 style={{margin:0, color:'#6366f1'}}>⭐ {e.prestigePoints}</h2>
          <div style={{display:'flex', gap:'5px', marginTop:'5px'}}>
             <Toggle active={e.automation.autoPlant} onClick={() => e.prestigePoints >= 1 && !e.automation.autoPlant ? (e.setAutomation(a => ({...a, autoPlant:true}))) : null}>
               {e.automation.autoPlant ? 'Auto-Plant ON' : 'Unlock (1⭐)'}
             </Toggle>
             <Toggle active={e.automation.autoSell} onClick={() => e.prestigePoints >= 2 && !e.automation.autoSell ? (e.setAutomation(a => ({...a, autoSell:true}))) : null}>
               {e.automation.autoSell ? 'Auto-Sell ON' : 'Unlock (2⭐)'}
             </Toggle>
          </div>
        </Card>
      </HUD>

      <Grid size={e.gridSize}>
        {e.plots.map((p, i) => (
          <PlotUI key={i} active={p.type} onClick={() => p.progress >= 100 && e.harvest(i)}>
            {p.type ? (
              <>
                <span style={{fontSize:'2rem'}}>{p.progress >= 100 ? p.type.icon : '🌱'}</span>
                <ProgressBar val={p.progress} />
              </>
            ) : (
              <div style={{display:'flex', gap:'5px'}}>
                <button onClick={(v) => {v.stopPropagation(); e.plant(i, 'WHEAT')}}>🌾</button>
                <button onClick={(v) => {v.stopPropagation(); e.plant(i, 'CORN')}}>🌽</button>
              </div>
            )}
            <div style={{position:'absolute', bottom:2, fontSize:'8px', opacity:0.5}}>Soil: {Math.floor(p.soil)}%</div>
          </PlotUI>
        ))}
      </Grid>

      <Card style={{textAlign:'center'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
          <span>Silo: 🌾{e.inventory.WHEAT} 🌽{e.inventory.CORN}</span>
          <button onClick={() => {
            const income = (e.inventory.WHEAT * 25) + (e.inventory.CORN * 100);
            e.setMoney(m => m + income);
            e.inventory.WHEAT = 0; e.inventory.CORN = 0;
          }} style={{background:'#10b981', color:'white', border:'none', borderRadius:'6px', padding:'5px 10px'}}>Sell All Now</button>
        </div>
        
        <button 
          onClick={e.prestige} 
          disabled={!e.canPrestige}
          style={{
            width:'100%', padding:'15px', borderRadius:'10px', border:'none',
            background: e.canPrestige ? 'linear-gradient(45deg, #6366f1, #a855f7)' : '#cbd5e1',
            color: 'white', fontWeight: 'bold', cursor: e.canPrestige ? 'pointer' : 'not-allowed',
            animation: e.canPrestige ? `${pulseGreen} 2s infinite` : 'none'
          }}
        >
          {e.canPrestige ? "PERFORM PRESTIGE RESET" : `REACH ${PRESTIGE_BASE.toLocaleString()}g TO PRESTIGE`}
        </button>
      </Card>
    </Container>
  );
}