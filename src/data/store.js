// Central store with pub/sub pattern
let state = {
  xp: 5230,
  nextLevelXp: 7500,
  level: 7,
  coins: 840,
  streak: 7,
  orders: 24,
  challengesPlayed: 18,
  rewardsEarned: 12,
  cart: [],
  orderPlaced: false,
  challenges: [
    { id: 'c1', text: 'Collect 5 Fruits', progress: 0, total: 5, xpReward: 80, icon: 'Apple', done: false },
    { id: 'c2', text: 'Finish under 30 sec', progress: 0, total: 1, xpReward: 120, icon: 'Timer', done: false },
    { id: 'c3', text: 'Play any game', progress: 0, total: 1, xpReward: 50, icon: 'Gamepad2', done: false },
  ],
  badges: [
    { id: 'first_order', name: 'First Order', desc: 'Placed your first order', unlocked: true },
    { id: 'challenge_master', name: 'Challenge Master', desc: 'Completed 10 challenges', unlocked: true },
    { id: 'speed_runner', name: 'Speed Runner', desc: 'Finished a game in record time', unlocked: true },
    { id: 'streak_champ', name: 'Streak Champ', desc: 'Maintained 7-day streak', unlocked: true },
    { id: 'xp_collector', name: 'XP Collector', desc: 'Earned 5000+ XP', unlocked: true },
    { id: 'basket_master', name: 'Basket Master', desc: 'Collected 50 items', unlocked: false },
  ],
  rewards: [
    { id: 1, name: 'Free Ice Cream', desc: 'Redeemed', date: '06 Jun', xp: -150, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=60&h=60&fit=crop' },
    { id: 2, name: '₹50 Cashback', desc: 'Redeemed', date: '05 Jun', xp: -200, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=60&h=60&fit=crop' },
    { id: 3, name: '10% Off Next Order', desc: 'Redeemed', date: '03 Jun', xp: -100, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=60&h=60&fit=crop' },
    { id: 4, name: '₹75 Cashback', desc: 'Redeemed', date: '01 Jun', xp: -300, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=60&h=60&fit=crop' },
  ],
  rewardVault: [
    { id: 1, name: '₹50 Cashback', xpRequired: 500, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=80&h=80&fit=crop', desc: 'On your next order' },
    { id: 2, name: 'Free Ice Cream', xpRequired: 800, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=80&h=80&fit=crop', desc: 'Any flavour' },
    { id: 3, name: 'Free Coffee', xpRequired: 600, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=80&h=80&fit=crop', desc: 'Hot or cold' },
    { id: 4, name: 'Mystery Box', xpRequired: 1200, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=80&h=80&fit=crop', desc: 'Surprise grocery bundle' },
  ],
};

const listeners = new Set();

export function getState() { return { ...state }; }
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notify() { listeners.forEach(fn => fn({ ...state })); }

export function addXP(amount) {
  state.xp += amount;
  if (state.xp >= state.nextLevelXp) {
    state.level += 1;
    state.xp -= state.nextLevelXp;
    state.nextLevelXp = Math.floor(state.nextLevelXp * 1.3);
  }
  notify();
}
export function addCoins(amount) { state.coins += amount; notify(); }
export function addToCart(item) {
  const ex = state.cart.find(c => c.id === item.id);
  if (ex) ex.qty += 1;
  else state.cart = [...state.cart, { ...item, qty: 1 }];
  notify();
}
export function removeFromCart(id) {
  state.cart = state.cart.filter(c => c.id !== id);
  notify();
}
export function placeOrder() { state.orderPlaced = true; notify(); }
export function markChallengeDone(id) {
  const c = state.challenges.find(c => c.id === id);
  if (c && !c.done) { c.done = true; c.progress = c.total; }
  notify();
}
export function incrementGamesPlayed() {
  state.challengesPlayed += 1;
  markChallengeDone('c3');
  notify();
}
