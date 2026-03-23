import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StoryCutscene as CutsceneData } from '@/data/gameMap';

interface Props {
  cutscene: CutsceneData;
  onComplete: () => void;
}

export default function StoryCutscene({ cutscene, onComplete }: Props) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    setTextVisible(false);
    const showText = setTimeout(() => setTextVisible(true), 300);
    return () => clearTimeout(showText);
  }, [frameIndex]);

  const frame = cutscene.frames[frameIndex];
  const isLast = frameIndex >= cutscene.frames.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setFrameIndex(prev => prev + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,20,0.95) 0%, rgba(0,0,0,0.98) 100%)' }}
    >
      {/* Cinematic bars */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-black z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black z-10" />

      {/* Scanline effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      <div className="max-w-2xl mx-auto px-8 text-center relative z-20">
        {/* Title */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xs tracking-[0.3em] text-yellow-400/70 font-bold mb-8 uppercase"
        >
          {cutscene.title}
        </motion.h2>

        {/* Frame content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={frameIndex}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Big emoji */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              {frame.emoji}
            </motion.div>

            {/* Story text */}
            {textVisible && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-lg text-white/90 leading-relaxed font-medium"
                style={{ textShadow: '0 0 20px rgba(255,255,255,0.1)' }}
              >
                {frame.text}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {cutscene.frames.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === frameIndex ? 24 : 8,
                height: 8,
                background: i === frameIndex ? '#facc15' : i < frameIndex ? 'rgba(250,204,21,0.4)' : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>

        {/* Continue button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="mt-8 px-8 py-3 rounded-xl text-sm font-bold tracking-wider transition-all"
          style={{
            background: isLast ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(255,255,255,0.1)',
            color: isLast ? 'white' : 'rgba(255,255,255,0.7)',
            border: isLast ? '2px solid #22c55e' : '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {isLast ? '▶ CONTINUE MISSION' : 'NEXT ▸'}
        </motion.button>

        {/* Frame counter */}
        <p className="text-[10px] text-white/20 mt-4 tracking-widest">
          {frameIndex + 1} / {cutscene.frames.length}
        </p>
      </div>
    </motion.div>
  );
}
