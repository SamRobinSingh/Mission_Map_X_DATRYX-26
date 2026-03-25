import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_NODES, MAP_EDGES, type GameNode } from '@/data/gameMap';
import { getDynamicNode } from '@/context/GameContext';
import { Shield, AlertTriangle, Zap, Flag, Rocket, MapPin, Lock, Star, Send, ShieldAlert, Trophy, ChevronDown, Wand2, Key, Music, VolumeX } from 'lucide-react';
import TerminalText from '@/components/TerminalText';
import hogwartsMap1 from '@/assets/hogwarts-map-8k.png';
// We will import hogwartsMap2 here once we copy it over
import hogwartsMap2 from '@/assets/hogwarts-map-r2-8k.png';
import { startMusic, stopMusic, setMusicMood, isMusicPlaying } from '@/lib/music';

interface MapVisualizationProps {
  currentNode: string;
  visitedNodes: string[];
  onSubmitAnswer: (answer: string) => void;
  onSubmitSecret: (code: string) => void;
  onSkipNode: () => void;
  onUseHint: () => boolean;
  feedback: { msg: string; type: 'success' | 'error' | 'secret' } | null;
  team: {
    correctAnswers: number;
    wrongAnswers: number;
    shortcutsFound: number;
    trapHits: number;
    skipsUsed?: number;
    startTime: number;
    visitedNodes: string[];
    currentRound: 1 | 2;
    round2StartTime?: number;
    pendingRound2?: boolean;
    isEliminated?: boolean;
    isFinished?: boolean;
    questionOrder?: number[];
    r1HintsUsed?: number;
    r2HintsUsed?: number;
  };
  timeRemaining: number;
  timerWarning: 'none' | 'five' | 'one' | 'expired';
}

const PATH_POSITIONS: Record<string, { x: number; y: number }> = {};
Object.values(GAME_NODES).forEach(n => {
  PATH_POSITIONS[n.id] = { x: n.x, y: n.y };
});

function getNodeIcon(type: string, size = 'w-4 h-4') {
  switch (type) {
    case 'start': return <Rocket className={size} />;
    case 'trap': return <AlertTriangle className={size} />;
    case 'return': return <Shield className={size} />;
    case 'bonus': return <Star className={size} />;
    case 'final': return <Flag className={size} />;
    case 'waiting': return <Trophy className={size} />;
    default: return <Wand2 className={size} />;
  }
}

function getNodeColors(type: string) {
  switch (type) {
    case 'trap': return { bg: '#9b2335', border: '#7c1d2a', shadow: 'rgba(155,35,53,0.5)', text: '#f5a0a0' };
    case 'bonus': return { bg: '#c5a028', border: '#a68520', shadow: 'rgba(197,160,40,0.5)', text: '#fde68a' };
    case 'final': case 'waiting': return { bg: '#7c3aed', border: '#6d28d9', shadow: 'rgba(124,58,237,0.5)', text: '#c4b5fd' };
    case 'return': return { bg: '#b45309', border: '#92400e', shadow: 'rgba(180,83,9,0.5)', text: '#fbbf24' };
    case 'start': return { bg: '#047857', border: '#065f46', shadow: 'rgba(4,120,87,0.5)', text: '#6ee7b7' };
    default: return { bg: '#1d4ed8', border: '#1e40af', shadow: 'rgba(29,78,216,0.5)', text: '#93c5fd' };
  }
}

// Milestone keys/flags every 5 main nodes
function getMilestoneIndex(visitedNodes: string[], round: 1 | 2): number {
  const mainNodes = visitedNodes.filter(id => {
    const n = GAME_NODES[id];
    return n && n.round === round && (n.type === 'normal' || n.type === 'start');
  });
  return Math.floor(mainNodes.length / 5);
}

const MILESTONE_ITEMS = [
  { emoji: '🔑', label: 'Golden Key' },
  { emoji: '🏴', label: 'House Flag' },
  { emoji: '🗝️', label: 'Skeleton Key' },
  { emoji: '🚩', label: 'Victory Flag' },
  { emoji: '⚜️', label: 'Fleur-de-lis' },
  { emoji: '🎪', label: 'Circus Tent' },
  { emoji: '🏅', label: 'Medal' },
];

