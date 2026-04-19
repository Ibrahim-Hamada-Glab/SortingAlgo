import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
/* eslint-disable react-hooks/exhaustive-deps */
import { ALGORITHMS } from './algorithms/index.js';
import SortCard from './components/SortCard.jsx';
import Legend from './components/Legend.jsx';
import Controls from './components/Controls.jsx';
import './App.css';

function generateArray(size, dataset) {
  const a = new Array(size);
  if (dataset === 'reversed') {
    for (let i = 0; i < size; i++) a[i] = size - i;
  } else if (dataset === 'nearly') {
    for (let i = 0; i < size; i++) a[i] = i + 1;
    const swaps = Math.max(1, Math.floor(size / 20));
    for (let s = 0; s < swaps; s++) {
      const i = Math.floor(Math.random() * size);
      const j = Math.floor(Math.random() * size);
      [a[i], a[j]] = [a[j], a[i]];
    }
  } else if (dataset === 'few') {
    const values = [10, 25, 50, 75, 100];
    for (let i = 0; i < size; i++) a[i] = values[Math.floor(Math.random() * values.length)] * Math.ceil(size / 100);
  } else {
    for (let i = 0; i < size; i++) a[i] = 1 + Math.floor(Math.random() * size);
  }
  return a;
}

const DEFAULT_SELECTED = ALGORITHMS.filter((a) => a.category !== 'Joke').map((a) => a.id);

const HEAVY_THRESHOLD = 5000;

function createState(algo, sourceArray) {
  return {
    array: sourceArray,
    gen: null,
    sorted: new Set(),
    transient: {},
    highlights: {},
    comparisons: 0,
    swaps: 0,
    status: 'ready',
    sortedAll: false,
    finishOrder: null,
    startTime: 0,
    elapsed: 0
  };
}

