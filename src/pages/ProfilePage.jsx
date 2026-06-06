import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../hooks/useStore';

const TABS = ['Overview', 'Badges', 'Rewards', 'Game History'];

const HISTORY = [
  { game: 'Basket Blitz', score: 1840, won: true, date: '06 Jun', xp: 150 },
  { game: 'Basket Blitz', score: 720, won: false, date: '05 Jun', xp: 40 },
  { game: 'Basket Blitz', score: 2100, won: true, date: '04 Jun', xp: 150 },
  { game: 'Shelf Sprint', score: 980, won: false, date: '03 Jun', xp: 40 },
];

function StatBox({ label, value, bg = 'bg-gray-50' }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`${bg} rounded-2xl p-4 text-center`}
    >
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
    </motion.div>
  );
}

export default function ProfilePage() {
  const store = useStore();
  const [tab, setTab] = useState('Overview');
  const pct = Math.min(100, Math.round((store.xp / store.nextLevelXp) * 100));

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <div className="h-20 bg-gray-900"/>
          <div className="px-6 pb-5">
            <div className="flex items-end gap-4 -mt-8 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-[#C4B5FD]/40 flex items-center justify-center border-4 border-white shadow-md text-xl font-black text-violet-700">
                M
              </div>
              <div className="pb-1">
                <h1 className="text-lg font-bold text-gray-900">Mahak Kushwah</h1>
                <p className="text-sm text-gray-400">Level {store.level} · Food Explorer</p>
              </div>
              <button className="ml-auto pb-1 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
                Edit Profile
              </button>
            </div>

            <div className="flex justify-between text-xs mb-2">
              <span className="font-semibold text-gray-700">{store.xp.toLocaleString()} / {store.nextLevelXp.toLocaleString()} XP</span>
              <span className="text-gray-400">{100 - pct}% to Level {store.level + 1}</span>
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
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3">
          <StatBox label="Total XP" value={store.xp.toLocaleString()} bg="bg-[#F5F3FF]"/>
          <StatBox label="Orders" value={store.orders} bg="bg-[#F0FDF4]"/>
          <StatBox label="Challenges" value={store.challengesPlayed} bg="bg-[#FEF9C3]"/>
          <StatBox label="Rewards" value={store.rewardsEarned} bg="bg-[#FFF1F2]"/>
          <StatBox label="Streak" value={`${store.streak}d`} bg="bg-[#FFF7ED]"/>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div className="flex border-b border-gray-100 px-5 pt-2">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                  tab === t ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-5">
            {tab === 'Overview' && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Progress Overview</h3>
                  <div className="space-y-0">
                    {[
                      ['Total XP Earned', `${store.xp.toLocaleString()} XP`],
                      ['Total Coins', store.coins],
                      ['Games Played', store.challengesPlayed],
                      ['Challenges Done', store.challengesPlayed],
                      ['Current Streak', `${store.streak} Days`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-3 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-500">{k}</span>
                        <span className="text-sm font-bold text-gray-900">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Your Rewards</h3>
                  <div className="space-y-3">
                    {store.rewardVault.map(r => (
                      <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                        <img src={r.image} alt={r.name} className="w-10 h-10 rounded-xl object-cover"/>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                          <p className="text-xs text-gray-400">{r.desc}</p>
                        </div>
                        <span className="text-xs font-bold text-gray-500">{r.xpRequired} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'Badges' && (
              <div className="grid grid-cols-6 gap-3">
                {store.badges.map(badge => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ y: -2 }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center ${
                      badge.unlocked ? 'bg-gray-50 border-gray-100' : 'bg-gray-50/50 border-gray-100 opacity-40 grayscale'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      badge.unlocked ? 'bg-gray-900' : 'bg-gray-200'
                    }`}>
                      <span className="text-white font-black text-lg">{badge.name[0]}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-800 leading-tight">{badge.name}</p>
                    <p className="text-[9px] text-gray-400 leading-tight">{badge.desc}</p>
                    {badge.unlocked && (
                      <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">Earned</span>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {tab === 'Rewards' && (
              <div className="grid grid-cols-2 gap-3">
                {store.rewardVault.map(r => (
                  <div key={r.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 transition card-hover">
                    <img src={r.image} alt={r.name} className="w-14 h-14 rounded-2xl object-cover"/>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                      <p className="text-xs font-bold text-gray-700 mt-1.5">{r.xpRequired} XP</p>
                    </div>
                    <button className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      store.xp >= r.xpRequired ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}>
                      {store.xp >= r.xpRequired ? 'Claim' : 'Locked'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'Game History' && (
              <div className="divide-y divide-gray-50">
                {HISTORY.map((g, i) => (
                  <div key={i} className="flex items-center gap-4 py-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${g.won ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className={`w-3 h-3 rounded-full ${g.won ? 'bg-green-400' : 'bg-red-300'}`}/>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{g.game}</p>
                      <p className="text-xs text-gray-400">{g.date} · Score: {g.score}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">+{g.xp} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
