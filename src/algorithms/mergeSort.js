export default function* mergeSort(a) {
  const n = a.length;
  const buf = a.slice();
  yield* msort(a, buf, 0, n - 1);
  for (let i = 0; i < n; i++) yield { type: 'sorted', i };
}

function* msort(a, buf, lo, hi) {
  if (lo >= hi) return;
  const mid = (lo + hi) >> 1;
  yield* msort(a, buf, lo, mid);
  yield* msort(a, buf, mid + 1, hi);
  yield* merge(a, buf, lo, mid, hi);
}

function* merge(a, buf, lo, mid, hi) {
  for (let k = lo; k <= hi; k++) buf[k] = a[k];
  let i = lo;
  let j = mid + 1;
  for (let k = lo; k <= hi; k++) {
    if (i > mid) {
      a[k] = buf[j++];
      yield { type: 'set', i: k, value: a[k] };
    } else if (j > hi) {
      a[k] = buf[i++];
      yield { type: 'set', i: k, value: a[k] };
    } else {
      yield { type: 'compare', i, j };
      if (buf[i] <= buf[j]) {
        a[k] = buf[i++];
      } else {
        a[k] = buf[j++];
      }
      yield { type: 'set', i: k, value: a[k] };
    }
  }
}
