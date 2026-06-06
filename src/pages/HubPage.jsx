import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, Coins, Flame, ChevronRight, Play, Lock } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { incrementGamesPlayed } from '../data/store';
import BasketBlitz from '../components/BasketBlitz';
import RewardModal from '../components/RewardModal';

function XPBar({ xp, max }) {
  const pct = Math.min(100, Math.round((xp / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-semibold text-gray-700">{xp.toLocaleString()} XP</span>
        <span className="text-gray-400">{max.toLocaleString()} XP</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gray-900 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function ChallengeRow({ challenge }) {
  const pct = Math.min(100, (challenge.progress / challenge.total) * 100);
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${challenge.done ? 'bg-green-50' : 'bg-gray-50'}`}>
        <Zap size={14} className={challenge.done ? 'text-green-500' : 'text-gray-400'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1.5">
          <span className={`text-sm font-medium ${challenge.done ? 'line-through text-gray-300' : 'text-gray-800'}`}>{challenge.text}</span>
          <span className="text-xs text-gray-400 font-medium">{challenge.progress}/{challenge.total}</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${challenge.done ? 'bg-green-400' : 'bg-gray-900'}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${challenge.done ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
        +{challenge.xpReward} XP
      </span>
    </div>
  );
}

const PREVIEW_GAMES = [
  {
    id: 'shelf', name: 'Shelf Sprint', desc: 'Run through aisles and grab essentials',
    time: '45 sec', locked: false,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=180&fit=crop',
  },
  {
    id: 'stack', name: 'Quick Stack', desc: 'Stack grocery crates for higher combos',
    time: '30 sec', locked: true,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=180&fit=crop',
  },
];

export default function HubPage() {
  const navigate = useNavigate();
  const store = useStore();
  const [timeLeft, setTimeLeft] = useState(9 * 60 + 48);
  const [showGame, setShowGame] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const iv = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const nextRewardXp = store.nextLevelXp - store.xp;

  function handleGameEnd(score, won) {
    incrementGamesPlayed();
    setShowGame(false);
    setLastResult({ score, won });
    setShowReward(true);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Top stats row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Timer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-3xl p-5 text-white relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5"/>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Order Arrives In</p>
            <p className="text-5xl font-black tabular-nums timer-pulse">{mins}:{secs}</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
              <span className="text-gray-400 text-xs">Rider is nearby</span>
            </div>
          </motion.div>

          {/* XP */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-5 border border-gray-100"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400 font-medium">Your Progress</p>
                <p className="font-bold text-gray-900 text-sm">Level {store.level}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Next Reward</p>
                <p className="text-xs font-bold text-[#7c3aed]">{nextRewardXp.toLocaleString()} XP to go</p>
              </div>
            </div>
            <XPBar xp={store.xp} max={store.nextLevelXp} />
          </motion.div>

          {/* Coins + streak */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-5 border border-gray-100"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <div className="grid grid-cols-2 gap-3 h-full">
              <div className="bg-amber-50 rounded-2xl p-3 flex flex-col justify-between">
                <p className="text-xs text-amber-500 font-semibold">Coins</p>
                <motion.p
                  key={store.coins}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-black text-amber-700"
                >
                  {store.coins}
                </motion.p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-3 flex flex-col justify-between">
                <p className="text-xs text-orange-500 font-semibold">Streak</p>
                <p className="text-2xl font-black text-orange-700">{store.streak}<span className="text-sm ml-0.5">d</span></p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Challenges + Why */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl p-5 border border-gray-100"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <h3 className="font-semibold text-gray-900 mb-1">Why Am I Here?</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">You have time before delivery. Complete challenges and earn real rewards while you wait.</p>
            <div className="space-y-2">
              {[
                { label: 'Complete challenges', color: 'bg-[#C4B5FD]/20 text-violet-700' },
                { label: 'Earn XP and coins', color: 'bg-[#A7F3D0]/30 text-green-700' },
                { label: 'Claim real rewards', color: 'bg-[#7DD3FC]/20 text-blue-700' },
              ].map(item => (
                <div key={item.label} className={`px-3 py-2 rounded-xl text-xs font-semibold ${item.color}`}>
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2 bg-white rounded-3xl p-5 border border-gray-100"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">Daily Challenges</h3>
              <button className="text-xs text-gray-400 font-medium hover:text-gray-700 flex items-center gap-1">
                Refresh in 12h <ChevronRight size={12}/>
              </button>
            </div>
            {store.challenges.map(c => <ChallengeRow key={c.id} challenge={c}/>)}
          </motion.div>
        </div>

        {/* FEATURED GAME - Basket Blitz */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl p-6 border border-gray-100"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold bg-gray-900 text-white px-2.5 py-1 rounded-full">FEATURED</span>
                <span className="text-xs text-gray-400 font-medium">+150 XP on win</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Basket Blitz</h2>
              <p className="text-sm text-gray-500 mt-0.5">Catch groceries, avoid bad items. Move your mouse to play.</p>
            </div>
            {!showGame && (
              <button
                onClick={() => setShowGame(true)}
                className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition flex items-center gap-2"
              >
                <Play size={14} fill="white"/> Play Now
              </button>
            )}
          </div>

          {showGame ? (
            <BasketBlitz onGameEnd={handleGameEnd} />
          ) : (
            <div
              className="relative rounded-2xl overflow-hidden h-40 cursor-pointer group"
              onClick={() => setShowGame(true)}
            >
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=300&fit=crop&crop=center"
                alt="game"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition">
                  <Play size={20} fill="white" className="text-white ml-1"/>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Other games */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-5 border border-gray-100"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Play & Earn</h3>
            <button className="text-xs text-gray-400 font-medium flex items-center gap-1 hover:text-gray-700">
              View all <ChevronRight size={12}/>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {PREVIEW_GAMES.map(game => (
              <div key={game.id} className="relative rounded-2xl overflow-hidden border border-gray-100 card-hover">
                <img src={game.image} alt={game.name} className="w-full h-32 object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"/>
                {game.locked && (
                  <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5">
                      <Lock size={16} className="text-white"/>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white font-bold text-sm">{game.name}</p>
                      <p className="text-white/60 text-xs">{game.time}</p>
                    </div>
                    {!game.locked && (
                      <button className="bg-white text-gray-900 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-gray-100 transition flex items-center gap-1">
                        <Play size={10} fill="currentColor"/> Play
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showReward && lastResult && (
          <RewardModal
            score={lastResult.score}
            won={lastResult.won}
            onClose={() => { setShowReward(false); navigate('/rewards'); }}
            onPlayAgain={() => { setShowReward(false); setShowGame(true); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
