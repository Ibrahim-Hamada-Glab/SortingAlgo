export default function* shellSort(a) {
  const n = a.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      let j = i;
      while (j >= gap) {
        yield { type: 'compare', i: j - gap, j };
        if (a[j - gap] > a[j]) {
          [a[j - gap], a[j]] = [a[j], a[j - gap]];
          yield { type: 'swap', i: j - gap, j };
          j -= gap;
        } else break;
      }
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted', i };
}
