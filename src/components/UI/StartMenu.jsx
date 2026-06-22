import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Gamepad2, BookOpen, Lightbulb, ArrowLeft, Joystick, BatteryCharging, Users, Clock, Sparkles, MessageSquare, PhoneOff, MessageCircle, Settings, Volume2, VolumeX, RotateCcw, UserCircle2 } from 'lucide-react';
import { useGameState } from '../../hooks/useGameState';
import { requestFullscreen } from '../../utils/fullscreen';

export default function StartMenu() {
  const { gameStatus, startGame, isMuted, toggleMute, resetProgress, playerName, updatePlayerName } = useGameState();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [instructionTab, setInstructionTab] = useState('rules'); // 'rules' or 'cheatsheet'
  const [tempName, setTempName] = useState(playerName);

  useEffect(() => {
    setTempName(playerName);
  }, [playerName]);

  if (gameStatus !== 'menu') return null;

  const handleStartGame = () => {
    requestFullscreen();
    startGame();
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-linear-to-br from-[#ffe4e6] via-[#ffd3b6] to-[#dbeafe] select-none pointer-events-auto z-50 p-4">
      {/* Dynamic Aura Background */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-300/20 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <AnimatePresence mode="wait">
        {showSettings ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-sm sm:max-w-md bg-white border-4 border-slate-800 p-6 sm:p-8 rounded-3xl shadow-[6px_6px_0px_rgba(30,41,59,1)] flex flex-col h-sm:p-4 h-sm:rounded-3xl h-sm:w-[95%] h-sm:max-h-[92vh] h-xs:p-3"
          >
            <div className="text-center mb-6 shrink-0 h-sm:mb-3">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1 h-sm:text-[1.25rem] h-xs:text-[1rem]">
                <Settings className="inline w-6 h-6 mr-2" /> Settings
              </h2>
            </div>

            <div className="flex flex-col gap-5 flex-1 overflow-y-auto mb-6 px-1 h-sm:gap-3 h-sm:mb-3 scrollbar-thin">
              
              {/* Change Name */}
              <div className="bg-sky-50 border-2 border-slate-200 p-4 rounded-2xl flex flex-col gap-2 h-sm:p-3">
                <label className="font-extrabold text-slate-700 text-sm flex items-center gap-2"><UserCircle2 className="w-4 h-4"/> Player Name</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="flex-1 bg-white border-2 border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-700 focus:outline-none focus:border-sky-500 transition-colors h-sm:py-1 h-sm:text-sm"
                    placeholder="Enter name..."
                  />
                  <button 
                    onClick={() => updatePlayerName(tempName || 'Player')}
                    className="bg-sky-500 hover:bg-sky-600 text-white border-2 border-slate-800 font-bold px-4 rounded-xl shadow-[2px_2px_0px_rgba(30,41,59,1)] active:translate-y-0.5 active:shadow-none transition-all h-sm:px-3 h-sm:text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Music Toggle */}
              <div className="bg-purple-50 border-2 border-slate-200 p-4 rounded-2xl flex items-center justify-between h-sm:p-3">
                <span className="font-extrabold text-slate-700 text-sm flex items-center gap-2">
                  {isMuted ? <VolumeX className="w-4 h-4"/> : <Volume2 className="w-4 h-4"/>} 
                  Background Music
                </span>
                <button
                  onClick={toggleMute}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full border-2 border-slate-800 transition-colors focus:outline-none ${!isMuted ? 'bg-emerald-400' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white border-2 border-slate-800 transition-transform ${!isMuted ? 'translate-x-5' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Reset Game */}
              <div className="bg-rose-50 border-2 border-slate-200 p-4 rounded-2xl flex flex-col gap-2 h-sm:p-3">
                <span className="font-extrabold text-slate-700 text-sm flex items-center gap-2"><RotateCcw className="w-4 h-4 text-rose-500"/> Danger Zone</span>
                <p className="text-xs font-medium text-slate-500">Wipe all saved progress, including unlocked levels and completed onboarding.</p>
                <button
                  onClick={() => {
                    resetProgress();
                    setShowSettings(false);
                  }}
                  className="mt-2 py-2 bg-rose-500 hover:bg-rose-600 text-white border-2 border-slate-800 font-extrabold uppercase tracking-wider rounded-xl shadow-[2px_2px_0px_rgba(30,41,59,1)] active:translate-y-0.5 active:shadow-none transition-all h-sm:py-1.5 h-sm:text-xs text-sm"
                >
                  Reset All Progress
                </button>
              </div>

            </div>

            <button
              onClick={() => {
                updatePlayerName(tempName || 'Player');
                setShowSettings(false);
              }}
              className="w-full shrink-0 py-3 h-sm:py-2 h-sm:text-[0.75rem] h-sm:rounded-[0.85rem] h-sm:border-[2.5px] bg-slate-200 hover:bg-slate-300 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer text-center"
            >
              <ArrowLeft className="inline w-5 h-5 mr-2" /> Back to Menu
            </button>
          </motion.div>
        ) : showInstructions ? (
          <motion.div
            key="instructions"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-4xl bg-white border-4 border-slate-800 p-5 sm:p-7 rounded-3xl shadow-[6px_6px_0px_rgba(30,41,59,1)] flex flex-col h-sm:p-3 h-sm:rounded-3xl h-sm:w-[95%] h-sm:max-w-136 h-sm:h-[92vh] h-xs:p-2 h-xs:rounded-[1.25rem]"
          >
            {/* Header */}
            <div className="text-center mb-4 shrink-0 h-sm:mb-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1 h-sm:text-[1.25rem] h-xs:text-[1rem]">
                <BookOpen className="inline w-6 h-6 mr-2" /> How to Play
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider h-sm:text-[0.55rem]">
                Resilience Guide & Controls
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 justify-center shrink-0">
              <button 
                onClick={() => setInstructionTab('rules')} 
                className={`flex-1 py-2 px-4 rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all border-2 ${instructionTab === 'rules' ? 'bg-indigo-100 border-indigo-500 text-indigo-900 shadow-[2px_2px_0px_rgba(99,102,241,1)]' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              >
                🎮 Rules & Controls
              </button>
              <button 
                onClick={() => setInstructionTab('cheatsheet')} 
                className={`flex-1 py-2 px-4 rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all border-2 ${instructionTab === 'cheatsheet' ? 'bg-purple-100 border-purple-500 text-purple-900 shadow-[2px_2px_0px_rgba(168,85,247,1)]' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}
              >
                💡 Cheat Sheet
              </button>
            </div>

            {/* Content Body - Scrollable */}
            <div className="overflow-y-auto pr-1.5 flex-1 min-h-0 flex flex-col gap-4 text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 scrollbar-thin h-sm:gap-2.5 h-sm:mb-1.5 h-xs:gap-2">
              {/* Rules description */}
              {instructionTab === 'rules' && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
                  className="bg-sky-50 border-2 border-slate-800 p-4 sm:p-5 rounded-2xl shadow-[2.5px_2.5px_0px_rgba(30,41,59,1)] flex-1 h-sm:p-2.5"
                >
                  <p className="font-extrabold text-sky-950 text-base sm:text-lg mb-2 h-sm:text-sm h-sm:mb-1"><Gamepad2 className="inline w-5 h-5 mr-2" /> Core Objective</p>
                  <p className="font-medium text-slate-600 mb-4 h-sm:text-[0.7rem] h-sm:mb-2 h-sm:leading-tight">
                    Emotional threats (Burnout, Loneliness, Anxiety, etc.) will float in from the surrounding fog. If they reach your character in the center, your Connection decreases and you lose a life.
                  </p>
                  
                  <div className="h-px bg-sky-200 my-4" />

                  <p className="font-extrabold text-sky-950 text-base sm:text-lg mb-2 h-sm:text-sm h-sm:mb-1"><Joystick className="inline w-5 h-5 mr-2" /> Controls</p>
                  <ul className="font-medium text-slate-600 space-y-2 h-sm:text-[0.7rem] h-sm:leading-tight">
                    <li className="flex gap-2">
                      <span className="font-black text-sky-800">1.</span> 
                      <span><strong>Target</strong>: The closest threat is automatically targeted! (Or click/tap any threat or its label bubble to target it manually).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-black text-sky-800">2.</span> 
                      <span><strong>Cope</strong>: Click the matching coping button on the bottom dock (or press its corresponding key: <strong>1, 2, 3, 4, 5, 6, 7</strong>).</span>
                    </li>
                  </ul>
                </motion.div>
              )}

              {/* Cheat Sheet Table */}
              {instructionTab === 'cheatsheet' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="border-2 border-slate-800 rounded-2xl overflow-hidden shadow-[2.5px_2.5px_0px_rgba(30,41,59,1)] bg-white flex-1 flex flex-col"
                >
                  <div className="bg-purple-100 border-b-2 border-slate-800 p-3 sm:p-4 text-center text-slate-800 font-black uppercase text-xs sm:text-sm tracking-wider h-sm:p-2">
                    <Lightbulb className="inline w-5 h-5 mr-2" /> Resilience Cheat Sheet
                  </div>
                  <div className="overflow-x-auto flex-1 p-2">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-300 font-extrabold text-slate-600">
                          <th className="p-2 sm:p-3 w-12 text-center h-sm:p-1 h-sm:px-2 h-sm:text-xs">Key</th>
                          <th className="p-2 sm:p-3 h-sm:p-1 h-sm:px-2 h-sm:text-xs">Coping Strategy</th>
                          <th className="p-2 sm:p-3 h-sm:p-1 h-sm:px-2 h-sm:text-xs">Threats Counteracted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-bold">
                        <tr className="border-b border-indigo-200/50 last:border-0 hover:bg-indigo-50/50 transition-colors">
                          <td className="p-2 sm:p-3 text-center h-sm:p-1 h-sm:px-2 h-sm:text-xs"><kbd className="bg-amber-100 border border-slate-400 px-1.5 py-0.5 rounded font-mono shadow-[1px_1px_0px_rgba(30,41,59,1)] h-sm:text-[0.65rem] h-sm:px-1 h-sm:py-0">1</kbd></td>
                          <td className="p-2 sm:p-3 text-amber-900 h-sm:p-1 h-sm:px-2 h-sm:text-xs"><BatteryCharging className="inline w-4 h-4 mr-1"/> Rest & Recharge</td>
                          <td className="p-2 sm:p-3 text-amber-800 text-sm h-sm:p-1 h-sm:px-2 h-sm:text-xs leading-tight">Burnout, Exhaustion</td>
                        </tr>
                        <tr className="border-b border-indigo-200/50 last:border-0 hover:bg-indigo-50/50 transition-colors">
                          <td className="p-2 sm:p-3 text-center h-sm:p-1 h-sm:px-2 h-sm:text-xs"><kbd className="bg-purple-100 border border-slate-400 px-1.5 py-0.5 rounded font-mono shadow-[1px_1px_0px_rgba(30,41,59,1)] h-sm:text-[0.65rem] h-sm:px-1 h-sm:py-0">2</kbd></td>
                          <td className="p-2 sm:p-3 text-purple-900 h-sm:p-1 h-sm:px-2 h-sm:text-xs"><Users className="inline w-4 h-4 mr-1"/> Seek Support</td>
                          <td className="p-2 sm:p-3 text-purple-800 text-sm h-sm:p-1 h-sm:px-2 h-sm:text-xs leading-tight">Loneliness, Imposter Syndrome</td>
                        </tr>
                        <tr className="border-b border-indigo-200/50 last:border-0 hover:bg-indigo-50/50 transition-colors">
                          <td className="p-2 sm:p-3 text-center h-sm:p-1 h-sm:px-2 h-sm:text-xs"><kbd className="bg-sky-100 border border-slate-400 px-1.5 py-0.5 rounded font-mono shadow-[1px_1px_0px_rgba(30,41,59,1)] h-sm:text-[0.65rem] h-sm:px-1 h-sm:py-0">3</kbd></td>
                          <td className="p-2 sm:p-3 text-sky-900 h-sm:p-1 h-sm:px-2 h-sm:text-xs"><Clock className="inline w-4 h-4 mr-1"/> Time Management</td>
                          <td className="p-2 sm:p-3 text-sky-800 text-sm h-sm:p-1 h-sm:px-2 h-sm:text-xs leading-tight">Academic Pressure, Overwhelm</td>
                        </tr>
                        <tr className="border-b border-indigo-200/50 last:border-0 hover:bg-indigo-50/50 transition-colors">
                          <td className="p-2 sm:p-3 text-center h-sm:p-1 h-sm:px-2 h-sm:text-xs"><kbd className="bg-emerald-100 border border-slate-400 px-1.5 py-0.5 rounded font-mono shadow-[1px_1px_0px_rgba(30,41,59,1)] h-sm:text-[0.65rem] h-sm:px-1 h-sm:py-0">4</kbd></td>
                          <td className="p-2 sm:p-3 text-emerald-900 h-sm:p-1 h-sm:px-2 h-sm:text-xs"><Sparkles className="inline w-4 h-4 mr-1"/> Reflection</td>
                          <td className="p-2 sm:p-3 text-emerald-800 text-sm h-sm:p-1 h-sm:px-2 h-sm:text-xs leading-tight">Negative Thoughts, Anxiety</td>
                        </tr>
                        <tr className="border-b border-indigo-200/50 last:border-0 hover:bg-indigo-50/50 transition-colors">
                          <td className="p-2 sm:p-3 text-center h-sm:p-1 h-sm:px-2 h-sm:text-xs"><kbd className="bg-indigo-100 border border-slate-400 px-1.5 py-0.5 rounded font-mono shadow-[1px_1px_0px_rgba(30,41,59,1)] h-sm:text-[0.65rem] h-sm:px-1 h-sm:py-0">5</kbd></td>
                          <td className="p-2 sm:p-3 text-indigo-900 h-sm:p-1 h-sm:px-2 h-sm:text-xs"><MessageSquare className="inline w-4 h-4 mr-1"/> Reach Out</td>
                          <td className="p-2 sm:p-3 text-indigo-800 text-sm h-sm:p-1 h-sm:px-2 h-sm:text-xs leading-tight">Isolation, Ghosting</td>
                        </tr>
                        <tr className="border-b border-indigo-200/50 last:border-0 hover:bg-indigo-50/50 transition-colors">
                          <td className="p-2 sm:p-3 text-center h-sm:p-1 h-sm:px-2 h-sm:text-xs"><kbd className="bg-teal-100 border border-slate-400 px-1.5 py-0.5 rounded font-mono shadow-[1px_1px_0px_rgba(30,41,59,1)] h-sm:text-[0.65rem] h-sm:px-1 h-sm:py-0">6</kbd></td>
                          <td className="p-2 sm:p-3 text-teal-900 h-sm:p-1 h-sm:px-2 h-sm:text-xs"><PhoneOff className="inline w-4 h-4 mr-1"/> Digital Detox</td>
                          <td className="p-2 sm:p-3 text-teal-800 text-sm h-sm:p-1 h-sm:px-2 h-sm:text-xs leading-tight">Social Comparison, FOMO</td>
                        </tr>
                        <tr className="border-b border-indigo-200/50 last:border-0 hover:bg-indigo-50/50 transition-colors">
                          <td className="p-2 sm:p-3 text-center h-sm:p-1 h-sm:px-2 h-sm:text-xs"><kbd className="bg-pink-100 border border-slate-400 px-1.5 py-0.5 rounded font-mono shadow-[1px_1px_0px_rgba(30,41,59,1)] h-sm:text-[0.65rem] h-sm:px-1 h-sm:py-0">7</kbd></td>
                          <td className="p-2 sm:p-3 text-pink-900 h-sm:p-1 h-sm:px-2 h-sm:text-xs"><MessageCircle className="inline w-4 h-4 mr-1"/> Communication</td>
                          <td className="p-2 sm:p-3 text-pink-800 text-sm h-sm:p-1 h-sm:px-2 h-sm:text-xs leading-tight">Family Conflict, Peer Pressure</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Back Button */}
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full shrink-0 py-3 h-sm:py-2 h-sm:text-[0.75rem] h-sm:rounded-[0.85rem] h-sm:border-[2.5px] bg-pink-200 hover:bg-pink-300 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer text-center"
            >
              <ArrowLeft className="inline w-5 h-5 mr-2" /> Back to Menu
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-sm sm:max-w-md w-full bg-white border-4 border-slate-800 p-6 sm:p-8 rounded-3xl text-center shadow-[6px_6px_0px_rgba(30,41,59,1)] flex flex-col items-center animate-cloud-bob h-sm:p-4 h-sm:rounded-3xl h-sm:max-h-[92vh] h-sm:w-[95%] h-sm:max-w-84 h-xs:p-3 h-xs:max-w-76"
          >
            {/* Cute Mascot cloud illustration */}
            <div className="relative mb-6 h-sm:mb-4 flex items-center justify-center">
              <svg viewBox="0 0 120 80" className="w-32 h-24 h-sm:w-18 h-sm:h-14 h-sm:mb-1 h-xs:w-15 h-xs:h-11 relative">
                {/* Shield shadow */}
                <ellipse cx="60" cy="72" rx="30" ry="6" fill="#cbd5e1" opacity="0.6" />
                
                {/* Outer Shield Border */}
                <path d="M 60 10 L 95 20 C 95 45 80 65 60 75 C 40 65 25 45 25 20 Z" fill="#e0e7ff" stroke="#818cf8" strokeWidth="4" strokeLinejoin="round" />
                
                {/* Inner Shield Body */}
                <path d="M 60 18 L 85 26 C 85 43 75 57 60 65 C 45 57 35 43 35 26 Z" fill="#8b5cf6" />
                
                {/* Mind Core / Star */}
                <path d="M 60 25 L 63 35 L 73 38 L 63 41 L 60 51 L 57 41 L 47 38 L 57 35 Z" fill="#fde047" className="animate-pulse" />
                
                {/* Floating Sparks */}
                <path d="M 45 25 L 47 30 L 52 32 L 47 34 L 45 39 L 43 34 L 38 32 L 43 30 Z" fill="#fde047" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <path d="M 75 45 L 76.5 49 L 81 50.5 L 76.5 52 L 75 56 L 73.5 52 L 69 50.5 L 73.5 49 Z" fill="#fde047" opacity="0.8" className="animate-pulse" style={{ animationDelay: '1s' }} />
              </svg>
              
              <motion.div 
                className="absolute -right-2 bottom-1 text-3xl h-sm:text-2xl h-xs:text-xl"
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.15, 1],
                  rotate: [0, 8, -8, 0]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="inline w-5 h-5 mx-2 text-indigo-400" />
              </motion.div>
            </div>

            {/* Settings Button - Top Right of Card */}
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-slate-100 hover:bg-slate-200 border-2 sm:border-[3px] border-slate-800 p-2 sm:p-2.5 rounded-xl text-slate-700 hover:text-slate-900 transition-all shadow-[2px_2px_0px_rgba(30,41,59,1)] active:translate-y-0.5 active:shadow-none z-20 cursor-pointer h-sm:p-1.5 h-sm:top-3 h-sm:right-3"
              title="Settings"
            >
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" />
            </button>

            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 mt-4">
              Mind Empowered presents
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-2 tracking-wide h-sm:text-[1.35rem] h-sm:mb-0.5 h-xs:text-[1.15rem]">
              Mindscape Defense
            </h1>
            <p className="text-xs sm:text-sm font-extrabold text-indigo-500 uppercase tracking-widest mb-4 leading-relaxed h-sm:text-[0.55rem] h-sm:mb-2.5 h-xs:mb-1.5">
              <Shield className="inline w-4 h-4 mr-2" /> Shield Your Focus <Shield className="inline w-4 h-4 ml-2" />
            </p>
            <p className="text-xs font-bold text-slate-600 mb-6 bg-slate-100 py-1.5 px-4 rounded-full border-2 border-slate-200">
              Welcome back, <span className="text-indigo-600 font-black">{playerName}</span>!
            </p>

            <div className="flex flex-col gap-4 w-full h-sm:gap-2.5 h-xs:gap-2">
              <button
                onClick={handleStartGame}
                className="w-full py-3 sm:py-4 h-sm:py-2 h-sm:rounded-[0.85rem] h-sm:text-[0.75rem] h-sm:border-[2.5px] h-xs:py-1.5 bg-violet-300 hover:bg-violet-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Gamepad2 className="inline w-5 h-5 mr-2" /> Start Game
              </button>

              <button
                type="button"
                onClick={() => setShowInstructions(true)}
                className="w-full py-3 sm:py-4 h-sm:py-2 h-sm:rounded-[0.85rem] h-sm:text-[0.75rem] h-sm:border-[2.5px] h-xs:py-1.5 bg-amber-300 hover:bg-amber-400 border-[3px] border-slate-800 text-slate-800 font-extrabold uppercase tracking-wider rounded-2xl shadow-[3px_3px_0px_rgba(30,41,59,1)] hover:scale-102 active:scale-98 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(30,41,59,1)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <BookOpen className="inline w-5 h-5 mr-2" /> How to Play
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
