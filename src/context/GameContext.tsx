import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.PROD ? window.location.origin : 'http://localhost:3000');
import { GAME_NODES } from '@/data/gameMap';

export interface TeamState {
  teamName: string;
  passcode: string;
  currentNode: string;
  visitedNodes: string[];
  wrongAnswers: number;
  correctAnswers: number;
  trapHits: number;
  shortcutsFound: number;
  skipsUsed: number;
  startTime: number;
  endTime?: number;
  isFinished: boolean;
  questionOrder?: number[];
  r1HintsUsed?: number;
  r2HintsUsed?: number;
  // Round tracking
  currentRound: 1 | 2;
  round1Complete: boolean;
  round1EndTime?: number;
  round2StartTime?: number;
  round2EndTime?: number;
  pendingRound2?: boolean;
  videoQueue?: number[];
  isEliminated?: boolean;
  // Per-round stats
  round1Stats: { correct: number; wrong: number; traps: number; shortcuts: number };
  round2Stats: { correct: number; wrong: number; traps: number; shortcuts: number };
}

import { ROUND1_QUESTION_POOL } from '@/data/questions';

export function getDynamicNode(nodeId: string, questionOrder?: number[]) {
  const node = GAME_NODES[nodeId];
  if (!node) return node;
  if (node.round === 1 && node.type === 'normal' && questionOrder) {
    const qIndex = parseInt(node.id.replace('R1_N', '')) - 1;
    if (!isNaN(qIndex) && questionOrder[qIndex] !== undefined) {
      const poolIndex = questionOrder[qIndex];
      const q = ROUND1_QUESTION_POOL[poolIndex];
      if (q) {
        return {
          ...node,
          title: `🔮 Mystery ${qIndex + 1}`,
          storyText: q.story,
          question: q.question,
          correctAnswer: q.correctAnswer,
          hint: q.hint || node.hint
        };
      }
    }
  }
  return node;
}

export function checkFuzzyAnswer(input: string, target: string): boolean {
  const s1 = input.trim().toLowerCase();
  const s2 = target.trim().toLowerCase();
  if (s1 === s2) return true;
  if (s1 === 'output' && s2 === 'output') return true;

  let longer = s1, shorter = s2;
  if (s1.length < s2.length) { longer = s2; shorter = s1; }
  const lLen = longer.length;
  if (lLen === 0) return true;

  const costs = new Array(shorter.length + 1).fill(0).map((_, i) => i);
  for (let i = 0; i < longer.length; i++) {
    let nw = costs[0]; costs[0] = i + 1;
    for (let j = 0; j < shorter.length; j++) {
      const c = costs[j + 1];
      if (longer[i] === shorter[j]) costs[j + 1] = nw;
      else costs[j + 1] = Math.min(costs[j], costs[j + 1], nw) + 1;
      nw = c;
    }
  }
  return ((lLen - costs[shorter.length]) / lLen) >= 0.75; // 75% similarity threshold
}

// ... Context Types & Setup ...