export default function MapVisualization({ currentNode, visitedNodes, onSubmitAnswer, onSubmitSecret, onSkipNode, onUseHint, feedback, team, timeRemaining, timerWarning }: MapVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [answer, setAnswer] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [storyDone, setStoryDone] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [nodeCrossAnim, setNodeCrossAnim] = useState<string | null>(null);

  // Editor mode state
  const [isEditor, setIsEditor] = useState(false);
  const [editorPositions, setEditorPositions] = useState<Record<string, {x: number, y: number}>>(PATH_POSITIONS);
  const dragNodeRef = useRef<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        setIsEditor(v => !v);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    if (!isEditor) return;
    dragNodeRef.current = id;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isEditor || !dragNodeRef.current) return;
    const mapEl = mapRef.current;
    if (!mapEl) return;
    const rect = mapEl.getBoundingClientRect();
    const nx = Math.max(0, Math.min(100, ((e.clientX - rect.left) / mapEl.clientWidth) * 100));
    const ny = Math.max(0, Math.min(100, ((e.clientY - rect.top) / mapEl.clientHeight) * 100));
    setEditorPositions(prev => ({ ...prev, [dragNodeRef.current!]: { x: nx, y: ny } }));
  };

  const handlePointerUp = () => {
    dragNodeRef.current = null;
  };

  const node = getDynamicNode(currentNode, team.questionOrder);
  const milestoneIndex = getMilestoneIndex(visitedNodes, team.currentRound);

  const roundNodes = useMemo(() => {
    return Object.values(GAME_NODES).filter(n => n.round === team.currentRound);
  }, [team.currentRound]);

  // Music mood based on node type
  useEffect(() => {
    if (!node) return;
    if (node.type === 'trap' || node.type === 'return') setMusicMood('trap');
    else if (node.type === 'final') setMusicMood('victory');
    else setMusicMood('normal');
  }, [node?.type]);

  useEffect(() => {
    setAnswer(''); setSecretCode(''); setShowSecret(false); setShowHint(false); setStoryDone(false);
    // Node crossing animation
    setNodeCrossAnim(currentNode);
    const t = setTimeout(() => setNodeCrossAnim(null), 1200);
    return () => clearTimeout(t);
  }, [currentNode]);

  const mapImage = team.currentRound === 1 ? hogwartsMap1 : (hogwartsMap2 || hogwartsMap1);

  // Auto-pan to current node
  useEffect(() => {
    if (!containerRef.current || !mapRef.current) return;
    const pos = editorPositions[currentNode];
    if (!pos) return;
    const container = containerRef.current;
    const map = mapRef.current;
    const targetX = (pos.x / 100) * map.scrollWidth - container.clientWidth / 2;
    const targetY = (pos.y / 100) * map.scrollHeight - container.clientHeight / 2;
    container.scrollTo({
      left: Math.max(0, Math.min(targetX, map.scrollWidth - container.clientWidth)),
      top: Math.max(0, Math.min(targetY, map.scrollHeight - container.clientHeight)),
      behavior: 'smooth',
    });
  }, [currentNode]);

  const visibleNodeIds = useMemo(() => {
    const visible = new Set(visitedNodes.filter(id => GAME_NODES[id]?.round === team.currentRound));
    const current = GAME_NODES[currentNode];
    if (current && current.round === team.currentRound) {
      visible.add(currentNode);
      if (current.nextOnCorrect && GAME_NODES[current.nextOnCorrect]?.round === team.currentRound) visible.add(current.nextOnCorrect);
      if (current.nextOnWrong) visible.add(current.nextOnWrong);
      if (current.nextOnWrong2) visible.add(current.nextOnWrong2);
      if (current.secretTarget) visible.add(current.secretTarget);
    }
    return visible;
  }, [currentNode, visitedNodes, team.currentRound]);

  const visibleEdges = useMemo(() => MAP_EDGES.filter(e => visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to)), [visibleNodeIds]);
  const visibleNodes = useMemo(() => roundNodes.filter(n => visibleNodeIds.has(n.id)), [roundNodes, visibleNodeIds]);

  // Build the visited path trail
  const visitedPath = useMemo(() => {
    return visitedNodes
      .filter(id => GAME_NODES[id]?.round === team.currentRound && editorPositions[id])
      .map(id => editorPositions[id]);
  }, [visitedNodes, team.currentRound]);

  const nodeColors = getNodeColors(node?.type || 'normal');

  const handleSubmit = useCallback(() => {
    if (!answer.trim()) return;
    onSubmitAnswer(answer);
    setAnswer('');
  }, [answer, onSubmitAnswer]);

  const handleSecret = useCallback(() => {
    if (!secretCode.trim()) return;
    onSubmitSecret(secretCode);
    setSecretCode('');
  }, [secretCode, onSubmitSecret]);

  const toggleMusic = () => {
    if (musicOn) { stopMusic(); setMusicOn(false); }
    else { startMusic(); setMusicOn(true); }
  };

  const timerMins = Math.floor(timeRemaining / 60);
  const timerSecs = timeRemaining % 60;

  const MAP_W = 3600;
  const MAP_H = 3800;

  const hpDecorations = [
    { x: 5, y: 70, emoji: '🏰', size: 36 },
    { x: 88, y: 10, emoji: '⚡', size: 28 },
    { x: 10, y: 15, emoji: '🦉', size: 30 },
    { x: 92, y: 92, emoji: '🐉', size: 36 },
    { x: 78, y: 75, emoji: '🧹', size: 28 },
    { x: 6, y: 45, emoji: '🌲', size: 32 },
    { x: 90, y: 45, emoji: '🌲', size: 30 },
    { x: 40, y: 15, emoji: '🔮', size: 24 },
    { x: 65, y: 85, emoji: '🐍', size: 26 },
    { x: 15, y: 85, emoji: '🧙‍♂️', size: 32 },
    { x: 80, y: 50, emoji: '🪄', size: 26 },
    { x: 30, y: 40, emoji: '📜', size: 22 },
    { x: 70, y: 25, emoji: '💀', size: 24 },
    { x: 50, y: 60, emoji: '🦅', size: 28 },
    { x: 20, y: 55, emoji: '🦡', size: 24 },
  ];

  return (
    <div className="w-full h-[calc(100vh-56px)] relative overflow-hidden">
      {/* Elimination or Timeout overlay */}
      <AnimatePresence>
        {team.isEliminated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-[100] flex items-center justify-center backdrop-blur-md"
            style={{ background: 'rgba(5, 2, 10, 0.95)' }}>
            <div className="text-center p-8 rounded-3xl border border-red-500/30 bg-red-950/30 shadow-[0_0_100px_rgba(220,38,38,0.2)]">
               <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                 <AlertTriangle className="w-24 h-24 text-red-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
               </motion.div>
               <h1 className="text-6xl font-bold text-red-500 mb-4 tracking-widest font-display" style={{ textShadow: '0 0 20px rgba(220,38,38,0.5)' }}>END GAME</h1>
               <p className="text-red-200/60 text-lg uppercase tracking-[0.2em] font-bold">Your House was not selected for Round 2.</p>
               <p className="text-white/30 text-xs mt-8">Thank you for playing Hogwarts Quest.</p>
            </div>
          </motion.div>
        )}
        {!team.isEliminated && !team.isFinished && timerWarning === 'expired' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-[100] flex items-center justify-center backdrop-blur-md pointer-events-auto"
            style={{ background: 'rgba(5, 2, 10, 0.95)' }}>
            <div className="text-center p-8 rounded-3xl border border-red-500/30 bg-red-950/30 shadow-[0_0_100px_rgba(220,38,38,0.2)]">
               <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                 <ShieldAlert className="w-24 h-24 text-red-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
               </motion.div>
               <h1 className="text-6xl font-bold text-red-500 mb-4 tracking-widest font-display" style={{ textShadow: '0 0 20px rgba(220,38,38,0.5)' }}>TIME UP</h1>
               <p className="text-red-200/60 text-lg uppercase tracking-[0.2em] font-bold">Your time has expired.</p>
               <p className="text-white/30 text-xs mt-8">Please wait for the Headmaster to review your score.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2"
           style={{ background: 'linear-gradient(180deg, rgba(20,10,30,0.85) 0%, transparent 100%)' }}>
        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full border border-amber-500/30">
            ⚡ Round {team.currentRound}
          </span>
          <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">✅ {team.correctAnswers}</span>
          <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded-full border border-red-500/30">❌ {team.wrongAnswers}</span>
          <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-500/30">🔮 {team.shortcutsFound}</span>
          <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">💀 {team.trapHits}</span>
          {(team.skipsUsed || 0) > 0 && (
            <span className="bg-slate-500/20 text-slate-300 px-2 py-1 rounded-full border border-slate-500/30 flex items-center gap-1">
              ⏭️ {team.skipsUsed}
              {(team.skipsUsed || 0) > 2 && <span className="text-[10px] text-red-400">-{((team.skipsUsed || 0) - 2) * 1.5}pts</span>}
            </span>
          )}
          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30 flex items-center gap-1">
            💡 {3 - (team.currentRound === 1 ? (team.r1HintsUsed || 0) : (team.r2HintsUsed || 0))} Hints
          </span>
          {/* Milestone keys collected */}
          {milestoneIndex > 0 && (
            <span className="bg-amber-600/20 text-amber-200 px-2 py-1 rounded-full border border-amber-600/30 flex items-center gap-1">
              <Key className="w-3 h-3" /> {milestoneIndex}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Music toggle */}
          <button onClick={toggleMusic}
            className="p-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-all"
            title={musicOn ? 'Mute music' : 'Play music'}>
            {musicOn ? <Music className="w-3.5 h-3.5 text-amber-300" /> : <VolumeX className="w-3.5 h-3.5 text-white/40" />}
          </button>
          {/* Timer */}
          <motion.div
            animate={timerWarning === 'one' ? { scale: [1, 1.15, 1], backgroundColor: ['rgba(220,38,38,0.3)', 'rgba(220,38,38,0.6)', 'rgba(220,38,38,0.3)'] } :
                     timerWarning === 'five' ? { backgroundColor: ['rgba(234,179,8,0.2)', 'rgba(234,179,8,0.4)', 'rgba(234,179,8,0.2)'] } : {}}
            transition={timerWarning !== 'none' ? { duration: 1, repeat: Infinity } : {}}
            className={`backdrop-blur px-3 py-1 rounded-full border ${
              timerWarning === 'one' ? 'border-red-500/50 bg-red-500/30' :
              timerWarning === 'five' ? 'border-yellow-500/30 bg-yellow-500/20' :
              'border-amber-500/20 bg-black/50'
            }`}>
            <span className={`text-xs font-mono font-bold ${
              timerWarning === 'one' ? 'text-red-300' :
              timerWarning === 'five' ? 'text-yellow-300' :
              'text-amber-200/90'
            }`}>
              {timerWarning === 'expired' ? '⏰ TIME UP!' : `⏱ ${String(timerMins).padStart(2, '0')}:${String(timerSecs).padStart(2, '0')}`}
            </span>
          </motion.div>
        </div>
      </div>

      {isEditor && (
        <div className="absolute top-24 left-4 z-[200] bg-black/90 text-white p-5 rounded-xl border-2 border-amber-500 shadow-[0_0_20px_rgba(255,215,0,0.3)]">
          <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-2"><MapPin className="w-5 h-5"/> Editor Mode Active</h3>
          <p className="text-xs text-white/70 mb-4 max-w-[250px]">Drag the circular nodes around to place them accurately on the painted roads. You can do this live.</p>
          <button onClick={() => {
            const lines = Object.entries(editorPositions)
              .filter(([id]) => id.startsWith('R2_'))
              .map(([id, pos]) => `// Add this to gameMap.ts for ${id}:\nx: ${pos.x.toFixed(1)}, y: ${pos.y.toFixed(1)}`);
            navigator.clipboard.writeText(lines.join('\n\n'));
            alert('Round 2 Coordinates Copied to Clipboard! Open src/data/gameMap.ts and replace the values!');
          }} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg transition-colors">
            Export R2 Coordinates
          </button>
        </div>
      )}

      {/* Scrollable Map Container */}
      <div ref={containerRef} className="w-full h-full overflow-auto">
        <div ref={mapRef} className="relative" style={{ width: MAP_W, height: MAP_H, minWidth: MAP_W, minHeight: MAP_H, background: '#05020a' }}>
          <img src={mapImage} alt="Fantasy Map" className="absolute inset-0 w-full h-full object-cover" draggable={false} />

          {/* Floating magical particles */}
          {[1,2,3,4,5].map(i => (
            <motion.div key={i} className="absolute pointer-events-none"
              style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,215,0,0.6)', boxShadow: '0 0 10px rgba(255,215,0,0.4)',
                top: `${10 + i * 15}%`, left: `${5 + i * 18}%` }}
              animate={{ y: [0, -40, 0], x: [0, 20, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* SVG Paths + Visited trail */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
            {/* Visited path trail - golden glowing line */}
            {visitedPath.length > 1 && (
              <motion.polyline
                points={visitedPath.map(p => `${(p.x / 100) * MAP_W},${(p.y / 100) * MAP_H}`).join(' ')}
                fill="none"
                stroke="rgba(255,215,0,0.6)"
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="12 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
              />
            )}
            {visitedPath.length > 1 && (
              <polyline
                points={visitedPath.map(p => `${(p.x / 100) * MAP_W},${(p.y / 100) * MAP_H}`).join(' ')}
                fill="none"
                stroke="rgba(255,215,0,0.15)"
                strokeWidth={16}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Edge connections */}
            {visibleEdges.map((edge, i) => {
              const from = editorPositions[edge.from];
              const to = editorPositions[edge.to];
              if (!from || !to) return null;
              
              const fx = (from.x / 100) * MAP_W, fy = (from.y / 100) * MAP_H;
              const tx = (to.x / 100) * MAP_W, ty = (to.y / 100) * MAP_H;
              const isActive = edge.from === currentNode || edge.to === currentNode;
              const midX = (fx + tx) / 2, midY = (fy + ty) / 2;
              const dx = tx - fx, dy = ty - fy;
              const cx = midX + dy * 0.2, cy = midY - dx * 0.2;
              let strokeColor = 'rgba(255,215,0,0.15)';
              let width = 5;
              if (edge.type === 'trap') strokeColor = isActive ? 'rgba(155,35,53,0.7)' : 'rgba(155,35,53,0.25)';
              else if (edge.type === 'bonus') strokeColor = isActive ? 'rgba(197,160,40,0.7)' : 'rgba(197,160,40,0.25)';
              else strokeColor = isActive ? 'rgba(255,215,0,0.7)' : 'rgba(255,215,0,0.2)';
              if (isActive) width = 7;
              const dash = edge.type === 'bonus' ? '14 7' : edge.type === 'trap' ? '8 5' : undefined;
              return (
                <g key={`${edge.from}-${edge.to}-${i}`}>
                  <motion.path d={`M ${fx} ${fy} Q ${cx} ${cy} ${tx} ${ty}`}
                    fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth={width + 3}
                    strokeLinecap="round" strokeDasharray={dash}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: i * 0.02 }} />
                  <motion.path d={`M ${fx} ${fy} Q ${cx} ${cy} ${tx} ${ty}`}
                    fill="none" stroke={strokeColor} strokeWidth={width}
                    strokeLinecap="round" strokeDasharray={dash}
                    initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: i * 0.02 }} />
                </g>
              );
            })}
          </svg>

          {/* Milestone markers on the path (every 5 main nodes) */}
          {visitedPath.filter((_, idx) => idx > 0 && idx % 5 === 0 && idx < visitedPath.length).map((pos, i) => (
            <motion.div key={`milestone-${i}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute pointer-events-none"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -80%)', zIndex: 15 }}>
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }}
                className="text-center">
                <span className="text-3xl drop-shadow-lg">{MILESTONE_ITEMS[i % MILESTONE_ITEMS.length].emoji}</span>
                <span className="block text-[8px] font-bold text-amber-300 bg-black/60 rounded px-1 mt-0.5">
                  {MILESTONE_ITEMS[i % MILESTONE_ITEMS.length].label}
                </span>
              </motion.div>
            </motion.div>
          ))}

          {/* Nodes */}
          <AnimatePresence>
            {visibleNodes.map((n, i) => {
              const pos = editorPositions[n.id];
              if (!pos) return null;
              const isActive = n.id === currentNode;
              const isVisited = visitedNodes.includes(n.id) && !isActive;
              const isLocked = !visitedNodes.includes(n.id) && !isActive;
              const colors = getNodeColors(n.type);
              const size = n.type === 'final' || n.type === 'waiting' ? 68 : n.type === 'start' ? 60 : n.type === 'cutscene' ? 48 : 52;
              const isCrossing = nodeCrossAnim === n.id;

              return (
                <motion.div key={n.id}
                  onPointerDown={e => handlePointerDown(e, n.id)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: i * 0.03 }}
                  className="absolute"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)', zIndex: isActive ? 25 : 10, cursor: isEditor ? 'move' : 'default' }}>
                  
                  {/* Node crossing burst animation */}
                  {isCrossing && (
                    <>
                      {[0, 1, 2, 3, 4, 5].map(j => (
                        <motion.div key={j} className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
                          style={{ width: 8, height: 8, background: colors.text, boxShadow: `0 0 8px ${colors.shadow}` }}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                          animate={{
                            x: Math.cos((j / 6) * Math.PI * 2) * 60,
                            y: Math.sin((j / 6) * Math.PI * 2) * 60,
                            opacity: 0, scale: 0
                          }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      ))}
                      <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                        style={{ background: `radial-gradient(circle, ${colors.shadow}, transparent)` }}
                        initial={{ width: 20, height: 20, opacity: 0.8 }}
                        animate={{ width: 120, height: 120, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                      />
                    </>
                  )}

                  {isActive && (
                    <>
                      <motion.div className="absolute rounded-full"
                        style={{ width: size + 28, height: size + 28, left: -14, top: -14,
                          background: `radial-gradient(circle, ${colors.shadow} 0%, transparent 70%)` }}
                        animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.3, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity }} />
                      <motion.div className="absolute left-1/2 -translate-x-1/2" style={{ top: -28 }}
                        animate={{ y: [0, -8, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
                        <ChevronDown className="w-5 h-5 text-amber-300 drop-shadow-lg" />
                      </motion.div>
                    </>
                  )}
                  <div className="rounded-full flex items-center justify-center cursor-pointer relative"
                    style={{
                      width: size, height: size,
                      background: isLocked ? 'linear-gradient(180deg, #555 0%, #333 100%)' :
                        isVisited ? `linear-gradient(180deg, ${colors.bg}99 0%, ${colors.border}99 100%)` :
                        `linear-gradient(180deg, ${colors.bg} 0%, ${colors.border} 100%)`,
                      boxShadow: isActive ? `0 4px 15px ${colors.shadow}, 0 0 25px ${colors.shadow}` :
                        '0 4px 8px rgba(0,0,0,0.3)',
                      border: `3px solid ${isLocked ? '#444' : colors.border}`,
                    }}>
                    <div className="absolute rounded-full"
                      style={{ width: size * 0.6, height: size * 0.3, top: 4, left: '50%', transform: 'translateX(-50%)',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)', borderRadius: '50%' }} />
                    {isLocked ? <Lock className="w-4 h-4 text-gray-400" /> :
                      <span className="text-white drop-shadow-md relative z-10">{getNodeIcon(n.type, 'w-5 h-5')}</span>}
                    {isVisited && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center border-2 border-white shadow-md">
                        <span className="text-white text-[9px] font-bold">✓</span>
                      </div>
                    )}
                    {isVisited && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {[1,2,3].map(s => <Star key={s} className="w-2.5 h-2.5 text-amber-400 fill-amber-400 drop-shadow" />)}
                      </div>
                    )}
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center" style={{ top: size + 6 }}>
                    <span className="text-[9px] font-bold block px-2 py-0.5 rounded-full shadow-md"
                      style={{
                        background: isActive ? colors.bg : isVisited ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
                        color: isActive ? 'white' : isVisited ? '#ddd' : '#888',
                        border: isActive ? `2px solid ${colors.border}` : '1px solid rgba(255,255,255,0.1)',
                      }}>
                      {n.type === 'final' ? '🏆 VICTORY' : n.type === 'waiting' ? '🏆 R1 DONE' : n.type === 'start' ? '🧙 START' : n.id.replace('R1_', '').replace('R2_', '')}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Question Panel */}
          {node && node.type !== 'waiting' && (
            <motion.div key={`panel-${currentNode}`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
              className="absolute"
              style={{
                left: `${Math.min(Math.max(editorPositions[currentNode]?.x || 50, 15), 75)}%`,
                top: `${Math.min((editorPositions[currentNode]?.y || 50) + 5, 90)}%`,
                transform: 'translateX(-50%)', zIndex: 30, width: '440px',
              }}>
              <div className="absolute left-1/2 -top-3 w-6 h-6 rotate-45 -translate-x-1/2" style={{ background: 'rgba(30,15,40,0.95)' }} />
              <div className="rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: 'rgba(30,15,40,0.95)', border: `2px solid ${nodeColors.border}`, backdropFilter: 'blur(20px)' }}>
                <div className="px-4 py-2.5 flex items-center justify-between"
                  style={{ background: `linear-gradient(135deg, ${nodeColors.bg} 0%, ${nodeColors.border} 100%)` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-white drop-shadow">{getNodeIcon(node.type, 'w-5 h-5')}</span>
                    <span className="font-bold text-xs text-white drop-shadow tracking-wide truncate max-w-[200px]">{node.title}</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/30 text-white/90 border border-white/20">
                    {node.type === 'trap' ? '⚠️ TRAP' : node.type === 'bonus' ? '⭐ SECRET' : node.type === 'return' ? '🔄 RECOVERY' : node.type === 'final' ? '🏆 FINAL' : '🪄 QUEST'}
                  </span>
                </div>
                <div className="px-4 py-3 max-h-[110px] overflow-y-auto">
                  <TerminalText text={node.storyText} speed={10} onComplete={() => setStoryDone(true)}
                    className="text-xs leading-relaxed text-amber-100/80" />
                </div>
                {storyDone && node.type === 'start' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-white/10 px-4 py-4 flex justify-center">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => onSubmitAnswer('START_QUEST')}
                      className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-xl flex items-center justify-center gap-2"
                      style={{ background: `linear-gradient(135deg, ${nodeColors.bg}, ${nodeColors.border})` }}>
                      START QUEST <Wand2 className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                )}
                {storyDone && node.type !== 'final' && node.type !== 'start' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-white/10 px-4 py-3 space-y-2.5">
                    <div className="flex items-start gap-2">
                       <ShieldAlert className="w-5 h-5 mt-0 flex-shrink-0" style={{ color: nodeColors.text }} />
                       <p className="text-sm font-medium leading-relaxed" style={{ color: nodeColors.text }}>{node.question}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-2 rounded-xl px-4 py-3"
                        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
                        <span className="text-xl text-amber-400">⚡</span>
                        <input value={answer} onChange={e => setAnswer(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                          placeholder="Cast your answer..." autoFocus
                          className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/20 font-mono" />
                      </div>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleSubmit}
                        className="px-4 py-3 rounded-xl text-white text-sm font-bold flex items-center gap-1 shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${nodeColors.bg}, ${nodeColors.border})` }}>
                        <Send className="w-4 h-4" />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
                        if (window.confirm("Skip this node? First 2 are free, then it costs 1.5 points!")) {
                          onSkipNode();
                        }
                      }}
                        className="px-3 py-3 rounded-xl text-white/80 text-xs font-bold flex items-center gap-1 shadow-lg border border-white/20"
                        style={{ background: `rgba(255,255,255,0.05)` }}>
                        ⏭️ SKIP
                      </motion.button>
                      {node.hint && !showHint && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => {
                          if (window.confirm("Reveal Hint? You only get 3 per round!")) {
                            if (onUseHint()) setShowHint(true);
                          }
                        }}
                          className="px-3 py-3 rounded-xl text-white/80 text-xs font-bold flex items-center gap-1 shadow-lg border border-white/20"
                          style={{ background: `rgba(255,255,255,0.05)` }}>
                          💡 HINT
                        </motion.button>
                      )}
                    </div>
                    {showHint && node.hint && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 p-2.5 rounded-xl text-xs leading-relaxed text-amber-100 bg-amber-500/20 border border-amber-500/40 shadow-inner">
                        <span className="font-bold text-amber-300">💡 Hint:</span> {node.hint}
                      </motion.div>
                    )}
                    {node.secretCode && (
                      <div>
                        {!showSecret ? (
                          <motion.button whileHover={{ x: 3 }} onClick={() => setShowSecret(true)}
                            className="text-[10px] text-purple-400/70 hover:text-purple-300 transition-colors flex items-center gap-1">
                            <Zap className="w-3 h-3" /> 🔮 Know a secret spell?
                          </motion.button>
                        ) : (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                            <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2"
                              style={{ background: 'rgba(126,34,206,0.1)', border: '1px solid rgba(126,34,206,0.3)' }}>
                              <span className="text-purple-400">🪄</span>
                              <input value={secretCode} onChange={e => setSecretCode(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSecret()}
                                placeholder="Secret spell..."
                                className="bg-transparent border-none outline-none text-white text-[11px] w-full placeholder:text-white/20 font-mono" />
                            </div>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSecret}
                              className="px-3 py-2 bg-purple-600/20 border border-purple-500/40 rounded-xl text-purple-300 text-[10px] font-bold">
                              CAST
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
                {/* Final screen */}
                {node.type === 'final' && storyDone && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="px-4 py-5 text-center border-t border-white/10">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-2 drop-shadow-lg" />
                    </motion.div>
                    <p className="font-bold text-xl text-amber-400 mb-1">⚡ VOLDEMORT DEFEATED!</p>
                    <p className="text-xs text-gray-400">Correct: {team.correctAnswers} • Traps: {team.trapHits} • Keys: {milestoneIndex}</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {[1,2,3].map(s => (
                        <motion.div key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: s * 0.2 }}>
                          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {/* Feedback bar */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }} className="px-4 py-2.5 text-xs font-bold border-t border-white/10"
                      style={{
                        background: feedback.type === 'success' ? 'rgba(4,120,87,0.2)' : feedback.type === 'secret' ? 'rgba(126,34,206,0.2)' : 'rgba(155,35,53,0.2)',
                        color: feedback.type === 'success' ? '#6ee7b7' : feedback.type === 'secret' ? '#c4b5fd' : '#f5a0a0',
                      }}>
                      {feedback.msg}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Waiting screen for Round 1 completion */}
          {node?.type === 'waiting' && (
            <motion.div key="waiting-panel"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="absolute"
              style={{
                left: `${editorPositions[currentNode]?.x || 50}%`,
                top: `${(editorPositions[currentNode]?.y || 50) + 5}%`,
                transform: 'translateX(-50%)', zIndex: 30, width: '400px',
              }}>
              <div className="rounded-2xl overflow-hidden shadow-2xl"
                style={{ background: 'rgba(30,15,40,0.95)', border: '2px solid #7c3aed', backdropFilter: 'blur(20px)' }}>
                <div className="px-4 py-3 text-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
                  <span className="text-white font-bold text-sm">🏆 ROUND 1 COMPLETE!</span>
                </div>
                <div className="p-6 text-center space-y-4">
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-5xl">
                    ⚡
                  </motion.div>
                  <p className="text-amber-200 text-sm font-bold">Outstanding, wizard!</p>
                  <p className="text-white/50 text-xs">FLAG: HOGWARTS{'{R0UND_1_COMPLETE}'}</p>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    {/* Expose button if global turn-on happened, else wait */}
                    <button 
                      onClick={() => onSubmitAnswer('CUTSCENE_SKIP')} // We can piggyback here, wait no
                      className="hidden" 
                    />
                    <p className="text-amber-300 text-xs font-bold">⏳ Waiting for the Headmaster...</p>
                    <p className="text-white/40 text-[10px] mt-1">
                      Check your comms. When Admin unlocks Round 2, you will automatically be moved to the next sector when you click any node! Or the Admin can manually advance you.
                    </p>
                  </div>
                  <motion.div className="flex justify-center gap-1"
                    animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                    {[1,2,3].map(d => <div key={d} className="w-2 h-2 rounded-full bg-amber-400" />)}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Decorations */}
          {hpDecorations.map((deco, i) => (
            <div key={i} className="absolute select-none pointer-events-none"
              style={{ left: `${deco.x}%`, top: `${deco.y}%`, fontSize: deco.size, zIndex: 3 }}>
              {deco.emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 py-2"
           style={{ background: 'linear-gradient(0deg, rgba(20,10,30,0.85) 0%, transparent 100%)' }}>
        <div className="flex items-center justify-between text-[10px] font-bold">
          <span className="text-amber-200/60">
            🪄 Solve spells to advance • Wrong = <span className="text-red-400">TRAP</span> rooms • 🔮 = <span className="text-purple-400">SECRET</span> passages
          </span>
          <span className="text-amber-200/40">{visitedNodes.length} nodes explored • {milestoneIndex} keys collected</span>
        </div>
      </div>
    </div>
  );
}
