export default function* insertionSort(a) {
  const n = a.length;
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      yield { type: 'compare', i: j - 1, j };
      if (a[j - 1] > a[j]) {
        [a[j - 1], a[j]] = [a[j], a[j - 1]];
        yield { type: 'swap', i: j - 1, j };
        j--;
      } else break;
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted', i };
}
