import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// --- Static Data ---
const CROP_DATA = {
  WHEAT: { id: 'WHEAT', name: 'Wheat', cost: 10, basePrice: 25, growthTime: 5, icon: '🌾' },
  CORN: { id: 'CORN', name: 'Corn', cost: 40, basePrice: 100, growthTime: 12, icon: '🌽' },
  CARROT: { id: 'CARROT', name: 'Carrot', cost: 100, basePrice: 300, growthTime: 25, icon: '🥕' },
};

const RECIPES = {
  FLOUR: { id: 'FLOUR', name: 'Fine Flour', ingredients: { WHEAT: 2 }, sellPrice: 80, icon: '🥡' },
  CORNBREAD: { id: 'CORNBREAD', name: 'Cornbread', ingredients: { WHEAT: 1, CORN: 1 }, sellPrice: 250, icon: '🍞' },
  VEGGIE_CAKE: { id: 'VEGGIE_CAKE', name: 'Veggie Cake', ingredients: { WHEAT: 1, CARROT: 1 }, sellPrice: 650, icon: '🍰' },
};

const DECOR_DATA = {
  STATION: { id: 'STATION', name: 'Weather Station', cost: 1500, icon: '📡', buff: 'Unlock Forecast' },
  HARVESTER: { id: 'HARVESTER', name: 'Hired Harvester', cost: 2500, icon: '👨‍🌾', buff: 'Auto-Harvesting' },
  SALESMAN: { id: 'SALESMAN', name: 'Hired Salesman', cost: 3000, icon: '💼', buff: 'Auto-Sell (+5%)' },
};

const SEASONS = {
  SPRING: { id: 'SPRING', name: 'Spring', icon: '🌸', color: '#e8f5e9', mult: 1.5, next: 'SUMMER' },
  SUMMER: { id: 'SUMMER', name: 'Summer', icon: '☀️', color: '#fffde7', mult: 0.8, next: 'FALL' },
  FALL: { id: 'FALL', name: 'Fall', icon: '🍂', color: '#fff3e0', mult: 1.2, next: 'WINTER' },
  WINTER: { id: 'WINTER', name: 'Winter', icon: '❄️', color: '#e3f2fd', mult: 0.4, next: 'SPRING' },
};

// --- Styled Components ---
const GameContainer = styled.div`
  display: flex; flex-direction: column; align-items: center;
  font-family: 'Arial', sans-serif; background: ${props => props.bgColor}; 
  transition: background 2s; min-height: 100vh; padding: 15px;
`;

const Section = styled.div`
  background: white; border: 3px solid #4e342e; border-radius: 12px;
  width: 100%; max-width: 480px; padding: 12px; margin-bottom: 12px;
`;

const TabBar = styled.div` display: flex; width: 100%; max-width: 480px; gap: 5px; margin-bottom: 10px; `;
const Tab = styled.button`
  flex: 1; padding: 10px; border-radius: 8px; border: none; cursor: pointer;
  background: ${props => props.active ? '#4e342e' : '#d7ccc8'};
  color: ${props => props.active ? 'white' : '#4e342e'}; font-weight: bold;
`;

const FarmGrid = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; `;
const Plot = styled.div`
  aspect-ratio: 1/1; background: ${props => props.ready ? '#8bc34a' : '#a1887f'};
  border: 3px solid #4e342e; border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; position: relative;
`;

const Button = styled.button`
  background: ${props => props.color || '#4e342e'}; color: white; border: none;
  padding: 8px 12px; border-radius: 6px; font-weight: bold; cursor: pointer;
  &:disabled { opacity: 0.4; }