export default function App() {
  const [size, setSize] = useState(64);
  const [speed, setSpeed] = useState(60);
  const [dataset, setDataset] = useState('random');
  const [selectedIds, setSelectedIds] = useState(DEFAULT_SELECTED);
  const [running, setRunning] = useState(false);
  const [focusId, setFocusId] = useState(null);
  const [, setFrame] = useState(0);

  const sourceRef = useRef(generateArray(size, dataset));
  const statesRef = useRef(new Map());
  const rafRef = useRef(null);
  const finishCounterRef = useRef(0);
  const runStartRef = useRef(0);
  const maxRefInit = useRef(null);
  if (maxRefInit.current === null) {
    let m = 1; for (const v of sourceRef.current) if (v > m) m = v;
    maxRefInit.current = m;
  }

  const algorithms = useMemo(
    () => (focusId ? ALGORITHMS.filter((a) => a.id === focusId) : ALGORITHMS.filter((a) => selectedIds.includes(a.id))),
    [selectedIds, focusId]
  );

  const maxRef = useRef(maxRefInit.current);

  const rebuild = useCallback(() => {
    const newSource = generateArray(size, dataset);
    sourceRef.current = newSource;
    let m = 1;
    for (const v of newSource) if (v > m) m = v;
    maxRef.current = m;
    const next = new Map();
    for (const algo of ALGORITHMS) {
      next.set(algo.id, createState(algo, newSource));
    }
    statesRef.current = next;
    finishCounterRef.current = 0;
    setFrame((f) => f + 1);
  }, [size, dataset]);

  useEffect(() => {
    rebuild();
  }, [rebuild]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setRunning(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const applyEvent = (state, ev, skipSorted) => {
    switch (ev.type) {
      case 'compare':
        state.comparisons++;
        state.transient[ev.i] = 'compare';
        state.transient[ev.j] = 'compare';
        break;
      case 'swap':
        state.swaps++;
        state.transient[ev.i] = 'swap';
        state.transient[ev.j] = 'swap';
        break;
      case 'set':
        state.swaps++;
        state.transient[ev.i] = 'swap';
        break;
      case 'pivot':
        state.transient[ev.i] = 'pivot';
        break;
      case 'sorted':
        if (!skipSorted) state.sorted.add(ev.i);
        break;
      default:
        break;
    }
  };

  const recomputeHighlights = (state) => {
    const h = {};
    for (const i of state.sorted) h[i] = 'sorted';
    for (const k of Object.keys(state.transient)) {
      const idx = +k;
      if (!state.sorted.has(idx)) h[idx] = state.transient[k];
    }
    state.highlights = h;
  };

  const tickRef = useRef(() => {});
  tickRef.current = () => {
    const stepsPerFrame = Math.max(1, Math.round(speed / 6));
    const activeAlgos = focusId ? [focusId] : selectedIds;
    const skipSorted = sourceRef.current.length > HEAVY_THRESHOLD;
    let anyRunning = false;
    const now = performance.now();

    for (const id of activeAlgos) {
      const state = statesRef.current.get(id);
      if (!state || state.status === 'done' || !state.gen) continue;
      state.transient = {};
      for (let step = 0; step < stepsPerFrame; step++) {
        const next = state.gen.next();
        if (next.done) {
          state.status = 'done';
          state.sortedAll = true;
          state.finishOrder = ++finishCounterRef.current;
          state.elapsed = now - state.startTime;
          break;
        }
        applyEvent(state, next.value, skipSorted);
      }
      if (state.status !== 'done') anyRunning = true;
    }
    setFrame((f) => f + 1);
    if (anyRunning) {
      rafRef.current = requestAnimationFrame(() => tickRef.current());
    } else {
      rafRef.current = null;
      setRunning(false);
    }
  };

  useEffect(() => {
    if (!running) return;
    rafRef.current = requestAnimationFrame(() => tickRef.current());
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running]);

  const run = () => {
    const source = sourceRef.current;
    const activeAlgos = focusId ? [focusId] : selectedIds;
    finishCounterRef.current = 0;
    runStartRef.current = performance.now();
    for (const id of activeAlgos) {
      const algo = ALGORITHMS.find((a) => a.id === id);
      const fresh = createState(algo, source);
      fresh.array = source.slice();
      fresh.gen = algo.fn(fresh.array);
      fresh.status = 'sorting';
      fresh.startTime = runStartRef.current;
      statesRef.current.set(id, fresh);
    }
    setRunning(true);
  };

  const shuffle = () => {
    const arr = sourceRef.current;
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    let m = 1; for (const v of arr) if (v > m) m = v;
    maxRef.current = m;
    for (const algo of ALGORITHMS) {
      statesRef.current.set(algo.id, createState(algo, arr));
    }
    finishCounterRef.current = 0;
    setFrame((f) => f + 1);
  };

  const toggleAlgo = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedIds((prev) => prev.length === ALGORITHMS.length ? DEFAULT_SELECTED : ALGORITHMS.map((a) => a.id));
  };

  const rankedStates = algorithms.map((algo) => {
    const state = statesRef.current.get(algo.id) || createState(algo, sourceRef.current);
    return { algo, state };
  });

  return (
    <div className="app">
      <header className="header">
        <div className="title">
          <span className="logo">⚡</span>
          <div>
            <h1>Sort Race</h1>
            <p>Compare {ALGORITHMS.length} sorting algorithms side by side</p>
          </div>
        </div>
        <Legend />
      </header>

      <Controls
        size={size} speed={speed} dataset={dataset} running={running}
        selectedCount={selectedIds.length} totalCount={ALGORITHMS.length}
        onSize={setSize} onSpeed={setSpeed} onDataset={setDataset}
        onRun={run} onStop={stop} onShuffle={shuffle} onReset={rebuild}
        onToggleAll={toggleAll} onFocusAlgo={setFocusId} focusMode={!!focusId}
      />

      {!focusId ? (
        <div className="algo-filter">
          {ALGORITHMS.map((a) => (
            <label key={a.id} className={`chip ${selectedIds.includes(a.id) ? 'on' : ''}`}>
              <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => toggleAlgo(a.id)} disabled={running} />
              {a.name}
            </label>
          ))}
        </div>
      ) : null}

      <div className={`grid ${focusId ? 'focus' : ''}`}>
        {rankedStates.map(({ algo, state }) => (
          <div key={algo.id} onClick={() => !running && setFocusId(focusId ? null : algo.id)} className="card-click">
            <SortCard
              algo={algo}
              state={state}
              rank={state.finishOrder}
              maxValue={maxRef.current}
              originalLength={sourceRef.current.length}
            />
          </div>
        ))}
      </div>

      <footer className="footer">
        <span>Click a card to focus. Toggle algorithms above. Drag sliders to adjust size & speed.</span>
      </footer>
    </div>
  );
}
