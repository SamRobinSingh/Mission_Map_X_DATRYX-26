import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameNode, GAME_NODES } from '@/data/gameMap';
import { TeamState } from '@/context/GameContext';
import TerminalText from '@/components/TerminalText';
import { Zap, Send, ShieldAlert, Star, Trophy, AlertTriangle, MapPin, Rocket, Shield } from 'lucide-react';

interface MissionPanelProps {
  node: GameNode;
  team: TeamState;
  onSubmitAnswer: (answer: string) => void;
  onSubmitSecret: (code: string) => void;
  feedback: { msg: string; type: 'success' | 'error' | 'secret' } | null;
}

function getTypeConfig(type: string) {
  switch (type) {
    case 'trap': return { 
      icon: <AlertTriangle className="w-4 h-4" />, 
      label: 'TRAP SECTOR', 
      accent: 'neon-red',
      borderClass: 'border-neon-red/40',
      bgClass: 'bg-neon-red/5',
      glowClass: 'shadow-[0_0_30px_hsl(var(--neon-red)/0.15)]',
    };
    case 'return': return { 
      icon: <Shield className="w-4 h-4" />, 
      label: 'RECOVERY', 
      accent: 'neon-yellow',
      borderClass: 'border-neon-yellow/40',
      bgClass: 'bg-neon-yellow/5',
      glowClass: 'shadow-[0_0_30px_hsl(var(--neon-yellow)/0.1)]',
    };
    case 'bonus': return { 
      icon: <Star className="w-4 h-4" />, 
      label: 'SECRET SHORTCUT', 
      accent: 'neon-yellow',
      borderClass: 'border-neon-yellow/40',
      bgClass: 'bg-neon-yellow/5',
      glowClass: 'shadow-[0_0_30px_hsl(var(--neon-yellow)/0.15)]',
    };
    case 'final': return { 
      icon: <Trophy className="w-4 h-4" />, 
      label: 'FINAL OBJECTIVE', 
      accent: 'neon-cyan',
      borderClass: 'border-neon-cyan/40',
      bgClass: 'bg-neon-cyan/5',
      glowClass: 'shadow-[0_0_30px_hsl(var(--neon-cyan)/0.15)]',
    };
    case 'start': return { 
      icon: <Rocket className="w-4 h-4" />, 
      label: 'MISSION START', 
      accent: 'primary',
      borderClass: 'border-primary/40',
      bgClass: 'bg-primary/5',
      glowClass: 'shadow-[0_0_30px_hsl(var(--primary)/0.15)]',
    };
    default: return { 
      icon: <MapPin className="w-4 h-4" />, 
      label: 'MISSION NODE', 
      accent: 'primary',
      borderClass: 'border-primary/40',
      bgClass: 'bg-primary/5',
      glowClass: 'shadow-[0_0_30px_hsl(var(--primary)/0.1)]',
    };
  }
}

