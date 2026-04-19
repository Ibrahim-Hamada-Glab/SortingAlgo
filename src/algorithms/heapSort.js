export default function* heapSort(a) {
  const n = a.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* siftDown(a, i, n);
  }
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    yield { type: 'swap', i: 0, j: end };
    yield { type: 'sorted', i: end };
    yield* siftDown(a, 0, end);
  }
  yield { type: 'sorted', i: 0 };
}

function* siftDown(a, start, end) {
  let root = start;
  while (2 * root + 1 < end) {
    let child = 2 * root + 1;
    if (child + 1 < end) {
      yield { type: 'compare', i: child, j: child + 1 };
      if (a[child] < a[child + 1]) child++;
    }
    yield { type: 'compare', i: root, j: child };
    if (a[root] < a[child]) {
      [a[root], a[child]] = [a[child], a[root]];
      yield { type: 'swap', i: root, j: child };
      root = child;
    } else return;
  }
}
