export default function* countingSort(a) {
  const n = a.length;
  if (n === 0) return;
  let max = a[0];
  for (let i = 1; i < n; i++) if (a[i] > max) max = a[i];
  const count = new Array(max + 1).fill(0);
  for (let i = 0; i < n; i++) {
    yield { type: 'compare', i, j: i };
    count[a[i]]++;
  }
  let k = 0;
  for (let v = 0; v <= max; v++) {
    while (count[v] > 0) {
      a[k] = v;
      yield { type: 'set', i: k, value: v };
      yield { type: 'sorted', i: k };
      k++;
      count[v]--;
    }
  }
}
