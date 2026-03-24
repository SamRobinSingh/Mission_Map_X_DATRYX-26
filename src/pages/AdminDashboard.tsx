import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame, type TeamState } from '@/context/GameContext';
import { GAME_NODES, ROUND1_MAIN_NODES, ROUND2_MAIN_NODES } from '@/data/gameMap';
import { ArrowLeft, Trophy, AlertTriangle, Zap, RefreshCw, Crown, Medal, Award, Star, Flame, Shield, Unlock, Lock, Monitor, Minimize2 } from 'lucide-react';

export default function AdminDashboard() {
  const { teams, round2Unlocked, unlockRound2, startRound2ForTeam, eliminateTeam, clearGameData } = useGame();
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<1 | 2>(1);
  const [projectorMode, setProjectorMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll in projector mode
  useEffect(() => {
    if (!projectorMode || !scrollRef.current) return;
    let direction = 1;
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTop += direction * 1.5;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) direction = -1;
      if (el.scrollTop <= 5) direction = 1;
    }, 30);
    return () => clearInterval(interval);
  }, [projectorMode]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const teamList = Object.values(teams);
  const pSize = projectorMode;

  const formatTime = (start: number, end?: number) => {
    const elapsed = Math.floor(((end || Date.now()) - start) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const getR1Progress = (team: TeamState) => {
    const visited = ROUND1_MAIN_NODES.filter(n => team.visitedNodes.includes(n));
    return Math.round((visited.length / ROUND1_MAIN_NODES.length) * 100);
  };

  const getR2Progress = (team: TeamState) => {
    if (team.currentRound < 2) return 0;
    const visited = ROUND2_MAIN_NODES.filter(n => team.visitedNodes.includes(n));
    return Math.round((visited.length / ROUND2_MAIN_NODES.length) * 100);
  };

  const sortedR1 = [...teamList].filter(t => t.currentRound === 1).sort((a, b) => {
    if (a.round1Complete && !b.round1Complete) return -1;
    if (!a.round1Complete && b.round1Complete) return 1;
    if (a.round1Complete && b.round1Complete) return (a.round1EndTime || 0) - a.startTime - ((b.round1EndTime || 0) - b.startTime);
    return getR1Progress(b) - getR1Progress(a);
  });

  const sortedR2 = [...teamList].filter(t => t.currentRound >= 2).sort((a, b) => {
    if (a.isFinished && !b.isFinished) return -1;
    if (!a.isFinished && b.isFinished) return 1;
    if (a.isFinished && b.isFinished) return ((a.round2EndTime || 0) - (a.round2StartTime || 0)) - ((b.round2EndTime || 0) - (b.round2StartTime || 0));
    return getR2Progress(b) - getR2Progress(a);
  });

  const getRankIcon = (i: number) => {
    const sz = pSize ? 'w-8 h-8' : 'w-5 h-5';
    if (i === 0) return <Crown className={`${sz} text-amber-400`} />;
    if (i === 1) return <Medal className={`${sz} text-gray-300`} />;
    if (i === 2) return <Award className={`${sz} text-amber-600`} />;
    return <span className={`${pSize ? 'text-xl' : 'text-sm'} font-bold text-white/40`}>#{i + 1}</span>;
  };

  const getStatusColor = (team: TeamState, round: 1 | 2) => {
    if (team.isEliminated) return { bg: '#dc2626', text: 'ELIMINATED' };
    if (round === 1) {
      if (team.round1Complete) return { bg: '#22c55e', text: 'COMPLETE' };
      const node = GAME_NODES[team.currentNode];
      if (node?.type === 'trap') return { bg: '#9b2335', text: 'IN TRAP' };
      return { bg: '#1d4ed8', text: 'ACTIVE' };
    }
    if (team.isFinished) return { bg: '#22c55e', text: 'COMPLETED' };
    const node = GAME_NODES[team.currentNode];
    if (node?.type === 'trap') return { bg: '#9b2335', text: 'IN TRAP' };
    if (node?.type === 'bonus') return { bg: '#c5a028', text: 'SECRET PATH' };
    return { bg: '#1d4ed8', text: 'ACTIVE' };
  };

  const renderTeamCard = (team: TeamState, i: number, round: 1 | 2) => {
    const progress = round === 1 ? getR1Progress(team) : getR2Progress(team);
    const status = getStatusColor(team, round);
    const stats = (round === 1 ? team.round1Stats : team.round2Stats) || { correct: 0, wrong: 0, traps: 0, shortcuts: 0 };
    const isExpanded = selectedTeam === `${team.teamName}-${round}`;
    const time = round === 1
      ? formatTime(team.startTime, team.round1EndTime)
      : formatTime(team.round2StartTime || team.startTime, team.round2EndTime);

    return (
      <motion.div key={`${team.teamName}-${round}`}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
        onClick={() => !projectorMode && setSelectedTeam(isExpanded ? null : `${team.teamName}-${round}`)}
        className={`rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.01] ${pSize ? 'mb-4' : ''}`}
        style={{
          background: i === 0 ? 'linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(180,120,0,0.05) 100%)' : 'rgba(255,255,255,0.03)',
          border: i === 0 ? '2px solid rgba(255,215,0,0.2)' : '1px solid rgba(255,255,255,0.06)',
        }}>
        <div className={`flex items-center gap-4 ${pSize ? 'p-6' : 'p-4'}`}>
          <div className={`flex-shrink-0 ${pSize ? 'w-14 h-14' : 'w-10 h-10'} rounded-xl bg-white/5 flex items-center justify-center`}>
            {getRankIcon(i)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-bold text-white truncate ${pSize ? 'text-xl' : 'text-sm'}`}>{team.teamName}</span>
              <span className={`font-bold px-2 py-0.5 rounded-full ${pSize ? 'text-xs' : 'text-[9px]'}`}
                style={{ background: `${status.bg}20`, color: status.bg, border: `1px solid ${status.bg}40` }}>
                {status.text}
              </span>
            </div>
            <div className={`flex items-center gap-3 text-white/40 ${pSize ? 'text-sm' : 'text-[10px]'}`}>
              <span>📍 {team.currentNode}</span>
            </div>
          </div>
          <div className={`hidden md:flex items-center gap-4 ${pSize ? 'text-base' : 'text-xs'}`}>
            <div className="text-center"><span className="text-green-400 font-bold block">{stats.correct}</span><span className={`text-white/30 ${pSize ? 'text-xs' : 'text-[9px]'}`}>correct</span></div>
            <div className="text-center"><span className="text-red-400 font-bold block">{stats.wrong}</span><span className={`text-white/30 ${pSize ? 'text-xs' : 'text-[9px]'}`}>wrong</span></div>
            <div className="text-center"><span className="text-red-500 font-bold block">{stats.traps}</span><span className={`text-white/30 ${pSize ? 'text-xs' : 'text-[9px]'}`}>traps</span></div>
            <div className="text-center"><span className="text-slate-300 font-bold block">{team.skipsUsed || 0}</span><span className={`text-white/30 ${pSize ? 'text-xs' : 'text-[9px]'}`}>skips</span></div>
            {round === 2 && <div className="text-center"><span className="text-amber-400 font-bold block">{stats.shortcuts}</span><span className={`text-white/30 ${pSize ? 'text-xs' : 'text-[9px]'}`}>secrets</span></div>}
          </div>
          <div className="flex items-center gap-4">
            <div className={pSize ? 'w-36' : 'w-24'}>
              <div className={`flex items-center justify-between mb-1 ${pSize ? 'text-xs' : 'text-[10px]'}`}>
                <span className="text-white/40">Progress</span>
                <span className="text-white/60 font-bold">{progress}%</span>
              </div>
              <div className={`w-full bg-white/5 rounded-full overflow-hidden ${pSize ? 'h-3' : 'h-2'}`}>
                <motion.div className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${status.bg}, ${status.bg}cc)` }}
                  initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
            <div className="text-right">
              <span className={`font-mono font-bold text-white/80 ${pSize ? 'text-lg' : 'text-sm'}`}>{time}</span>
              <span className={`block text-white/30 ${pSize ? 'text-xs' : 'text-[9px]'}`}>elapsed</span>
            </div>
          </div>
        </div>
        {!projectorMode && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-4 pb-4 pt-1 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-[10px] text-white/40 font-bold tracking-wider">VISITED NODES</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {team.visitedNodes.filter(id => GAME_NODES[id]?.round === round).map((nodeId, ni) => {
                      const n = GAME_NODES[nodeId];
                      const isCurrent = nodeId === team.currentNode;
                      let bg = 'rgba(29,78,216,0.15)', color = '#93c5fd';
                      if (n?.type === 'trap') { bg = 'rgba(155,35,53,0.15)'; color = '#f5a0a0'; }
                      if (n?.type === 'bonus') { bg = 'rgba(197,160,40,0.15)'; color = '#fde68a'; }
                      if (n?.type === 'final' || n?.type === 'waiting') { bg = 'rgba(124,58,237,0.15)'; color = '#c4b5fd'; }
                      return (
                        <motion.span key={ni} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: ni * 0.03 }}
                          className="text-[9px] font-bold px-2 py-1 rounded-lg"
                          style={{ background: bg, color, border: isCurrent ? `2px solid ${color}` : `1px solid ${color}30` }}>
                          {isCurrent ? '📍 ' : ''}{nodeId}
                        </motion.span>
                      );
                    })}
                  </div>
                  {((round === 1 && team.round1Complete) || (round === 2 && team.isFinished)) && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 rounded-xl overflow-hidden border border-amber-500/20">
                      <div className="bg-amber-500/10 px-3 py-2 flex items-center gap-2">
                        <span className="text-lg">🎉</span>
                        <span className="text-xs font-bold text-amber-400">{round === 1 ? 'ROUND 1 COMPLETE!' : 'VOLDEMORT DEFEATED!'}</span>
                        <div className="flex gap-0.5 ml-auto">
                          {[1,2,3].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {round === 1 && team.currentRound === 1 && !team.isEliminated && (
                    <div className="flex gap-2 mt-3 w-full">
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); startRound2ForTeam(team.teamName); }}
                        className="flex-1 py-2.5 rounded-xl text-[10px] font-bold tracking-wider transition-all"
                        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(109,40,217,0.1))',
                          border: '1px solid rgba(124,58,237,0.4)', color: '#c4b5fd' }}>
                        <Zap className="w-3 h-3 inline mr-1 mb-0.5" />
                        ADVANCE
                      </motion.button>
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); eliminateTeam(team.teamName); }}
                        className="flex-1 py-2.5 rounded-xl text-[10px] font-bold tracking-wider transition-all"
                        style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.2), rgba(185,28,28,0.1))',
                          border: '1px solid rgba(220,38,38,0.4)', color: '#fca5a5' }}>
                        <AlertTriangle className="w-3 h-3 inline mr-1 mb-0.5" />
                        END GAME
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a0515 0%, #1a0a2e 50%, #0a0515 100%)' }}>
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(124,58,237,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,215,0,0.1) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(4,120,87,0.1) 0%, transparent 50%)',
        }} />
      </div>

      <div className={`mx-auto relative z-10 ${pSize ? 'max-w-full p-8' : 'max-w-7xl p-6'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {!projectorMode && (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/')}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <ArrowLeft className="w-5 h-5 text-white/60" />
              </motion.button>
            )}
            <div>
              <h1 className={`font-display tracking-widest text-amber-400 font-bold flex items-center gap-3 ${pSize ? 'text-4xl' : 'text-2xl'}`}
                style={{ textShadow: '0 0 15px rgba(255,215,0,0.3)' }}>
                <Trophy className={pSize ? 'w-10 h-10' : 'w-7 h-7'} />
                HEADMASTER'S OFFICE
              </h1>
              <p className={`text-white/40 mt-0.5 ${pSize ? 'text-sm' : 'text-xs'}`}>Mission Control • Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setProjectorMode(!projectorMode); if (!projectorMode) toggleFullscreen(); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                projectorMode ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'bg-white/5 border-white/10 text-white/50'
              } border text-xs`}>
              {projectorMode ? <Minimize2 className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
              {projectorMode ? 'Exit Projector' : 'Projector Mode'}
            </motion.button>
            {!projectorMode && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const p = window.prompt("⚠️ WARNING: This will permanently delete all teams and scores!\nEnter admin password to confirm:");
                  if (p === 'vampire2005') {
                    clearGameData();
                  } else if (p !== null) {
                    alert("Incorrect admin password. Reset cancelled.");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 text-xs">
                <AlertTriangle className="w-4 h-4" />
                RESET DATA
              </motion.button>
            )}
            <div className={`flex items-center gap-2 text-white/50 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 ${pSize ? 'text-sm' : 'text-xs'}`}>
              <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
              <span>LIVE • {teamList.length} HOUSES</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Active Teams', value: teamList.filter(t => !t.isFinished).length, gradient: 'from-blue-600 to-blue-800', emoji: '🧙' },
            { label: 'R1 Completed', value: teamList.filter(t => t.round1Complete).length, gradient: 'from-green-600 to-green-800', emoji: '⚡' },
            { label: 'R2 Completed', value: teamList.filter(t => t.isFinished).length, gradient: 'from-purple-600 to-purple-800', emoji: '🏆' },
            { label: 'Total Traps', value: teamList.reduce((s, t) => s + t.trapHits, 0), gradient: 'from-red-600 to-red-800', emoji: '💀' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-4 relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full`} />
              <div className="flex items-center gap-2 mb-2">
                <span className={pSize ? 'text-2xl' : 'text-lg'}>{stat.emoji}</span>
                <span className={`text-white/40 tracking-wider uppercase font-bold ${pSize ? 'text-xs' : 'text-[10px]'}`}>{stat.label}</span>
              </div>
              <p className={`font-display font-bold text-white ${pSize ? 'text-5xl' : 'text-3xl'}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>



        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[1, 2].map(round => (
            <button key={round} onClick={() => setActiveTab(round as 1 | 2)}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${pSize ? 'text-base' : 'text-sm'}`}
              style={{
                background: activeTab === round ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))' : 'rgba(255,255,255,0.03)',
                border: activeTab === round ? '2px solid rgba(255,215,0,0.3)' : '1px solid rgba(255,255,255,0.06)',
                color: activeTab === round ? '#fbbf24' : 'rgba(255,255,255,0.4)',
              }}>
              {round === 1 ? '⚡ Round 1 Leaderboard' : '💀 Round 2 Leaderboard'}
            </button>
          ))}
        </div>

        {/* Leaderboard with auto-scroll container */}
        <div ref={scrollRef} className={projectorMode ? 'max-h-[60vh] overflow-y-auto scroll-smooth' : ''}>
          {activeTab === 1 ? (
            sortedR1.length === 0 ? (
              <div className="text-center py-20">
                <span className={`mb-4 block ${pSize ? 'text-7xl' : 'text-5xl'}`}>🧙</span>
                <p className={`text-white/50 font-bold ${pSize ? 'text-lg' : 'text-sm'}`}>No wizards have enrolled yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedR1.map((team, i) => renderTeamCard(team, i, 1))}
              </div>
            )
          ) : (
            sortedR2.length === 0 ? (
              <div className="text-center py-20">
                <span className={`mb-4 block ${pSize ? 'text-7xl' : 'text-5xl'}`}>🌑</span>
                <p className={`text-white/50 font-bold ${pSize ? 'text-lg' : 'text-sm'}`}>
                  {round2Unlocked ? 'No teams in Round 2 yet' : 'Round 2 is locked. Unlock it above!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedR2.map((team, i) => renderTeamCard(team, i, 2))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
