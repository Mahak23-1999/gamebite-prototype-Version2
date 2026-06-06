import { useEffect, useRef, useState } from 'react';

const W = 660, H = 380;
const BASKET_W = 80, BASKET_H = 24;
const BASKET_Y = H - 50;
const ITEM_SIZE = 38;

const GOOD_ITEMS = [
  { label: 'Milk', color: '#dbeafe', border: '#93c5fd', emoji: null, img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=40&h=40&fit=crop' },
  { label: 'Apple', color: '#fce7f3', border: '#f9a8d4', img: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=40&h=40&fit=crop' },
  { label: 'Banana', color: '#fef9c3', border: '#fde047', img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=40&h=40&fit=crop' },
  { label: 'Bread', color: '#fef3c7', border: '#fcd34d', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=40&h=40&fit=crop' },
  { label: 'Eggs', color: '#ecfdf5', border: '#6ee7b7', img: 'https://images.unsplash.com/photo-1518569656558-1f25e69d2d2d?w=40&h=40&fit=crop' },
];
const BAD_ITEMS = [
  { label: 'Broken', color: '#fee2e2', border: '#fca5a5', bad: true },
  { label: 'Expired', color: '#f3f4f6', border: '#d1d5db', bad: true },
];

function makeItem(frameCount) {
  const isBad = Math.random() < 0.28;
  const pool = isBad ? BAD_ITEMS : GOOD_ITEMS;
  const template = pool[Math.floor(Math.random() * pool.length)];
  return {
    id: frameCount + Math.random(),
    x: Math.random() * (W - ITEM_SIZE - 20) + 10,
    y: -ITEM_SIZE,
    speed: 2.2 + Math.random() * 2,
    ...template,
  };
}

export default function BasketBlitz({ onGameEnd }) {
  const canvasRef = useRef(null);
  const gsRef = useRef(null);
  const animRef = useRef(null);
  const imagesRef = useRef({});
  const [phase, setPhase] = useState('idle');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [collected, setCollected] = useState(0);

  // preload images
  useEffect(() => {
    GOOD_ITEMS.forEach(item => {
      if (item.img) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = item.img;
        img.onload = () => { imagesRef.current[item.label] = img; };
      }
    });
  }, []);

  function initGame() {
    gsRef.current = {
      basketX: W / 2 - BASKET_W / 2,
      items: [],
      score: 0,
      combo: 0,
      collected: 0,
      missed: 0,
      lives: 3,
      timeLeft: 30,
      elapsed: 0,
      frameCount: 0,
      alive: true,
      speed: 1,
      particles: [],
    };
  }

  function startGame() {
    initGame();
    setPhase('playing');
    setScore(0);
    setCombo(0);
    setTimeLeft(30);
    setCollected(0);
  }

  useEffect(() => {
    if (phase !== 'playing') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gs = gsRef.current;

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      gs.basketX = (e.clientX - rect.left) * scaleX - BASKET_W / 2;
      gs.basketX = Math.max(0, Math.min(W - BASKET_W, gs.basketX));
    }
    canvas.addEventListener('mousemove', onMouseMove);

    function drawBg(ctx) {
      // Subtle aisle background
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Shelf lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let y = 80; y < H - 60; y += 90) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Floor
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, H - 28, W, 28);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(0, H - 28, W, 2);
    }

    function drawBasket(ctx, x) {
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.beginPath();
      ctx.ellipse(x + BASKET_W / 2, BASKET_Y + BASKET_H + 4, BASKET_W / 2, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Basket body
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(x, BASKET_Y, BASKET_W, BASKET_H, 6);
      ctx.fill();

      // Basket handle
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(x + BASKET_W / 2, BASKET_Y, 16, Math.PI, 0);
      ctx.stroke();

      // Basket lines
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(x + (BASKET_W / 4) * i, BASKET_Y);
        ctx.lineTo(x + (BASKET_W / 4) * i, BASKET_Y + BASKET_H);
        ctx.stroke();
      }
    }

    function drawItem(ctx, item) {
      const img = imagesRef.current[item.label];
      if (img) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(item.x, item.y, ITEM_SIZE, ITEM_SIZE, 10);
        ctx.clip();
        ctx.drawImage(img, item.x, item.y, ITEM_SIZE, ITEM_SIZE);
        ctx.restore();

        // Border
        ctx.strokeStyle = item.bad ? '#fca5a5' : item.border;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(item.x, item.y, ITEM_SIZE, ITEM_SIZE, 10);
        ctx.stroke();
      } else {
        // Fallback colored box
        ctx.fillStyle = item.color || '#f1f5f9';
        ctx.beginPath();
        ctx.roundRect(item.x, item.y, ITEM_SIZE, ITEM_SIZE, 10);
        ctx.fill();
        ctx.strokeStyle = item.border || '#e5e7eb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(item.x, item.y, ITEM_SIZE, ITEM_SIZE, 10);
        ctx.stroke();

        ctx.fillStyle = item.bad ? '#ef4444' : '#64748b';
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, item.x + ITEM_SIZE / 2, item.y + ITEM_SIZE / 2 + 4);
        ctx.textAlign = 'left';
      }

      if (item.bad) {
        // Red X overlay
        ctx.strokeStyle = 'rgba(239,68,68,0.7)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(item.x + 6, item.y + 6);
        ctx.lineTo(item.x + ITEM_SIZE - 6, item.y + ITEM_SIZE - 6);
        ctx.moveTo(item.x + ITEM_SIZE - 6, item.y + 6);
        ctx.lineTo(item.x + 6, item.y + ITEM_SIZE - 6);
        ctx.stroke();
      } else {
        // Green check
        ctx.strokeStyle = 'rgba(52,211,153,0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(item.x + ITEM_SIZE - 14, item.y + ITEM_SIZE - 10);
        ctx.lineTo(item.x + ITEM_SIZE - 10, item.y + ITEM_SIZE - 6);
        ctx.lineTo(item.x + ITEM_SIZE - 6, item.y + ITEM_SIZE - 14);
        ctx.stroke();
      }
    }

    function drawParticles(ctx) {
      gs.particles = gs.particles.filter(p => p.life > 0);
      gs.particles.forEach(p => {
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
      });
      ctx.globalAlpha = 1;
    }

    function spawnParticles(x, y, good) {
      const colors = good ? ['#34d399', '#a7f3d0', '#6ee7b7'] : ['#f87171', '#fca5a5'];
      for (let i = 0; i < 8; i++) {
        gs.particles.push({
          x: x + ITEM_SIZE / 2, y: y + ITEM_SIZE / 2,
          vx: (Math.random() - 0.5) * 5,
          vy: -Math.random() * 4 - 1,
          r: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 20, maxLife: 20,
        });
      }
    }

    function drawHUD(ctx) {
      // Score
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.beginPath();
      ctx.roundRect(12, 12, 110, 44, 10);
      ctx.fill();
      ctx.fillStyle = '#6b7280';
      ctx.font = '500 10px Inter, sans-serif';
      ctx.fillText('SCORE', 22, 27);
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText(gs.score, 22, 46);

      // Combo
      if (gs.combo > 1) {
        ctx.fillStyle = 'rgba(196,181,253,0.95)';
        ctx.beginPath();
        ctx.roundRect(130, 12, 90, 44, 10);
        ctx.fill();
        ctx.fillStyle = '#6d28d9';
        ctx.font = '500 10px Inter, sans-serif';
        ctx.fillText('COMBO', 140, 27);
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.fillText(`x${gs.combo}`, 140, 46);
      }

      // Timer
      ctx.fillStyle = gs.timeLeft <= 8 ? 'rgba(254,226,226,0.95)' : 'rgba(255,255,255,0.92)';
      ctx.beginPath();
      ctx.roundRect(W / 2 - 40, 12, 80, 44, 10);
      ctx.fill();
      ctx.fillStyle = '#6b7280';
      ctx.font = '500 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TIME', W / 2, 27);
      ctx.fillStyle = gs.timeLeft <= 8 ? '#ef4444' : '#111827';
      ctx.font = `bold 18px Inter, sans-serif`;
      ctx.fillText(`${Math.ceil(gs.timeLeft)}s`, W / 2, 46);
      ctx.textAlign = 'left';

      // Lives
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.beginPath();
      ctx.roundRect(W - 110, 12, 98, 44, 10);
      ctx.fill();
      ctx.fillStyle = '#6b7280';
      ctx.font = '500 10px Inter, sans-serif';
      ctx.fillText('LIVES', W - 100, 27);
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i < gs.lives ? '#ef4444' : '#e5e7eb';
        ctx.beginPath();
        ctx.arc(W - 96 + i * 18, 40, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let lastTs = null;
    function loop(ts) {
      if (!lastTs) lastTs = ts;
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      if (!gs.alive) return;

      gs.frameCount++;
      gs.elapsed += dt;
      gs.timeLeft = Math.max(0, 30 - gs.elapsed);
      gs.speed = 1 + gs.elapsed * 0.05;

      // Spawn
      if (gs.frameCount % 55 === 0) gs.items.push(makeItem(gs.frameCount));

      // Move items
      gs.items.forEach(item => { item.y += item.speed * gs.speed; });

      // Collision check
      const bx = gs.basketX, by = BASKET_Y;
      gs.items = gs.items.filter(item => {
        const caught =
          item.y + ITEM_SIZE >= by &&
          item.y <= by + BASKET_H &&
          item.x + ITEM_SIZE > bx &&
          item.x < bx + BASKET_W;

        if (caught) {
          spawnParticles(item.x, item.y, !item.bad);
          if (item.bad) {
            gs.combo = 0;
            gs.lives -= 1;
            if (gs.lives <= 0) {
              gs.alive = false;
              setPhase('lost');
              setScore(gs.score);
              setCollected(gs.collected);
              onGameEnd && onGameEnd(gs.score, false);
              return false;
            }
          } else {
            gs.combo += 1;
            const pts = 100 * Math.max(1, Math.floor(gs.combo / 3));
            gs.score += pts;
            gs.collected += 1;
          }
          return false;
        }

        // Missed
        if (item.y > H + 10) {
          if (!item.bad) { gs.combo = 0; gs.missed += 1; }
          return false;
        }
        return true;
      });

      // Win
      if (gs.timeLeft <= 0) {
        gs.alive = false;
        setPhase('won');
        setScore(gs.score);
        setCollected(gs.collected);
        onGameEnd && onGameEnd(gs.score, true);
        return;
      }

      setScore(gs.score);
      setCombo(gs.combo);
      setTimeLeft(Math.ceil(gs.timeLeft));
      setCollected(gs.collected);

      ctx.clearRect(0, 0, W, H);
      drawBg(ctx);
      drawParticles(ctx);
      gs.items.forEach(item => drawItem(ctx, item));
      drawBasket(ctx, gs.basketX);
      drawHUD(ctx);

      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, [phase]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-gray-50" style={{ width: W, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <canvas ref={canvasRef} width={W} height={H} className="block cursor-none"/>

        {phase === 'idle' && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Basket Blitz</h3>
              <p className="text-sm text-gray-500">Move your mouse to catch groceries, avoid bad items</p>
            </div>
            <div className="flex gap-4">
              {[['Mouse', 'Move basket'], ['Collect', 'Good items +100pts'], ['Avoid', 'Bad items -1 life']].map(([title, desc]) => (
                <div key={title} className="bg-gray-50 rounded-2xl px-5 py-3 text-center border border-gray-100">
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
            <button
              onClick={startGame}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition shadow-sm"
            >
              Start Game
            </button>
          </div>
        )}

        {phase === 'lost' && (
          <div className="absolute inset-0 bg-red-50/95 backdrop-blur-sm flex flex-col items-center justify-center gap-5">
            <h3 className="text-2xl font-bold text-gray-900">Game Over</h3>
            <div className="flex gap-4">
              <div className="bg-white rounded-2xl px-5 py-3 text-center border border-gray-100">
                <p className="text-2xl font-black text-gray-900">{score}</p>
                <p className="text-xs text-gray-400 mt-0.5">Score</p>
              </div>
              <div className="bg-white rounded-2xl px-5 py-3 text-center border border-gray-100">
                <p className="text-2xl font-black text-gray-900">{collected}</p>
                <p className="text-xs text-gray-400 mt-0.5">Collected</p>
              </div>
            </div>
            <button onClick={startGame} className="bg-gray-900 text-white px-7 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition">
              Try Again
            </button>
          </div>
        )}

        {phase === 'won' && (
          <div className="absolute inset-0 bg-green-50/95 backdrop-blur-sm flex flex-col items-center justify-center gap-5">
            <h3 className="text-2xl font-bold text-gray-900">Time's Up!</h3>
            <div className="flex gap-4">
              <div className="bg-white rounded-2xl px-5 py-3 text-center border border-gray-100">
                <p className="text-2xl font-black text-gray-900">{score}</p>
                <p className="text-xs text-gray-400 mt-0.5">Score</p>
              </div>
              <div className="bg-white rounded-2xl px-5 py-3 text-center border border-gray-100">
                <p className="text-2xl font-black text-gray-900">{collected}</p>
                <p className="text-xs text-gray-400 mt-0.5">Items Caught</p>
              </div>
            </div>
            <button onClick={startGame} className="bg-gray-900 text-white px-7 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-800 transition">
              Play Again
            </button>
          </div>
        )}
      </div>

      {phase === 'playing' && (
        <p className="text-xs text-gray-400 mt-3 font-medium">Move your mouse to control the basket</p>
      )}
    </div>
  );
}
