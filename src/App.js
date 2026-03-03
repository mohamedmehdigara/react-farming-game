import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Animations ---
const slideIn = keyframes` from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } `;

// --- Constants ---
const EVENT_CHANCE = 0.5; // 50% chance of event every cycle
const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, basePrice: 25, time: 8, drain: 15 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, basePrice: 100, time: 15, drain: 25 },
};

// --- Custom Hook: The Engine ---
function useGameEngine() {
  const [money, setMoney] = useState(1000);
  const [inventory, setInventory] = useState({ WHEAT: 0, CORN: 0 });
  const [plots, setPlots] = useState(Array(9).fill({ type: null, progress: 0, soil: 100 }));
  const [messages, setMessages] = useState([]);

  // Utility to add messages to the feed
  const addLog = useCallback((text, type = 'info') => {
    const id = Date.now();
    setMessages(prev => [{ id, text, type }, ...prev].slice(0, 5));
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 5000);
  }, []);

  // Event Logic: Demonstrates global array manipulation
  const triggerEvent = useCallback(() => {
    const roll = Math.random();
    if (roll < 0.3) {
      addLog("☀️ Heatwave! Crops growing 2x faster, but soil drying out!", "warn");
      // This is a "Senior-Mid" move: passing a modifier through state or logic
    } else if (roll < 0.6) {
      addLog("🐛 Pest Infestation! All plot soil quality halved!", "bad");
      setPlots(prev => prev.map(p => ({ ...p, soil: Math.floor(p.soil / 2) })));
    } else {
      addLog("💰 Government Subsidy! You received 500g.", "good");
      setMoney(m => m + 500);
    }
  }, [addLog]);

  // Main Ticker
  useEffect(() => {
    const ticker = setInterval(() => {
      setPlots(current => current.map(p => {
        if (!p.type || p.progress >= 100) {
          return !p.type && p.soil < 100 ? { ...p, soil: Math.min(100, p.soil + 1) } : p;
        }
        const growth = (100 / p.type.time) * (p.soil / 100);
        return { ...p, progress: Math.min(100, p.progress + growth) };
      }));
    }, 1000);

    const eventTimer = setInterval(() => {
      if (Math.random() < EVENT_CHANCE) triggerEvent();
    }, 15000); // Check for events every 15s for demo purposes

    return () => { clearInterval(ticker); clearInterval(eventTimer); };
  }, [triggerEvent]);

  const plant = (index, cropId) => {
    const crop = CROPS[cropId];
    if (money >= crop.cost) {
      setMoney(m => m - crop.cost);
      setPlots(prev => prev.map((p, i) => i === index ? { ...p, type: crop, progress: 0 } : p));
    }
  };

  const harvest = (index) => {
    setPlots(prev => {
      const p = prev[index];
      if (!p.type || p.progress < 100) return prev;
      setInventory(inv => ({ ...inv, [p.type.id]: inv[p.type.id] + 1 }));
      const nextPlots = [...prev];
      nextPlots[index] = { ...p, type: null, progress: 0, soil: Math.max(0, p.soil - p.type.drain) };
      return nextPlots;
    });
  };

  return { money, setMoney, inventory, setInventory, plots, plant, harvest, messages };
}

// --- Styled Components ---
const Container = styled.div`
  max-width: 500px; margin: 0 auto; padding: 20px; font-family: 'Inter', sans-serif;
  background: #f8fafc; min-height: 100vh; position: relative;
`;

const MessageFeed = styled.div`
  position: fixed; top: 20px; right: 20px; z-index: 100;
  display: flex; flex-direction: column; gap: 8px; pointer-events: none;
`;

const Msg = styled.div`
  padding: 12px 20px; border-radius: 8px; color: white; font-size: 13px;
  animation: ${slideIn} 0.3s ease-out;
  background: ${props => props.type === 'good' ? '#22c55e' : props.type === 'bad' ? '#ef4444' : props.type === 'warn' ? '#f59e0b' : '#3b82f6'};
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const PlotGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
`;

const PlotUI = styled.div`
  background: white; border-radius: 12px; aspect-ratio: 1; border: 1px solid #e2e8f0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  position: relative; cursor: pointer; transition: 0.2s;
  &:hover { border-color: #3b82f6; }
`;

const Progress = styled.div`
  width: 70%; height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden;
  &::after { content: ''; display: block; height: 100%; width: ${props => props.val}%; background: #22c55e; transition: 0.3s; }
`;

// --- Components ---
export default function App() {
  const { money, setMoney, inventory, setInventory, plots, plant, harvest, messages } = useGameEngine();

  const handleSell = () => {
    const total = (inventory.WHEAT * 25) + (inventory.CORN * 100);
    setMoney(m => m + total);
    setInventory({ WHEAT: 0, CORN: 0 });
  };

  return (
    <Container>
      <MessageFeed>
        {messages.map(m => <Msg key={m.id} type={m.type}>{m.text}</Msg>)}
      </MessageFeed>

      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>My Mid-Level Farm</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <span>💰 <b>{money}g</b></span>
          <button onClick={handleSell} style={{fontSize: '11px'}}>Sell Inventory</button>
        </div>
      </header>

      <PlotGrid>
        {plots.map((p, i) => (
          <PlotUI key={i} onClick={() => p.progress >= 100 && harvest(i)}>
            <div style={{ position: 'absolute', top: 5, left: 5, fontSize: '9px', color: '#64748b' }}>S: {p.soil}%</div>
            {p.type ? (
              <>
                <span style={{ fontSize: '2rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</span>
                <Progress val={p.progress} />
              </>
            ) : (
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={(e) => { e.stopPropagation(); plant(i, 'WHEAT'); }}>🌾</button>
                <button onClick={(e) => { e.stopPropagation(); plant(i, 'CORN'); }}>🌽</button>
              </div>
            )}
          </PlotUI>
        ))}
      </PlotGrid>

      <footer style={{ marginTop: '20px', padding: '15px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Inventory</h4>
        <div style={{ fontSize: '14px' }}>Wheat: {inventory.WHEAT} | Corn: {inventory.CORN}</div>
      </footer>
    </Container>
  );
}