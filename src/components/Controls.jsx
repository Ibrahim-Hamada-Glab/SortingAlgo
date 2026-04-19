const SIZE_MIN = 8;
const SIZE_MAX = 1_000_000;
const LOG_MIN = Math.log(SIZE_MIN);
const LOG_MAX = Math.log(SIZE_MAX);

function sizeToPos(size) {
  return Math.round(1000 * (Math.log(size) - LOG_MIN) / (LOG_MAX - LOG_MIN));
}
function posToSize(pos) {
  const v = Math.exp(LOG_MIN + (pos / 1000) * (LOG_MAX - LOG_MIN));
  if (v < 100) return Math.round(v);
  if (v < 1000) return Math.round(v / 5) * 5;
  if (v < 10000) return Math.round(v / 50) * 50;
  if (v < 100000) return Math.round(v / 500) * 500;
  return Math.round(v / 5000) * 5000;
}
function fmtSize(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 ? 2 : 0) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 ? 1 : 0) + 'k';
  return String(n);
}

export default function Controls({
  size, speed, running, dataset, onSize, onSpeed, onDataset,
  onRun, onStop, onShuffle, onReset, selectedCount, totalCount, onToggleAll, onFocusAlgo, focusMode
}) {
  const heavy = size >= 5000;
  return (
    <div className="controls">
      <div className="control-row">
        <label>
          <span>Size</span>
          <input
            type="range"
            min="0"
            max="1000"
            step="1"
            value={sizeToPos(size)}
            onChange={(e) => onSize(posToSize(+e.target.value))}
            disabled={running}
          />
          <span className="val size-val">{fmtSize(size)}</span>
        </label>
        <label>
          <span>Speed</span>
          <input type="range" min="1" max="10000" step="1" value={speed} onChange={(e) => onSpeed(+e.target.value)} />
          <span className="val">{speed.toLocaleString()}</span>
        </label>
        <label>
          <span>Dataset</span>
          <select value={dataset} onChange={(e) => onDataset(e.target.value)} disabled={running}>
            <option value="random">Random</option>
            <option value="nearly">Nearly sorted</option>
            <option value="reversed">Reversed</option>
            <option value="few">Few unique</option>
          </select>
        </label>
        <div className="spacer" />
        {!running ? (
          <button className="btn primary" onClick={onRun}>Run all</button>
        ) : (
          <button className="btn danger" onClick={onStop}>Stop</button>
        )}
        <button className="btn" onClick={onShuffle} disabled={running}>Shuffle</button>
        <button className="btn" onClick={onReset} disabled={running}>Reset</button>
      </div>
      <div className="control-row small">
        <button className="btn ghost" onClick={onToggleAll}>{selectedCount === totalCount ? 'Deselect all' : 'Select all'}</button>
        <span className="count-info">{selectedCount}/{totalCount} algorithms</span>
        {heavy ? (
          <span className="warn-info">
            Heavy size — O(n²) algorithms will be very slow. Consider deselecting them.
          </span>
        ) : null}
        {focusMode ? (
          <button className="btn ghost" onClick={() => onFocusAlgo(null)}>Back to all</button>
        ) : null}
      </div>
    </div>
  );
}
