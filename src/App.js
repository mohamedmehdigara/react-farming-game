import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

// --- Animations ---
const slide = keyframes` 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } `;
const growSilo = keyframes` from { transform: scaleY(0); } to { transform: scaleY(1); } `;

const CROPS = {
  WHEAT: { id: 'WHEAT', icon: '🌾', cost: 10, basePrice: 25, time: 8, drain: 10 },
  CORN: { id: 'CORN', icon: '🌽', cost: 40, basePrice: 100, time: 15, drain: 20 },
  CLOVER: { id: 'CLOVER', icon: '☘️', cost: 5, basePrice: 0, time: 5, drain: -40 },
  SUNGRAIN: { id: 'SUNGRAIN', icon: '✨', cost: 0, basePrice: 1500, time: 30, drain: 50 },
  BEAN: { id: 'BEAN', icon: '🫘', cost: 0, basePrice: 300, time: 10, drain: -60 }
};

const WEATHER = {
  CLEAR: { id: 'CLEAR', icon: '☀️', speed: 1, color: '#f1f8e9' },
  RAIN: { id: 'RAIN', icon: '🌧️', speed: 2, color: '#e1f5fe' },
  NIGHT: { id: 'NIGHT', icon: '🌙', speed: 0.5, color: '#0d1117' }
};

// --- Styled Components ---
const GameWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; min-height: 100vh;
  background: ${props => props.isNight ? '#0d1117' : props.bg}; 
  color: ${props => props.isNight ? '#c9d1d9' : '#24292e'};
  transition: 2s; padding: 10px; font-family: 'Inter', sans-serif;
