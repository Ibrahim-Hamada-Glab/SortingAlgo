export default function* pancakeSort(a) {
  const n = a.length;
  for (let size = n; size > 1; size--) {
    let maxIdx = 0;
    for (let i = 1; i < size; i++) {
      yield { type: 'compare', i: maxIdx, j: i };
      if (a[i] > a[maxIdx]) maxIdx = i;
    }
    if (maxIdx !== size - 1) {
      if (maxIdx !== 0) yield* flip(a, maxIdx);
      yield* flip(a, size - 1);
    }
    yield { type: 'sorted', i: size - 1 };
  }
  yield { type: 'sorted', i: 0 };
}

function* flip(a, k) {
  let i = 0;
  while (i < k) {
    [a[i], a[k]] = [a[k], a[i]];
    yield { type: 'swap', i, j: k };
    i++;
    k--;
  }
}
