export default function* bubbleSort(a) {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      yield { type: 'compare', i: j, j: j + 1 };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        yield { type: 'swap', i: j, j: j + 1 };
      }
    }
    yield { type: 'sorted', i: n - 1 - i };
    if (!swapped) {
      for (let k = 0; k < n - 1 - i; k++) yield { type: 'sorted', i: k };
      return;
    }
  }
  yield { type: 'sorted', i: 0 };
}
