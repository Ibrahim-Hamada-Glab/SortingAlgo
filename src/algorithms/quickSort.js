export default function* quickSort(a) {
  yield* qs(a, 0, a.length - 1);
  for (let i = 0; i < a.length; i++) yield { type: 'sorted', i };
}

function* qs(a, lo, hi) {
  if (lo >= hi) {
    if (lo === hi) yield { type: 'sorted', i: lo };
    return;
  }
  const p = yield* partition(a, lo, hi);
  yield { type: 'sorted', i: p };
  yield* qs(a, lo, p - 1);
  yield* qs(a, p + 1, hi);
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
