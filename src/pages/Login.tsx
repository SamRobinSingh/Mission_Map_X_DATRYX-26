import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import TerminalText from '@/components/TerminalText';

export default function Login() {
  const [teamName, setTeamName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [mode, setMode] = useState<'choose' | 'register' | 'login' | 'admin'>('choose');
  const [error, setError] = useState('');
  const [briefingDone, setBriefingDone] = useState(false);
  const { registerTeam, loginTeam, setIsAdmin } = useGame();
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!teamName.trim()) { setError('Enter your house name, wizard.'); return; }
    if (passcode !== '260326') { setError('Invalid House Registration Password!'); return; }
    if (registerTeam(teamName, passcode)) navigate('/game');
    else setError('That house name is taken.');
  };

  const handleLogin = () => {
    if (!teamName.trim() || !passcode.trim()) { setError('Enter your house name and passcode.'); return; }
    if (loginTeam(teamName, passcode)) navigate('/game');
    else setError('House not found or incorrect passcode.');
  };

  const handleAdmin = () => { setMode('admin'); setError(''); };

  const handleAdminSubmit = () => {
    if (adminEmail === 'ss8764628@gmail.com' && adminPassword === '8264678') {
      setIsAdmin(true);
      navigate('/admin');
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0515 70%)' }}>
      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div key={i} className="absolute rounded-full bg-white"
            style={{ width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="w-full max-w-lg relative z-20">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
            className="text-6xl mb-4">⚡</motion.div>
          <motion.h1 className="text-4xl md:text-5xl font-display font-black tracking-widest mb-3"
            style={{ color: '#fbbf24', textShadow: '0 0 20px rgba(255,215,0,0.4), 0 0 40px rgba(255,215,0,0.2)' }}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}>
            HOGWARTS QUEST
          </motion.h1>
          <motion.p className="text-sm tracking-[0.3em] uppercase text-purple-300/70"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            The Wizarding Challenge
          </motion.p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: 'rgba(30,15,50,0.8)', border: '1px solid rgba(255,215,0,0.15)', backdropFilter: 'blur(20px)',
            boxShadow: '0 0 30px rgba(124,58,237,0.1), inset 0 0 30px rgba(124,58,237,0.05)' }}>
          {/* Header bar */}
          <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,215,0,0.1)' }}>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-amber-300/40">hogwarts_sorting_hat_v9.75</span>
          </div>

          {mode === 'choose' && !briefingDone && (
            <div className="space-y-4">
              <TerminalText
                text="🧙 Welcome to Hogwarts School of Witchcraft and Wizardry! You have been selected for a magical quest. Dark forces have scattered artifacts across the castle. Your mission: solve riddles, overcome traps, and recover the Deathly Hallows before Voldemort does!"
                speed={20}
                onComplete={() => setBriefingDone(true)}
              />
            </div>
          )}

          {mode === 'choose' && briefingDone && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <p className="text-xs text-amber-300/50 mb-4">SELECT YOUR PATH:</p>
              <button onClick={() => setMode('register')}
                className="w-full text-left px-4 py-3 rounded-xl transition-all text-sm"
                style={{ border: '1px solid rgba(255,215,0,0.2)', background: 'rgba(255,215,0,0.05)', color: '#fbbf24' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(255,215,0,0.1)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(255,215,0,0.05)'; }}>
                <span className="text-amber-400">⚡</span> NEW HOUSE REGISTRATION
              </button>
              <button onClick={() => setMode('login')}
                className="w-full text-left px-4 py-3 rounded-xl transition-all text-sm"
                style={{ border: '1px solid rgba(124,58,237,0.2)', background: 'rgba(124,58,237,0.05)', color: '#c4b5fd' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(124,58,237,0.1)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(124,58,237,0.05)'; }}>
                <span className="text-purple-400">🔮</span> REJOIN EXISTING HOUSE
              </button>
              <button onClick={handleAdmin}
                className="w-full text-left px-4 py-3 rounded-xl transition-all text-sm"
                style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}>
                <span>🏰</span> HEADMASTER'S OFFICE (Admin)
              </button>
            </motion.div>
          )}

          {(mode === 'register' || mode === 'login') && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <button onClick={() => { setMode('choose'); setError(''); }}
                className="text-xs text-amber-300/50 hover:text-amber-300 transition-colors">
                {'<'} BACK
              </button>
              <p className="text-xs text-amber-300/50">
                {mode === 'register' ? 'ENTER YOUR HOUSE NAME:' : 'ENTER HOUSE NAME TO REJOIN:'}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ border: '1px solid rgba(255,215,0,0.2)', background: 'rgba(255,215,0,0.05)' }}>
                  <span className="text-amber-400 text-sm">⚡</span>
                  <input value={teamName}
                    onChange={e => { setTeamName(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && document.getElementById('passcodeInput')?.focus()}
                    placeholder="HOUSE_NAME"
                    className="bg-transparent border-none outline-none text-amber-200 text-sm w-full placeholder:text-amber-300/20 font-mono"
                    autoFocus maxLength={30}
                  />
                </div>
                <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ border: '1px solid rgba(255,215,0,0.2)', background: 'rgba(255,215,0,0.05)' }}>
                  <span className="text-amber-400 text-sm">🔑</span>
                  <input value={passcode} id="passcodeInput" type="password"
                    onChange={e => { setPasscode(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && (mode === 'register' ? handleRegister() : handleLogin())}
                    placeholder="PASSCODE"
                    className="bg-transparent border-none outline-none text-amber-200 text-sm w-full placeholder:text-amber-300/20 font-mono"
                    maxLength={30}
                  />
                </div>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button onClick={mode === 'register' ? handleRegister : handleLogin}
                className="w-full py-2.5 rounded-xl text-sm font-bold tracking-wider transition-all"
                style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))',
                  border: '1px solid rgba(255,215,0,0.3)', color: '#fbbf24' }}>
                {mode === 'register' ? '[ ⚡ REGISTER & BEGIN ]' : '[ 🔮 REJOIN QUEST ]'}
              </button>
            </motion.div>
          )}

          {mode === 'admin' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <button onClick={() => { setMode('choose'); setError(''); setAdminEmail(''); setAdminPassword(''); }}
                className="text-xs text-amber-300/50 hover:text-amber-300 transition-colors">
                {'<'} BACK
              </button>
              <p className="text-xs text-amber-300/50">HEADMASTER LOGIN</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-white/40 text-sm">✉️</span>
                  <input value={adminEmail}
                    onChange={e => { setAdminEmail(e.target.value); setError(''); }}
                    placeholder="Admin Email"
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/20 font-mono"
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}>
                  <span className="text-white/40 text-sm">🔑</span>
                  <input value={adminPassword}
                    type="password"
                    onChange={e => { setAdminPassword(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleAdminSubmit()}
                    placeholder="Password"
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-white/20 font-mono"
                  />
                </div>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button onClick={handleAdminSubmit}
                className="w-full py-2.5 rounded-xl text-sm font-bold tracking-wider transition-all"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                  border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>
                [ 🏰 ENTER OFFICE ]
              </button>
            </motion.div>
          )}
        </div>

        <p className="text-center text-[10px] text-amber-300/20 mt-4 tracking-wider">
          MAGICAL SECURE CONNECTION • 30 HOUSES MAX • ⚡
        </p>
      </motion.div>
    </div>
  );
}
