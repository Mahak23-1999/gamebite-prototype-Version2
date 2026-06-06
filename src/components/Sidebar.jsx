import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Gamepad2, Gift, User, Zap } from 'lucide-react';
import { useStore } from '../hooks/useStore';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/order', label: 'Order', icon: ShoppingBag },
  { to: '/hub', label: 'Game', icon: Gamepad2 },
  { to: '/rewards', label: 'Rewards', icon: Gift },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const { xp, nextLevelXp, level, coins, streak } = useStore();
  const pct = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  return (
    <aside className="fixed left-0 top-0 h-screen w-[200px] bg-white border-r border-gray-100 flex flex-col z-40" style={{ boxShadow: '1px 0 0 #E5E7EB' }}>
      {/* Logo */}
      <div className="px-5 py-6 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
            <Zap size={14} color="white" fill="white" />
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">GameBite</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                {label}
                {label === 'Game' && (
                  <span className="ml-auto text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">LIVE</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* XP Card */}
      <div className="mx-3 mb-4 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-gray-700">Level {level}</span>
          <span className="text-xs text-gray-400 font-medium">{xp.toLocaleString()} XP</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2.5">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-amber-400"/>
            </div>
            <span className="text-xs font-bold text-amber-700">{coins}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-200"/>
            <span className="text-xs font-bold text-orange-600">{streak}d</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
