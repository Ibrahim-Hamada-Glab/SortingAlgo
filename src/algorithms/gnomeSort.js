export default function* gnomeSort(a) {
  const n = a.length;
  let i = 0;
  while (i < n) {
    if (i === 0) { i++; continue; }
    yield { type: 'compare', i: i - 1, j: i };
    if (a[i - 1] <= a[i]) {
      i++;
    } else {
      [a[i - 1], a[i]] = [a[i], a[i - 1]];
      yield { type: 'swap', i: i - 1, j: i };
      i--;
    }
  }
  for (let k = 0; k < n; k++) yield { type: 'sorted', i: k };
}