export default function MissionPanel({ node, team, onSubmitAnswer, onSubmitSecret, feedback }: MissionPanelProps) {
  const [answer, setAnswer] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [storyDone, setStoryDone] = useState(false);

  // Reset state when node changes
  useEffect(() => {
    setAnswer('');
    setSecretCode('');
    setShowSecret(false);
    setStoryDone(false);
  }, [node.id]);

  const config = getTypeConfig(node.type);
  const elapsed = Math.floor((Date.now() - team.startTime) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onSubmitAnswer(answer);
    setAnswer('');
  };

  const handleSecret = () => {
    if (!secretCode.trim()) return;
    onSubmitSecret(secretCode);
    setSecretCode('');
  };

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Mission type badge & node ID */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border ${config.borderClass} ${config.bgClass}`}>
            {config.icon}
            {config.label}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/50">{node.id}</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/40">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>

      {/* Main mission card */}
      <div className={`rounded-xl border ${config.borderClass} ${config.bgClass} ${config.glowClass} overflow-hidden`}>
        {/* Title bar */}
        <div className={`px-4 py-2.5 border-b ${config.borderClass} bg-card/50`}>
          <h3 className="font-display text-sm text-foreground tracking-wide">{node.title}</h3>
        </div>

        {/* Story text */}
        <div className="px-4 py-4 min-h-[100px]">
          <TerminalText
            text={node.storyText}
            speed={12}
            onComplete={() => setStoryDone(true)}
          />
        </div>

        {/* Question section */}
        {storyDone && node.type !== 'final' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-border/20"
          >
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <p className="text-sm text-accent font-medium leading-relaxed">{node.question}</p>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 border border-border/30 rounded-lg bg-background/50 px-3 py-2.5 focus-within:border-primary/50 transition-colors">
                  <span className="text-primary text-sm font-bold">›</span>
                  <input
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    placeholder="Enter your answer..."
                    className="bg-transparent border-none outline-none text-foreground text-sm w-full placeholder:text-muted-foreground/30 font-mono"
                    autoFocus
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="px-4 py-2.5 bg-primary/20 border border-primary/50 rounded-lg text-primary text-xs font-display tracking-wider hover:bg-primary/30 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  SUBMIT
                </motion.button>
              </div>

              {node.secretCode && (
                <div className="pt-1">
                  {!showSecret ? (
                    <motion.button
                      whileHover={{ x: 3 }}
                      onClick={() => setShowSecret(true)}
                      className="text-[10px] text-neon-purple/60 hover:text-neon-purple transition-colors flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" /> Found a secret code?
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2"
                    >
                      <div className="flex-1 flex items-center gap-2 border border-neon-purple/20 rounded-lg bg-neon-purple/5 px-3 py-2">
                        <span className="text-neon-purple text-sm">⚿</span>
                        <input
                          value={secretCode}
                          onChange={e => setSecretCode(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSecret()}
                          placeholder="Secret code..."
                          className="bg-transparent border-none outline-none text-foreground text-sm w-full placeholder:text-muted-foreground/30 font-mono"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSecret}
                        className="px-3 py-2 bg-neon-purple/10 border border-neon-purple/30 rounded-lg text-neon-purple text-xs font-display hover:bg-neon-purple/20 transition-all"
                      >
                        DECODE
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              )}

              {node.hint && (
                <p className="text-[10px] text-muted-foreground/40 italic">💡 {node.hint}</p>
              )}
            </div>
          </motion.div>
        )}

        {node.type === 'final' && storyDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-6 text-center border-t border-border/20"
          >
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <Trophy className="w-10 h-10 text-neon-cyan mx-auto mb-3" />
            </motion.div>
            <p className="font-display text-xl text-neon-cyan neon-glow-cyan mb-2">MISSION COMPLETE</p>
            <p className="text-[11px] text-muted-foreground">
              Time: {mins}m {secs}s • Correct: {team.correctAnswers} • Traps: {team.trapHits} • Shortcuts: {team.shortcutsFound}
            </p>
          </motion.div>
        )}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-3 rounded-lg text-sm border backdrop-blur ${
              feedback.type === 'success'
                ? 'bg-primary/10 border-primary/30 text-primary'
                : feedback.type === 'secret'
                ? 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple'
                : 'bg-destructive/10 border-destructive/30 text-destructive'
            }`}
          >
            {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats bar */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/20 border border-border/10">
        <div className="flex gap-4 text-[10px] text-muted-foreground">
          <span>✅ {team.correctAnswers}</span>
          <span>❌ {team.wrongAnswers}</span>
          <span>⚡ {team.shortcutsFound}</span>
          <span>💀 {team.trapHits}</span>
        </div>
        <span className="text-[10px] text-muted-foreground/40 font-mono">
          Node {team.visitedNodes.length}/{Object.keys(GAME_NODES).length}
        </span>
      </div>
    </motion.div>
  );
}
