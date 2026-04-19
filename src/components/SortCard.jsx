import { useEffect, useRef } from 'react';

const COLORS = {
  default: '#7c5cff',
  compare: '#f97316',
  swap: '#ef4444',
  pivot: '#eab308',
  sorted: '#6ee7b7'
};

const PRIORITY = { sorted: 4, swap: 3, pivot: 2, compare: 1 };

export default function SortCard({ algo, state, rank, maxValue, originalLength }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const arr = state.array;
    const n = originalLength;
    const w = rect.width;
    const h = rect.height;
    if (n <= 0 || w <= 0) return;

    const pixelBars = Math.max(1, Math.floor(w));
    const aggregate = n > pixelBars;
    const numBars = aggregate ? pixelBars : n;
    const barW = w / numBars;
    const gap = (!aggregate && n <= 40) ? 1 : 0;
    const actualBarW = Math.max(1, barW - gap);

    const transient = state.transient;
    const hasSortedAll = state.sortedAll;

    const barColor = new Array(numBars);
    if (!aggregate) {
      for (let i = 0; i < n; i++) {
        if (state.sorted.has(i)) barColor[i] = 'sorted';
      }
      for (const k of Object.keys(transient)) {
        const idx = +k;
        if (!state.sorted.has(idx)) {
          const type = transient[k];
          if (!barColor[idx] || PRIORITY[type] > PRIORITY[barColor[idx]]) barColor[idx] = type;
        }
      }
    } else {
      const step = n / numBars;
      for (const k of Object.keys(transient)) {
        const idx = +k;
        const bar = Math.min(numBars - 1, Math.floor(idx / step));
        const type = transient[k];
        if (!barColor[bar] || PRIORITY[type] > PRIORITY[barColor[bar]]) barColor[bar] = type;
      }
    }

    const sampleCount = aggregate ? 3 : 1;
    const step = n / numBars;

    for (let b = 0; b < numBars; b++) {
      let v;
      if (aggregate) {
        const from = Math.floor(b * step);
        const to = Math.min(n, Math.floor((b + 1) * step)) || from + 1;
        v = 0;
        const span = to - from;
        const take = Math.min(sampleCount, span);
        for (let s = 0; s < take; s++) {
          const idx = from + Math.floor(((s + 0.5) / take) * span);
          const val = arr[idx] || 0;
          if (val > v) v = val;
        }
      } else {
        v = arr[b] ?? 0;
      }
      const barH = (v / maxValue) * (h - 2);
      const x = b * barW;
      const y = h - barH;
      let color = COLORS.default;
      if (hasSortedAll) color = COLORS.sorted;
      else if (barColor[b]) color = COLORS[barColor[b]];
      ctx.fillStyle = color;
      ctx.fillRect(x, y, actualBarW, barH);
    }
  });

  const statusLabel =
    state.status === 'done' ? `Done` :
    state.status === 'sorting' ? 'Sorting…' :
    state.status === 'ready' ? 'Ready' : '';

  return (
    <div className={`sort-card ${state.status}`}>
      <div className="sort-card-head">
        <span className="algo-name">{algo.name}</span>
        <div className="head-right">
          {rank ? <span className={`rank rank-${rank}`}>#{rank}</span> : null}
          <span className="status-pill">{statusLabel}</span>
        </div>
      </div>
      <div className="canvas-wrap">
        <canvas ref={canvasRef} />
      </div>
      <div className="sort-card-foot">
        <span>Comparisons: <b>{state.comparisons.toLocaleString()}</b></span>
        <span>Swaps: <b>{state.swaps.toLocaleString()}</b></span>
        <span className="complexity">{algo.complexity}</span>
      </div>
    </div>
  );
}
