export default function* oddEvenSort(a) {
  const n = a.length;
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 1; i < n - 1; i += 2) {
      yield { type: 'compare', i, j: i + 1 };
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        yield { type: 'swap', i, j: i + 1 };
        sorted = false;
      }
    }
    for (let i = 0; i < n - 1; i += 2) {
      yield { type: 'compare', i, j: i + 1 };
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        yield { type: 'swap', i, j: i + 1 };
        sorted = false;
      }
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted', i };
}