`;

const Section = styled.div`
  background: ${props => props.dark ? 'rgba(22, 27, 34, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(10px); border: 1px solid ${props => props.dark ? '#30363d' : '#e1e4e8'};
  border-radius: 12px; width: 100%; max-width: 380px; padding: 10px; margin-bottom: 8px;
`;

const PlotGrid = styled.div`
  display: grid; grid-template-columns: repeat(${props => props.cols || 3}, 1fr); 
  gap: 8px; width: 100%; max-width: 380px;
`;

const Plot = styled.div`
  aspect-ratio: 1/1; background: ${props => props.isSuper ? '#3e2723' : (props.isNight ? '#161b22' : '#efebe9')}; 
  border: ${props => props.isSuper ? '2px solid #ffd700' : '1px solid rgba(0,0,0,0.1)'}; 
  border-radius: 10px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;
  filter: ${props => props.hasCrow ? 'grayscale(1) contrast(0.5)' : 'none'};
`;

const Meter = styled.div`
  width: 80%; height: 4px; background: rgba(0,0,0,0.1); border-radius: 4px; margin-top: 2px;
  & > div { height: 100%; background: ${props => props.color || '#4caf50'}; width: ${props => props.val || 0}%; transition: 0.3s; }
`;

const MiniBtn = styled.button`
  background: ${props => props.active ? '#2ea44f' : '#30363d'}; color: white;
  border: none; padding: 4px 6px; border-radius: 4px; font-size: 9px; cursor: pointer; margin: 1px;
  &:disabled { opacity: 0.2; cursor: default; }
`;

const SiloPillar = styled.div`
  flex: 1; background: ${props => props.color}; border-radius: 4px 4px 0 0; position: relative;
  height: ${props => props.height}%; transition: 0.5s;
  &::after { content: '${props => props.icon}'; position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font-size: 9px; }
`;

export default function App() {
  // --- States ---
  const [money, setMoney] = useState(() => Number(JSON.parse(localStorage.getItem('zf_money'))) || 1000);
  const [diamonds, setDiamonds] = useState(() => Number(JSON.parse(localStorage.getItem('zf_diamonds'))) || 0);
  const [inv, setInv] = useState(() => JSON.parse(localStorage.getItem('zf_inv')) || { WHEAT: 0, CORN: 0, SUNGRAIN: 0, BEAN: 0, MEAL: 0, COMPOST: 0, KELP: 0, FISH: 0 });
  const [staff, setStaff] = useState(() => JSON.parse(localStorage.getItem('zf_staff')) || { harvester: false, onMission: false, missionTime: 0, buffTime: 0 });
  const [stats, setStats] = useState(() => JSON.parse(localStorage.getItem('zf_stats')) || { xp: 0, level: 1, mastery: { WHEAT: 1, CORN: 1 } });
  const [plots, setPlots] = useState(() => JSON.parse(localStorage.getItem('zf_plots')) || Array(9).fill({ type: null, progress: 0, soil: 100, isSuper: false, hasCrow: false }));
  const [almanac, setAlmanac] = useState(() => JSON.parse(localStorage.getItem('zf_almanac')) || { botanist: false, alchemist: false, scarecrow: false });
  const [animals, setAnimals] = useState(() => JSON.parse(localStorage.getItem('zf_animals')) || { chickens: 0, cows: 0 });
  const [tech, setTech] = useState({ beehive: false, greenhouse: false, sprinkler: false });
  const [market, setMarket] = useState({ WHEAT: 25, CORN: 100, trend: 'stable' });
  const [isNight, setIsNight] = useState(false);
  const [water, setWater] = useState(100);
  const [maxWater, setMaxWater] = useState(100);
  const [uiState, setUiState] = useState('farm');
  const [weather, setWeather] = useState(WEATHER.CLEAR);

  // --- Scoped Functions ---
  const handleHarvestLogic = (i, p) => {
    setInv(v => ({ ...v, [p.type.id]: (v[p.type.id] || 0) + 1 }));
    setStats(s => ({ ...s, xp: (s.xp || 0) + 10 }));
    if (Math.random() < (almanac.alchemist ? 0.2 : 0.1)) setInv(v => ({ ...v, SUNGRAIN: (v.SUNGRAIN || 0) + 1 }));
  };

  const manualAction = (i) => {
    const p = plots[i];
    if (p.hasCrow) return setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, hasCrow: false } : x));
    if (p?.progress >= 100) {
      handleHarvestLogic(i, p);
      setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: null, progress: 0, isSuper: false, soil: Math.max(0, p.soil - p.type.drain) } : x));
    }
  };

  const renewSoil = (i, type) => {
    if (inv[type] > 0) {
      setInv(v => ({ ...v, [type]: v[type] - 1 }));
      setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, isSuper: true, soil: 100 } : x));
    }
  };

  const plantCrop = (i, cropKey) => {
    const crop = CROPS[cropKey];
    if (money >= crop.cost) {
      setMoney(m => m - crop.cost);
      setPlots(ps => ps.map((x, idx) => idx === i ? { ...x, type: crop, progress: 0 } : x));
    }
  };

  // --- Persistence & Engine ---
  useEffect(() => {
    const ticker = setInterval(() => {
      let drain = (tech.sprinkler ? 0.2 : 0) + (tech.greenhouse ? 0.3 : 0);
      setWater(w => Math.max(0, Math.min(maxWater, w + 0.15 - drain)));

      setPlots(current => current.map((p, i) => {
        let currentSoil = p.soil || 0;
        if (tech.sprinkler && water > 0) currentSoil = Math.min(100, currentSoil + 1.5);
        if (!p.type) return { ...p, soil: Math.min(100, currentSoil + (animals.chickens * 0.1)) };
        if (p.hasCrow) return p;

        const timeMod = (isNight && !(tech.greenhouse && i < 4)) ? 0.5 : (weather.speed || 1);
        let mult = timeMod * (currentSoil / 100) * (almanac.botanist ? 1.2 : 1) * (p.isSuper ? 3 : 1);
        const nextProgress = Math.min(p.progress + (100 / p.type.time) * mult, 100);

        if (nextProgress >= 100 && staff.harvester && !staff.onMission) {
          handleHarvestLogic(i, p);
          return { ...p, type: null, progress: 0, isSuper: false };
        }
        return { ...p, progress: nextProgress, soil: currentSoil };
      }));
    }, 1000);
    return () => clearInterval(ticker);
  }, [isNight, tech, water, plots, weather, staff, almanac, animals, maxWater]);

  // --- Render ---
  return (
    <GameWrap bg={weather.color} isNight={isNight}>
      <Section dark={isNight}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
          <b>💰 {money.toLocaleString()} | 💎 {diamonds}</b>
          <span>💧 {Math.floor((water/maxWater)*100)}%</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', marginTop: '5px', justifyContent:'center' }}>
          {['farm', 'barn', 'chef', 'shop'].map(m => (
            <MiniBtn key={m} active={uiState === m} onClick={() => setUiState(m)}>{m.toUpperCase()}</MiniBtn>
          ))}
        </div>
      </Section>

      {uiState === 'farm' && (
        <>
          <PlotGrid cols={3}>
            {plots.map((p, i) => (
              <Plot key={i} isNight={isNight} isSuper={p.isSuper} hasCrow={p.hasCrow} onClick={() => manualAction(i)}>
                {p.hasCrow ? '🐦' : p.type ? (
                  <>
                    <span style={{ fontSize: '1.4rem' }}>{p.progress >= 100 ? p.type.icon : '🌱'}</span>
                    <Meter color="#4caf50" val={p.progress}><div /></Meter>
                  </>
                ) : (
                  /* THE RENEWER IS NOW MAPPED TO EVERY SQUARE */
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>
                      <MiniBtn onClick={(e) => { e.stopPropagation(); plantCrop(i, 'WHEAT'); }}>🌾</MiniBtn>
                      <MiniBtn onClick={(e) => { e.stopPropagation(); plantCrop(i, 'CORN'); }}>🌽</MiniBtn>
                    </div>
                    <div style={{ display: 'flex', marginTop: '2px' }}>
                      <MiniBtn disabled={inv.COMPOST === 0} onClick={(e) => { e.stopPropagation(); renewSoil(i, 'COMPOST'); }}>💩</MiniBtn>
                      <MiniBtn disabled={inv.KELP === 0} onClick={(e) => { e.stopPropagation(); renewSoil(i, 'KELP'); }}>🌿</MiniBtn>
                    </div>
                  </div>
                )}
                <Meter color="#795548" val={p.soil}><div /></Meter>
                {tech.greenhouse && i < 4 && <div style={{position:'absolute', top:2, right:2, fontSize:'8px'}}>🏠</div>}
              </Plot>
            ))}
          </PlotGrid>
          <MiniBtn active style={{width:'100%', maxWidth:'380px', marginTop:'8px'}} onClick={()=>setTech(t=>({...t, sprinkler:!t.sprinkler}))}>
            {tech.sprinkler ? '🚿 SPRINKLERS ON' : '🚿 SPRINKLERS OFF'}
          </MiniBtn>
        </>
      )}

      {uiState === 'barn' && (
        <Section dark={isNight}>
          <h4>📦 Storage Silo</h4>
          <div style={{display:'flex', height:'50px', gap:'4px', alignItems:'flex-end', background:'rgba(0,0,0,0.05)', padding:'5px', borderRadius:'8px'}}>
            <SiloPillar color="#ffd54f" icon="🌾" height={Math.min(100, inv.WHEAT * 2)} />
            <SiloPillar color="#ffb74d" icon="🌽" height={Math.min(100, inv.CORN * 2)} />
          </div>
          <MiniBtn active style={{width:'100%', marginTop:'8px'}} onClick={() => {
            setMoney(m => m + (inv.WHEAT * market.WHEAT));
            setInv(v => ({ ...v, WHEAT: 0 }));
          }}>SELL WHEAT</MiniBtn>
        </Section>
      )}

      {uiState === 'chef' && (
        <Section dark={isNight}>
          <h4>🔬 Alchemy</h4>
          <MiniBtn onClick={() => setInv(v => ({ ...v, WHEAT: v.WHEAT - 10, COMPOST: v.COMPOST + 1 }))} disabled={inv.WHEAT < 10}>Craft Compost (10🌾)</MiniBtn>
          <MiniBtn onClick={() => setStaff(s => ({ ...s, onMission: true, missionTime: 30 }))} disabled={!staff.harvester || staff.onMission}>Robot Mission (30s)</MiniBtn>
        </Section>
      )}

      <Section dark={isNight} style={{ fontSize: '10px', textAlign: 'center', opacity: 0.6 }}>
        LVL: {stats.level} | {isNight ? "🌙 Night" : "☀️ Day"} | XP: {stats.xp}
      </Section>
    </GameWrap>
  );
}