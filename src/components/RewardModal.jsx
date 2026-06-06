import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { addXP, addCoins } from '../data/store';

const CONFETTI_COLORS = ['#C4B5FD', '#A7F3D0', '#7DD3FC', '#FBCFE8', '#FDE68A', '#34D399'];

function Confetti() {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 1.5 + Math.random() * 1,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: -10,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            rotate: p.rotation,
          }}
          animate={{ y: 500, rotate: p.rotation + 720, opacity: [1, 1, 0] }}
          transition={{ delay: p.delay, duration: p.duration, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

export default function RewardModal({ score, won, onClose, onPlayAgain }) {
  const [visible, setVisible] = useState(false);
  const xpEarned = won ? 150 : 40;
  const coinsEarned = won ? 50 : 10;

  useEffect(() => {
    addXP(xpEarned);
    addCoins(coinsEarned);
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 200 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.18)' }}
      >
        {won && <Confetti />}

        {/* Header */}
        <div className={`px-6 pt-8 pb-5 text-center relative ${won ? 'bg-gradient-to-b from-[#F5F3FF] to-white' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
          >
            <X size={13} className="text-gray-500"/>
          </button>

          {won ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 12 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#C4B5FD]/30 flex items-center justify-center mx-auto mb-3">
                <img
                  src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=56&h=56&fit=crop"
                  alt="reward"
                  className="w-10 h-10 rounded-xl object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Reward Unlocked</h2>
              <p className="text-violet-600 font-bold text-lg mt-0.5">Free Ice Cream</p>
            </motion.div>
          ) : (
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-black text-gray-400">{score}</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Good Effort</h2>
              <p className="text-sm text-gray-500 mt-0.5">Score: {score}</p>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* XP and coins */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#F5F3FF] rounded-2xl p-4 text-center"
            >
              <p className="text-2xl font-black text-violet-700">+{xpEarned}</p>
              <p className="text-xs font-semibold text-violet-500 mt-0.5">XP Earned</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-amber-50 rounded-2xl p-4 text-center"
            >
              <p className="text-2xl font-black text-amber-600">+{coinsEarned}</p>
              <p className="text-xs font-semibold text-amber-500 mt-0.5">Coins</p>
            </motion.div>
          </div>

          {won && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 border border-gray-100 rounded-2xl p-3.5"
            >
              <img
                src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=56&h=56&fit=crop"
                alt="ice cream"
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Added to Rewards</p>
                <p className="font-bold text-gray-900 text-sm">Free Ice Cream</p>
                <p className="text-xs text-gray-400">Expires in 24 hrs</p>
              </div>
            </motion.div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2"
            >
              Play Again
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
            >
              View Rewards
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