interface GameContextType {
  teams: Record<string, TeamState>;
  currentTeam: TeamState | null;
  currentTeamName: string | null;
  isInitialized: boolean;
  registerTeam: (name: string, passcode: string) => boolean;
  loginTeam: (name: string, passcode: string) => boolean;
  submitAnswer: (answer: string) => { correct: boolean; nextNode: string; message: string; isSecret?: boolean };
  submitSecretCode: (code: string) => { found: boolean; nextNode?: string; message: string };
  skipNode: () => { nextNode: string; message: string; skipsUsed: number };
  useHint: () => { success: boolean; message: string; hintsUsed: number };
  logoutTeam: () => void;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  round2Unlocked: boolean;
  unlockRound2: () => void;
  startRound2ForTeam: (teamName?: string) => void;
  eliminateTeam: (teamName: string) => void;
  advanceVideoQueue: () => void;
  clearGameData: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

const STORAGE_KEY = 'spy_mission_teams';
const TEAM_KEY = 'spy_mission_current_team';
const ROUND2_KEY = 'spy_mission_round2_unlocked';

function loadTeams(): Record<string, TeamState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}
function saveTeams(teams: Record<string, TeamState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [teams, setTeams] = useState<Record<string, TeamState>>({});
  const [currentTeamName, setCurrentTeamName] = useState<string | null>(() => localStorage.getItem(TEAM_KEY));
  const [isAdmin, setIsAdmin] = useState(false);
  const [round2Unlocked, setRound2Unlocked] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    socket.on('initialState', (state) => {
      setTeams(state.teams || {});
      setRound2Unlocked(state.round2Unlocked || false);
      setIsInitialized(true);
    });

    socket.on('teamUpdated', (team: TeamState) => {
      setTeams(prev => ({ ...prev, [team.teamName]: team }));
    });

    socket.on('round2UnlockedUpdate', (unlocked: boolean) => {
      setRound2Unlocked(unlocked);
    });

    socket.on('clearData', () => {
      setTeams({});
      setRound2Unlocked(false);
      // Keep admin logged in for dashboard, boot students
      setCurrentTeamName(prev => isAdmin ? prev : null);
    });

    return () => {
      socket.off('initialState');
      socket.off('teamUpdated');
      socket.off('round2UnlockedUpdate');
      socket.off('clearData');
    };
  }, [isAdmin]);

  useEffect(() => {
    if (currentTeamName) localStorage.setItem(TEAM_KEY, currentTeamName);
    else localStorage.removeItem(TEAM_KEY);
  }, [currentTeamName]);

  const currentTeam = currentTeamName ? teams[currentTeamName] || null : null;

  const clearGameData = useCallback(() => {
    socket.emit('triggerClearData');
  }, []);

  const registerTeam = useCallback((name: string, passcode: string): boolean => {
    const key = name.trim().toUpperCase();
    if (!key || !passcode.trim() || teams[key]) return false;
    
    // Generate randomized questions array
    const qOrder = Array.from({length: ROUND1_QUESTION_POOL.length}, (_, i) => i);
    for (let i = qOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [qOrder[i], qOrder[j]] = [qOrder[j], qOrder[i]];
    }

    const newTeam: TeamState = {
      teamName: key, passcode: passcode.trim(), currentNode: 'R1_START', visitedNodes: ['R1_START'],
      wrongAnswers: 0, correctAnswers: 0, trapHits: 0, shortcutsFound: 0, skipsUsed: 0,
      r1HintsUsed: 0, r2HintsUsed: 0,
      startTime: Date.now(), isFinished: false, questionOrder: qOrder,
      currentRound: 1, round1Complete: false,
      round1Stats: { correct: 0, wrong: 0, traps: 0, shortcuts: 0 },
      round2Stats: { correct: 0, wrong: 0, traps: 0, shortcuts: 0 }
    };
    
    // Emit the team before setting
    setTimeout(() => socket.emit('syncTeam', newTeam), 0);
    setTeams(prev => ({ ...prev, [key]: newTeam }));
    setCurrentTeamName(key);
    return true;
  }, [teams]);

  const loginTeam = useCallback((name: string, passcode: string): boolean => {
    const key = name.trim().toUpperCase();
    if (teams[key] && teams[key].passcode === passcode.trim()) { setCurrentTeamName(key); return true; }
    return false;
  }, [teams]);

  const logoutTeam = useCallback(() => setCurrentTeamName(null), []);

  const unlockRound2 = useCallback(() => {
    socket.emit('triggerUnlockRound2');
  }, []);

  const startRound2ForTeam = useCallback((teamName?: string) => {
    const targetTeam = teamName || currentTeamName;
    if (!targetTeam || !teams[targetTeam]) return;
    setTeams(prev => {
      const updated = { ...prev[targetTeam] };
      updated.round1Complete = true;
      updated.round1EndTime = updated.round1EndTime || Date.now();
      
      const highestQ = updated.visitedNodes
        .filter(n => n.startsWith('R1_N'))
        .map(n => parseInt(n.replace('R1_N', '')))
        .filter(n => !isNaN(n))
        .reduce((max, val) => Math.max(max, val), 0);
        
      const q = [];
      for (let i = highestQ + 1; i <= 20; i++) q.push(i);

      if (q.length > 0) {
        updated.videoQueue = q;
      } else {
        updated.currentRound = 2;
        updated.currentNode = 'R2_START';
        updated.visitedNodes = [...updated.visitedNodes, 'R2_START'];
        updated.round2StartTime = Date.now();
      }
      setTimeout(() => socket.emit('syncTeam', updated), 0);
      return { ...prev, [targetTeam]: updated };
    });
  }, [currentTeamName, teams]);

  const advanceVideoQueue = useCallback(() => {
    if (!currentTeamName) return;
    setTeams(prev => {
      const updated = { ...prev[currentTeamName] };
      if (updated.videoQueue && updated.videoQueue.length > 0) {
        updated.videoQueue = updated.videoQueue.slice(1);
        if (updated.videoQueue.length === 0) {
           updated.currentRound = 2;
           updated.currentNode = 'R2_START';
           updated.visitedNodes = [...updated.visitedNodes, 'R2_START'];
           updated.round2StartTime = Date.now();
        }
      }
      setTimeout(() => socket.emit('syncTeam', updated), 0);
      return { ...prev, [currentTeamName]: updated };
    });
  }, [currentTeamName]);

  const eliminateTeam = useCallback((teamName: string) => {
    socket.emit('eliminateTeam', teamName);
  }, []);

  const submitAnswer = useCallback((answer: string) => {
    if (!currentTeamName || !teams[currentTeamName]) {
      return { correct: false, nextNode: '', message: 'No team logged in' };
    }
    const team = teams[currentTeamName];
    const node = getDynamicNode(team.currentNode, team.questionOrder);
    if (!node) return { correct: false, nextNode: '', message: 'Invalid node' };

    if (node.type === 'cutscene' && answer.trim() === 'CUTSCENE_SKIP') {
      let nextNode = node.nextOnCorrect;
      setTeams(prev => {
        const updated = { ...prev[currentTeamName] };
        updated.currentNode = nextNode;
        updated.visitedNodes = [...updated.visitedNodes, nextNode];
        return { ...prev, [currentTeamName]: updated };
      });
      return { correct: true, nextNode, message: 'Story continues...' };
    }

    if (node.type === 'start' && answer.trim() === 'START_QUEST') {
      let nextNode = node.nextOnCorrect;
      setTeams(prev => {
        const updated = { ...prev[currentTeamName] };
        updated.currentNode = nextNode;
        updated.visitedNodes = [...updated.visitedNodes, nextNode];
        return { ...prev, [currentTeamName]: updated };
      });
      return { correct: true, nextNode, message: 'The Sorting Hat has spoken!' };
    }

    const isCorrect = checkFuzzyAnswer(answer, node.correctAnswer);
    let nextNode: string;
    let message: string;

    if (isCorrect) {
      nextNode = node.nextOnCorrect;
      if (nextNode === 'R2_FINAL') message = '🏆 VOLDEMORT DEFEATED! You saved Hogwarts!';
      else if (nextNode === 'R1_FINAL') message = '🎉 Round 1 Complete! Waiting for Round 2...';
      else message = '✅ Correct! The spell worked! Proceeding...';
    } else if (node.nextOnWrong) {
      nextNode = (node.nextOnWrong2 && Math.random() > 0.5) ? node.nextOnWrong2 : node.nextOnWrong;
      message = '❌ Wrong spell! You\'ve been sent to a trap room!';
    } else {
      return { correct: false, nextNode: team.currentNode, message: '❌ Wrong answer! Try again, wizard!' };
    }

    const roundKey = team.currentRound === 1 ? 'round1Stats' : 'round2Stats';

    setTeams(prev => {
      const updated = { ...prev[currentTeamName] };
      updated.currentNode = nextNode;
      updated.visitedNodes = [...updated.visitedNodes, nextNode];
      const stats = { ...updated[roundKey] };
      if (isCorrect) {
        updated.correctAnswers += 1;
        stats.correct += 1;
      } else {
        updated.wrongAnswers += 1;
        updated.trapHits += 1;
        stats.wrong += 1;
        stats.traps += 1;
      }
      updated[roundKey] = stats;
      if (nextNode === 'R1_FINAL') {
        updated.round1Complete = true;
        updated.round1EndTime = Date.now();
      }
      if (nextNode === 'R2_FINAL') {
        updated.isFinished = true;
        updated.endTime = Date.now();
        updated.round2EndTime = Date.now();
      }
      setTimeout(() => socket.emit('syncTeam', updated), 0);
      return { ...prev, [currentTeamName]: updated };
    });

    return { correct: isCorrect, nextNode, message };
  }, [currentTeamName, teams]);

  const submitSecretCode = useCallback((code: string) => {
    if (!currentTeamName || !teams[currentTeamName]) {
      return { found: false, message: 'No team logged in' };
    }
    const team = teams[currentTeamName];
    const node = GAME_NODES[team.currentNode];
    if (!node || !node.secretCode) return { found: false, message: 'No secret available here.' };

    if (code.trim().toUpperCase() === node.secretCode.toUpperCase()) {
      const target = node.secretTarget!;
      const roundKey = team.currentRound === 1 ? 'round1Stats' : 'round2Stats';
      setTeams(prev => {
        const updated = { ...prev[currentTeamName] };
        updated.currentNode = target;
        updated.visitedNodes = [...updated.visitedNodes, target];
        updated.shortcutsFound += 1;
        const stats = { ...updated[roundKey] };
        stats.shortcuts += 1;
        updated[roundKey] = stats;
        setTimeout(() => socket.emit('syncTeam', updated), 0);
        return { ...prev, [currentTeamName]: updated };
      });
      return { found: true, nextNode: target, message: '🌟 SECRET SPELL ACCEPTED! Portkey activated!' };
    }
    return { found: false, message: '❌ Invalid spell. The magic doesn\'t work.' };
  }, [currentTeamName, teams]);

  const skipNode = useCallback(() => {
    if (!currentTeamName || !teams[currentTeamName]) {
      return { nextNode: '', message: 'No team logged in', skipsUsed: 0 };
    }
    const team = teams[currentTeamName];
    const node = GAME_NODES[team.currentNode];
    if (!node || node.type === 'waiting' || node.type === 'final') {
      return { nextNode: '', message: 'Cannot skip this node.', skipsUsed: team.skipsUsed || 0 };
    }

    const nextNode = node.nextOnCorrect || team.currentNode;
    let newSkipsUsed = (team.skipsUsed || 0) + 1;

    setTeams(prev => {
      const updated = { ...prev[currentTeamName] };
      updated.currentNode = nextNode;
      updated.visitedNodes = [...updated.visitedNodes, nextNode];
      updated.skipsUsed = newSkipsUsed;
      
      if (nextNode === 'R1_FINAL') {
        updated.round1Complete = true;
        updated.round1EndTime = Date.now();
      }
      if (nextNode === 'R2_FINAL') {
        updated.isFinished = true;
        updated.endTime = Date.now();
        updated.round2EndTime = Date.now();
      }
      setTimeout(() => socket.emit('syncTeam', updated), 0);
      return { ...prev, [currentTeamName]: updated };
    });

    const msg = newSkipsUsed <= 2 
      ? `⏭️ Skipped cleanly! (${2 - newSkipsUsed} free skips left)` 
      : `⏭️ Skipped! You lost 1.5 points (Total penalty: -${(newSkipsUsed - 2) * 1.5} pts).`;

    return { nextNode, message: msg, skipsUsed: newSkipsUsed };
  }, [currentTeamName, teams]);

  const useHint = useCallback(() => {
    if (!currentTeamName || !teams[currentTeamName]) return { success: false, message: 'No team logged in', hintsUsed: 0 };
    const team = teams[currentTeamName];
    const isR1 = team.currentRound === 1;
    const currentHints = isR1 ? (team.r1HintsUsed || 0) : (team.r2HintsUsed || 0);

    if (currentHints >= 3) {
      return { success: false, message: 'You have used all 3 hints for this round!', hintsUsed: currentHints };
    }

    const newHints = currentHints + 1;
    setTeams(prev => {
      const updated = { ...prev[currentTeamName] };
      if (isR1) updated.r1HintsUsed = newHints;
      else updated.r2HintsUsed = newHints;
      setTimeout(() => socket.emit('syncTeam', updated), 0);
      return { ...prev, [currentTeamName]: updated };
    });
    return { success: true, message: `Hint used! (${3 - newHints} left this round)`, hintsUsed: newHints };
  }, [currentTeamName, teams]);

  return (
    <GameContext.Provider value={{
      teams, currentTeam, currentTeamName, isInitialized,
      registerTeam, loginTeam, submitAnswer, submitSecretCode, skipNode, useHint, logoutTeam,
      isAdmin, setIsAdmin, round2Unlocked, unlockRound2, startRound2ForTeam, eliminateTeam, advanceVideoQueue, clearGameData
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
