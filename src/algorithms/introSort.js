export default function* introSort(a) {
  const n = a.length;
  const depthLimit = 2 * Math.floor(Math.log2(Math.max(2, n)));
  yield* run(a, 0, n - 1, depthLimit);
  for (let i = 0; i < n; i++) yield { type: 'sorted', i };
}

function* run(a, lo, hi, depth) {
  const size = hi - lo + 1;
  if (size <= 1) return;
  if (size < 16) { yield* insertion(a, lo, hi); return; }
  if (depth === 0) { yield* heap(a, lo, hi); return; }
  const p = yield* partition(a, lo, hi);
  yield* run(a, lo, p - 1, depth - 1);
  yield* run(a, p + 1, hi, depth - 1);
}

function* insertion(a, lo, hi) {
  for (let i = lo + 1; i <= hi; i++) {
    let j = i;
    while (j > lo) {
      yield { type: 'compare', i: j - 1, j };
      if (a[j - 1] > a[j]) {
        [a[j - 1], a[j]] = [a[j], a[j - 1]];
        yield { type: 'swap', i: j - 1, j };
        j--;
      } else break;
    }
  }
}

function* partition(a, lo, hi) {
  const pivot = a[hi];
  yield { type: 'pivot', i: hi };
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    yield { type: 'compare', i: j, j: hi };
    if (a[j] <= pivot) {
      i++;
      if (i !== j) {
        [a[i], a[j]] = [a[j], a[i]];
        yield { type: 'swap', i, j };
      }
    }
  }
  [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
  yield { type: 'swap', i: i + 1, j: hi };
  return i + 1;
}

function* heap(a, lo, hi) {
  const n = hi - lo + 1;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* sift(a, lo, i, n);
  for (let end = n - 1; end > 0; end--) {
    [a[lo], a[lo + end]] = [a[lo + end], a[lo]];
    yield { type: 'swap', i: lo, j: lo + end };
    yield* sift(a, lo, 0, end);
  }
}

function* sift(a, base, start, end) {
  let root = start;
  while (2 * root + 1 < end) {
    let child = 2 * root + 1;
    if (child + 1 < end) {
      yield { type: 'compare', i: base + child, j: base + child + 1 };
      if (a[base + child] < a[base + child + 1]) child++;
    }
    yield { type: 'compare', i: base + root, j: base + child };
    if (a[base + root] < a[base + child]) {
      [a[base + root], a[base + child]] = [a[base + child], a[base + root]];
      yield { type: 'swap', i: base + root, j: base + child };
      root = child;
    } else return;
  }
}
