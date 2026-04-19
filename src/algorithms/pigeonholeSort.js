export default function* pigeonholeSort(a) {
  const n = a.length;
  if (n === 0) return;
  let min = a[0], max = a[0];
  for (let i = 1; i < n; i++) {
    if (a[i] < min) min = a[i];
    if (a[i] > max) max = a[i];
  }
  const range = max - min + 1;
  const holes = new Array(range).fill(0);
  for (let i = 0; i < n; i++) {
    yield { type: 'compare', i, j: i };
    holes[a[i] - min]++;
  }
  let k = 0;
  for (let v = 0; v < range; v++) {
    while (holes[v] > 0) {
      a[k] = v + min;
      yield { type: 'set', i: k, value: a[k] };
      yield { type: 'sorted', i: k };
      k++;
      holes[v]--;
    }
  }
}
