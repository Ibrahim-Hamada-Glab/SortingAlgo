export default function* combSort(a) {
  const n = a.length;
  const shrink = 1.3;
  let gap = n;
  let sorted = false;
  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }
    for (let i = 0; i + gap < n; i++) {
      yield { type: 'compare', i, j: i + gap };
      if (a[i] > a[i + gap]) {
        [a[i], a[i + gap]] = [a[i + gap], a[i]];
        yield { type: 'swap', i, j: i + gap };
        sorted = false;
      }
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted', i };
}
