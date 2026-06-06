import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, MapPin, Clock, ArrowRight, X, Zap } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { ORDER_ITEMS } from '../data/products';

const STAGES = ['Confirmed', 'Packed', 'On the way', 'Delivered'];

export default function OrderPage() {
  const navigate = useNavigate();
  const { cart } = useStore();
  const [stage, setStage] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [timeLeft, setTimeLeft] = useState(9 * 60 + 48);

  const items = cart.length > 0 ? cart : ORDER_ITEMS;
  const total = cart.length > 0
    ? cart.reduce((s, i) => s + i.price * i.qty, 0)
    : ORDER_ITEMS.reduce((s, i) => s + i.price, 0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1200);
    const t2 = setTimeout(() => setShowCard(true), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-7"
        >
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle size={18} className="text-green-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Order Confirmed</h1>
            <p className="text-xs text-gray-400">Order #GB{Math.floor(Math.random() * 900000) + 100000}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-5">
          {/* Left */}
          <div className="space-y-4">
            {/* Arrival timer */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-5 border border-gray-100"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <p className="text-xs text-gray-400 font-medium mb-1">Arriving in</p>
              <p className="text-5xl font-bold text-gray-900 tabular-nums timer-pulse">{mins}:{secs}</p>
              <p className="text-sm text-gray-400 mt-1">We've got your order and it will be at your door soon.</p>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  {STAGES.map((s, i) => (
                    <span key={s} className={i <= stage ? 'text-gray-900 font-semibold' : ''}>{s}</span>
                  ))}
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gray-900 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(stage / (STAGES.length - 1)) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  {STAGES.map((s, i) => (
                    <div key={s} className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= stage ? 'bg-gray-900' : 'bg-gray-200'}`}/>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Order items */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 border border-gray-100"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover"/>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.unit || item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">₹{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-gray-900 text-lg">₹{total}</span>
              </div>
            </motion.div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Delivery details */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-5 border border-gray-100"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
            >
              <h2 className="font-semibold text-gray-900 mb-4">Delivery Details</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin size={15} className="text-gray-400 mt-0.5 flex-shrink-0"/>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Delivery Address</p>
                    <p className="text-sm font-medium text-gray-800">B-404, Sector 62, Noida</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Clock size={15} className="text-gray-400 flex-shrink-0"/>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-0.5">Estimated Time</p>
                    <p className="text-sm font-medium text-gray-800">8–10 minutes</p>
                  </div>
                </div>
              </div>

              {/* Rider photo */}
              <div className="mt-4 flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face"
                  alt="rider"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs text-gray-400">Your rider</p>
                  <p className="text-sm font-semibold text-gray-900">Rahul Kumar</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                  <span className="text-xs text-green-600 font-medium">8 mins away</span>
                </div>
              </div>
            </motion.div>

            {/* While you wait */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900 rounded-3xl p-5 text-white"
            >
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">While you wait</p>
              <h3 className="text-xl font-bold mb-1">You have ~9 minutes</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Complete challenges, play games, earn real rewards instead of switching apps.</p>
              <div className="flex gap-4 mt-4 text-xs">
                {['Earn XP', 'Win Rewards', 'Unlock Badges'].map((t, i) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#C4B5FD]' : i === 1 ? 'bg-[#A7F3D0]' : 'bg-[#7DD3FC]'}`}/>
                    <span className="text-gray-400">{t}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating challenge card */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ x: 64, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 64, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 w-72 relative"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
              <button
                onClick={() => setShowCard(false)}
                className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <X size={12} className="text-gray-500"/>
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-[#C4B5FD]/30 flex items-center justify-center">
                  <Zap size={15} className="text-violet-600"/>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Challenge Unlocked</p>
                  <p className="text-xs font-bold text-gray-900">Play a quick game</p>
                </div>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                You have enough time before delivery. Play a quick challenge and unlock rewards.
              </p>

              <div className="flex gap-2 text-xs text-gray-400 mb-4">
                {['+150 XP', 'Free Ice Cream', 'Win Cashback'].map((t, i) => (
                  <span key={t} className="bg-gray-50 px-2 py-1 rounded-full font-medium text-gray-600">{t}</span>
                ))}
              </div>

              <button
                onClick={() => navigate('/hub')}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                Play Now <ArrowRight size={14}/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
