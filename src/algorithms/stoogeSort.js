export default function* stoogeSort(a) {
  yield* ss(a, 0, a.length - 1);
  for (let i = 0; i < a.length; i++) yield { type: 'sorted', i };
}

function* ss(a, lo, hi) {
  if (lo >= hi) return;
  yield { type: 'compare', i: lo, j: hi };
  if (a[lo] > a[hi]) {
    [a[lo], a[hi]] = [a[hi], a[lo]];
    yield { type: 'swap', i: lo, j: hi };
  }
  if (hi - lo + 1 > 2) {
    const t = Math.floor((hi - lo + 1) / 3);
    yield* ss(a, lo, hi - t);
    yield* ss(a, lo + t, hi);
    yield* ss(a, lo, hi - t);
  }
}
