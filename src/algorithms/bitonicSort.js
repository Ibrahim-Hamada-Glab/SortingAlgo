export default function* bitonicSort(a) {
  const n = a.length;
  if (n <= 1) { if (n === 1) yield { type: 'sorted', i: 0 }; return; }
  let maxVal = a[0];
  for (let i = 1; i < n; i++) if (a[i] > maxVal) maxVal = a[i];
  const sentinel = maxVal + 1;
  let m = 1;
  while (m < n) m *= 2;
  while (a.length < m) a.push(sentinel);
  yield* sortRec(a, 0, m, 1);
  a.length = n;
  for (let i = 0; i < n; i++) yield { type: 'sorted', i };
}

function* sortRec(a, lo, cnt, dir) {
  if (cnt <= 1) return;
  const k = cnt >> 1;
  yield* sortRec(a, lo, k, 1);
  yield* sortRec(a, lo + k, k, 0);
  yield* bMerge(a, lo, cnt, dir);
}

function* bMerge(a, lo, cnt, dir) {
  if (cnt <= 1) return;
  const k = cnt >> 1;
  for (let i = lo; i < lo + k; i++) {
    const pair = i + k;
    yield { type: 'compare', i, j: pair };
    if ((dir === 1) === (a[i] > a[pair])) {
      [a[i], a[pair]] = [a[pair], a[i]];
      yield { type: 'swap', i, j: pair };
    }
  }
  yield* bMerge(a, lo, k, dir);
  yield* bMerge(a, lo + k, k, dir);
}
