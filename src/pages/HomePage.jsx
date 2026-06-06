import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ChevronDown, Plus, Check, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { addToCart, placeOrder } from '../data/store';
import { useStore } from '../hooks/useStore';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export default function HomePage() {
  const navigate = useNavigate();
  const { cart } = useStore();
  const [added, setAdded] = useState(new Set());
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  function handleAdd(product) {
    addToCart(product);
    setAdded(prev => new Set([...prev, product.id]));
    setTimeout(() => setAdded(prev => { const n = new Set(prev); n.delete(product.id); return n; }), 1500);
  }

  function handleOrder() {
    placeOrder();
    navigate('/order');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center gap-6 sticky top-0 z-30">
        <div className="flex items-center gap-1.5 text-sm cursor-pointer group">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-gray-500">Delivering to</span>
          <span className="font-semibold text-gray-900">Sector 62, Noida</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>

        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition"
            placeholder="Search milk, fruits, bread, detergent..."
          />
        </div>

        <div className="flex items-center gap-3">
          {cart.length > 0 && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={handleOrder}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-sm"
            >
              Place Order
              <span className="bg-white text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{cartCount}</span>
            </motion.button>
          )}
          <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold">M</div>
        </div>
      </header>

      <div className="px-8 py-7 space-y-8 max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-gray-900 rounded-3xl overflow-hidden h-52"
        >
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop&crop=center"
            alt="grocery"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/40"/>
          <div className="relative px-10 py-8 h-full flex flex-col justify-center">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">Quick Commerce + Gamification</p>
            <h1 className="text-white text-4xl font-bold leading-tight tracking-tight mb-1">
              Good Things.<br/>Delivered Fast.
            </h1>
            <p className="text-gray-400 text-sm mt-2">Shop smarter. Play smarter. Earn smarter.</p>
          </div>
          {/* Delivery badge */}
          <div className="absolute top-5 right-6 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/20">
            <p className="text-white/60 text-[10px] font-medium">Avg delivery</p>
            <p className="text-white font-bold text-lg">9 mins</p>
          </div>
        </motion.div>

        {/* Challenge Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-r from-[#C4B5FD]/30 via-[#A7F3D0]/20 to-[#7DD3FC]/20 rounded-2xl p-5 border border-[#C4B5FD]/30 flex items-center gap-5"
        >
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-gray-700" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Quick Challenge of the Day</p>
            <p className="font-semibold text-gray-900">Play a short challenge and earn XP + exciting rewards</p>
          </div>
          <button
            onClick={() => navigate('/hub')}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition whitespace-nowrap"
          >
            Start Challenge <ArrowRight size={14} />
          </button>
        </motion.div>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Categories</h2>
            <button className="text-sm text-gray-500 font-medium hover:text-gray-900 transition">See all</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition ${activeCategory === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
            >All</button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition ${activeCategory === cat.id ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
              >
                <img src={cat.image} alt={cat.name} className="w-4 h-4 rounded-full object-cover"/>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Your Essentials</h2>
            <button className="text-sm text-gray-500 font-medium hover:text-gray-900 transition">See all</button>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-6 gap-3"
          >
            {filtered.slice(0, 12).map(product => (
              <motion.div
                key={product.id}
                variants={fadeUp}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-28 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-[9px] font-bold text-gray-600">
                    +10 XP
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-900 text-xs leading-tight">{product.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5 mb-2">{product.unit}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">₹{product.price}</span>
                    <button
                      onClick={() => handleAdd(product)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        added.has(product.id)
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      {added.has(product.id)
                        ? <Check size={12} className="text-green-600"/>
                        : <Plus size={12} className="text-white"/>
                      }
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating cart */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-50"
            style={{ marginLeft: '100px', transform: 'translateX(-50%) translateX(100px)' }}
          >
            <div className="bg-gray-900 rounded-2xl shadow-2xl px-6 py-3.5 flex items-center gap-6">
              <div>
                <p className="text-gray-400 text-xs">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
                <p className="font-bold text-white">₹{cartTotal}</p>
              </div>
              <button
                onClick={handleOrder}
                className="bg-white text-gray-900 px-5 py-2 rounded-xl font-semibold text-sm hover:bg-gray-100 transition flex items-center gap-2"
              >
                Place Order <ArrowRight size={14}/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