`;

export default function App() {
  const [activeTab, setActiveTab] = useState('farm');
  const [money, setMoney] = useState(() => JSON.parse(localStorage.getItem('zf-v14-money')) ?? 250);
  const [plots, setPlots] = useState(() => JSON.parse(localStorage.getItem('zf-v14-plots')) ?? Array(9).fill(null));
  const [inv, setInv] = useState(() => JSON.parse(localStorage.getItem('zf-v14-inv')) ?? { WHEAT: 0, CORN: 0, CARROT: 0, FLOUR: 0, CORNBREAD: 0, VEGGIE_CAKE: 0 });
  const [decor, setDecor] = useState(() => JSON.parse(localStorage.getItem('zf-v14-decor')) ?? []);
  const [season, setSeason] = useState('SPRING');
  const [seasonTimer, setSeasonTimer] = useState(60);

  const hasItem = (id) => decor.includes(id);

  // --- Game Loop ---
  useEffect(() => {
    const ticker = setInterval(() => {
      // 1. Seasonal Transition
      setSeasonTimer(t => {
        if (t <= 1) {
          setSeason(curr => SEASONS[curr].next);
          return 60;
        }
        return t - 1;
      });

      // 2. Growth & Auto-Harvest
      setPlots(prev => prev.map((p, i) => {
        if (!p) return null;
        const inc = (100 / p.type.growthTime) * SEASONS[season].mult;
        const newProg = Math.min(p.progress + inc, 100);
        
        if (newProg >= 100 && hasItem('HARVESTER')) {
          handleHarvest(p, i);
          return null;
        }
        return { ...p, progress: newProg };
      }));

      // 3. Auto-Salesman (every 60s)
      if (hasItem('SALESMAN') && seasonTimer === 1) {
        sellEverything(1.05); // 5% bonus
      }
    }, 1000);
    return () => clearInterval(ticker);
  }, [season, decor, seasonTimer]);

  const handleHarvest = (p, i) => {
    setInv(prev => ({ ...prev, [p.type.id]: prev[p.type.id] + 1 }));
    setPlots(ps => ps.map((x, idx) => idx === i ? null : x));
  };

  const cook = (recipe) => {
    const canCook = Object.entries(recipe.ingredients).every(([ing, amt]) => inv[ing] >= amt);
    if (canCook) {
      setInv(prev => {
        const next = { ...prev };
        Object.entries(recipe.ingredients).forEach(([ing, amt]) => next[ing] -= amt);
        next[recipe.id] = (next[recipe.id] || 0) + 1;
        return next;
      });
    }
  };

  const sellEverything = (bonus = 1) => {
    let total = 0;
    Object.entries(inv).forEach(([id, count]) => {
      const price = CROP_DATA[id] ? CROP_DATA[id].basePrice : RECIPES[id].sellPrice;
      total += count * price * bonus;
    });
    setMoney(m => m + Math.floor(total));
    setInv({ WHEAT: 0, CORN: 0, CARROT: 0, FLOUR: 0, CORNBREAD: 0, VEGGIE_CAKE: 0 });
  };

  useEffect(() => {
    localStorage.setItem('zf-v14-money', JSON.stringify(money));
    localStorage.setItem('zf-v14-inv', JSON.stringify(inv));
    localStorage.setItem('zf-v14-plots', JSON.stringify(plots));
    localStorage.setItem('zf-v14-decor', JSON.stringify(decor));
  }, [money, inv, plots, decor]);

  return (
    <GameContainer bgColor={SEASONS[season].color}>
      <Section style={{ background: '#4e342e', color: 'white', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Generation 1</span>
          <span style={{ fontWeight: 'bold' }}>💰 {money}g</span>
        </div>
        <h2 style={{ margin: '8px 0' }}>{SEASONS[season].icon} {SEASONS[season].name}</h2>
        {hasItem('STATION') && (
          <div style={{ fontSize: '11px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '4px' }}>
            Next: {SEASONS[season].next} in {seasonTimer}s
          </div>
        )}
      </Section>

      <TabBar>
        <Tab active={activeTab === 'farm'} onClick={() => setActiveTab('farm')}>🌱 Farm</Tab>
        <Tab active={activeTab === 'kitchen'} onClick={() => setActiveTab('kitchen')}>🍳 Kitchen</Tab>
        <Tab active={activeTab === 'shop'} onClick={() => setActiveTab('shop')}>🏗️ Build</Tab>
      </TabBar>

      {activeTab === 'farm' && (
        <>
          <FarmGrid>
            {plots.map((p, i) => (
              <Plot key={i} ready={p?.progress === 100} onClick={() => p?.progress === 100 && handleHarvest(p, i)}>
                {p ? (
                  <span style={{ fontSize: '2rem' }}>{p.progress === 100 ? p.type.icon : '🌱'}</span>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center' }}>
                    {Object.values(CROP_DATA).map(c => (
                      <button key={c.id} onClick={() => { if(money >= c.cost) { setMoney(m => m - c.cost); setPlots(ps => ps.map((x, idx) => idx === i ? { type: c, progress: 0 } : x)); } }}>{c.icon}</button>
                    ))}
                  </div>
                )}
              </Plot>
            ))}
          </FarmGrid>
          <Section style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>STORAGE BIN</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '8px 0' }}>
              {Object.entries(inv).map(([id, count]) => count > 0 && <span key={id}>{(CROP_DATA[id] || RECIPES[id]).icon} x{count}</span>)}
            </div>
            <Button color="#2e7d32" style={{ width: '100%' }} onClick={() => sellEverything()}>Sell All Stock</Button>
          </Section>
        </>
      )}

      {activeTab === 'kitchen' && (
        <Section>
          <h3>Artisan Kitchen</h3>
          {Object.values(RECIPES).map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <div>
                <b>{r.icon} {r.name}</b><br/>
                <small>Requires: {Object.entries(r.ingredients).map(([ing, amt]) => `${amt}x${CROP_DATA[ing].icon} `)}</small>
              </div>
              <Button disabled={!Object.entries(r.ingredients).every(([ing, amt]) => inv[ing] >= amt)} onClick={() => cook(r)}>
                Cook (+{r.sellPrice}g)
              </Button>
            </div>
          ))}
        </Section>
      )}

      {activeTab === 'shop' && (
        <Section>
          <h3>Hire & Infrastructure</h3>
          {Object.values(DECOR_DATA).map(d => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <div>
                <b>{d.icon} {d.name}</b><br/>
                <small>{d.buff}</small>
              </div>
              <Button disabled={money < d.cost || decor.includes(d.id)} onClick={() => { setMoney(m => m - d.cost); setDecor([...decor, d.id]); }}>
                {decor.includes(d.id) ? 'Active' : `${d.cost}g`}
              </Button>
            </div>
          ))}
        </Section>
      )}
    </GameContainer>
  );
}