import { motion } from 'framer-motion';
import { useStore } from '../hooks/useStore';

export default function RewardsPage() {
  const { rewardVault, xp, rewards } = useStore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reward Vault</h1>
          <p className="text-sm text-gray-400 mt-0.5">Your {xp.toLocaleString()} XP unlocks real rewards</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {rewardVault.map((r, i) => {
            const unlocked = xp >= r.xpRequired;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`bg-white rounded-3xl p-5 border flex gap-4 items-center card-hover ${unlocked ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              >
                <img src={r.image} alt={r.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm"/>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{r.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{r.desc}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className={`text-sm font-bold ${unlocked ? 'text-gray-900' : 'text-gray-400'}`}>{r.xpRequired} XP</span>
                    <button className={`px-4 py-1.5 rounded-xl text-sm font-bold transition ${
                      unlocked ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}>
                      {unlocked ? 'Claim Reward' : 'Locked'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 p-5"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h2 className="font-semibold text-gray-900 mb-4">Reward History</h2>
          <div className="divide-y divide-gray-50">
            {rewards.map(r => (
              <div key={r.id} className="flex items-center gap-3 py-3">
                {r.image
                  ? <img src={r.image} alt={r.name} className="w-10 h-10 rounded-xl object-cover"/>
                  : <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 text-xs font-bold">XP</div>
                }
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date} · {r.desc}</p>
                </div>
                <span className="text-sm font-bold text-red-400">{r.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
