import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { GAME_NODES } from '@/data/gameMap';
import MapVisualization from '@/components/MapVisualization';
import { LogOut, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playCorrectSound, playWrongSound, playTrapSound, playSecretSound, playNodeEnterSound } from '@/lib/sounds';

export default function GamePage() {
  const { currentTeam, isInitialized, submitAnswer, submitSecretCode, skipNode, useHint, logoutTeam, currentTeamName, advanceVideoQueue } = useGame();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' | 'secret' } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerWarning, setTimerWarning] = useState<'none' | 'five' | 'one' | 'expired'>('none');
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  useEffect(() => {
    if (isInitialized && !currentTeam) navigate('/');
  }, [currentTeam, isInitialized, navigate]);

  // Auto-play videos queued by admin fast-forwarding
  useEffect(() => {
    if (!playingVideo && currentTeam?.videoQueue && currentTeam.videoQueue.length > 0) {
      setPlayingVideo(currentTeam.videoQueue[0]);
    }
  }, [currentTeam?.videoQueue, playingVideo]);

  const handleVideoEnded = () => {
    if (currentTeam?.videoQueue && currentTeam.videoQueue.length > 0) {
      advanceVideoQueue();
      setPlayingVideo(null);
    } else {
      setPlayingVideo(null);
    }
  };

  useEffect(() => { setFeedback(null); }, [currentTeam?.currentNode]);
  useEffect(() => { if (currentTeam) playNodeEnterSound(); }, [currentTeam?.currentNode]);

  // Countdown timer
  useEffect(() => {
    if (!currentTeam || currentTeam.isFinished || !isInitialized) return;
    const isRound2 = currentTeam.currentRound === 2;
    const startTime = isRound2 && currentTeam.round2StartTime
      ? currentTeam.round2StartTime
      : currentTeam.startTime;
    const currentTotalTime = isRound2 ? 45 * 60 : 20 * 60;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, currentTotalTime - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setTimerWarning('expired');
        clearInterval(interval);
      } else if (remaining <= 60) {
        setTimerWarning('one');
      } else if (remaining <= 300) {
        setTimerWarning('five');
      } else {
        setTimerWarning('none');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTeam?.startTime, currentTeam?.round2StartTime, currentTeam?.currentRound, currentTeam?.isFinished]);

  if (!currentTeam) return null;
  const node = GAME_NODES[currentTeam.currentNode];
  if (!node) return null;

  const handleSubmitAnswer = (answer: string) => {
    const prevNodeId = currentTeam.currentNode;
    const result = submitAnswer(answer);
    if (result.correct) {
      playCorrectSound();
      if (prevNodeId.startsWith('R1_N')) {
         const qNum = parseInt(prevNodeId.replace('R1_N', ''));
         if (!isNaN(qNum)) setPlayingVideo(qNum);
      }
    } else if (result.nextNode !== currentTeam.currentNode) {
      playTrapSound();
    } else {
      playWrongSound();
    }
    setFeedback({ msg: result.message, type: result.correct ? 'success' : 'error' });
  };

  const handleSubmitSecret = (code: string) => {
    const result = submitSecretCode(code);
    setFeedback({ msg: result.message, type: result.found ? 'secret' : 'error' });
    if (result.found) playSecretSound();
    else playWrongSound();
  };

  const handleSkipNode = () => {
    const prevNodeId = currentTeam.currentNode;
    const result = skipNode();
    setFeedback({ msg: result.message, type: 'secret' });
    playSecretSound(); // Reuse success/secret sound
    if (prevNodeId.startsWith('R1_N')) {
      const qNum = parseInt(prevNodeId.replace('R1_N', ''));
      if (!isNaN(qNum)) setPlayingVideo(qNum);
    }
  };

  const handleUseHint = () => {
    const result = useHint();
    if (result.success) {
      playSecretSound();
      setFeedback({ msg: result.message, type: 'secret' });
      return true;
    } else {
      setFeedback({ msg: result.message, type: 'error' });
      return false;
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#0a0515' }}>
      <div className="z-40 px-4 py-2 flex items-center justify-between flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, rgba(30,15,50,0.95), rgba(20,10,35,0.95))', borderBottom: '1px solid rgba(255,215,0,0.15)' }}>
        <div className="flex items-center gap-3">
          <h2 className="font-display text-xs tracking-widest text-amber-400" style={{ textShadow: '0 0 10px rgba(255,215,0,0.3)' }}>
            ⚡ HOGWARTS QUEST
          </h2>
          <span className="text-[10px] px-2 py-0.5 border border-amber-500/30 rounded-full text-amber-300/70 bg-amber-500/10">
            {currentTeamName}
          </span>
          <span className="text-[10px] px-2 py-0.5 border border-purple-500/30 rounded-full text-purple-300/70 bg-purple-500/10">
            Round {currentTeam.currentRound}
          </span>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => { logoutTeam(); navigate('/'); }}
          className="p-2 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-all text-red-400/60"
          title="Logout">
          <LogOut className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="flex-1 overflow-hidden">
        <MapVisualization
          currentNode={currentTeam.currentNode}
          visitedNodes={currentTeam.visitedNodes}
          onSubmitAnswer={handleSubmitAnswer}
          onSubmitSecret={handleSubmitSecret}
          onSkipNode={handleSkipNode}
          onUseHint={handleUseHint}
          feedback={feedback}
          team={currentTeam}
          timeRemaining={timeRemaining}
          timerWarning={timerWarning}
        />
      </div>

      <AnimatePresence>
        {playingVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="absolute inset-0 z-[500] bg-black flex flex-col items-center justify-center">
             <video 
               src={`/Video/${playingVideo}.MOV`}
               autoPlay
               controls
               onEnded={handleVideoEnded}
               className="w-full h-full object-contain max-h-[90vh]"
             />
             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleVideoEnded} 
               className="absolute top-6 right-6 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-white/20 flex items-center gap-2 backdrop-blur-md">
               <SkipForward className="w-4 h-4" /> SKIP VIDEO
             </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
