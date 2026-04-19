const RUN = 16;

export default function* timSort(a) {
  const n = a.length;
  for (let start = 0; start < n; start += RUN) {
    const end = Math.min(start + RUN - 1, n - 1);
    yield* insertion(a, start, end);
  }
  for (let size = RUN; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = left + size - 1;
      const right = Math.min(left + 2 * size - 1, n - 1);
      if (mid < right) yield* merge(a, left, mid, right);
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted', i };
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

function* merge(a, lo, mid, hi) {
  const left = a.slice(lo, mid + 1);
  const right = a.slice(mid + 1, hi + 1);
  let i = 0, j = 0, k = lo;
  while (i < left.length && j < right.length) {
    yield { type: 'compare', i: lo + i, j: mid + 1 + j };
    if (left[i] <= right[j]) {
      a[k] = left[i++];
    } else {
      a[k] = right[j++];
    }
    yield { type: 'set', i: k, value: a[k] };
    k++;
  }
  while (i < left.length) {
    a[k] = left[i++];
    yield { type: 'set', i: k, value: a[k] };
    k++;
  }
  while (j < right.length) {
    a[k] = right[j++];
    yield { type: 'set', i: k, value: a[k] };
    k++;
  }
}
