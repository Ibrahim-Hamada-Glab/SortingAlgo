export default function* radixSort(a) {
  const n = a.length;
  if (n === 0) return;
  let max = a[0];
  for (let i = 1; i < n; i++) if (a[i] > max) max = a[i];
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    yield* countingByDigit(a, exp);
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted', i };
}

function* countingByDigit(a, exp) {
  const n = a.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);
  for (let i = 0; i < n; i++) {
    yield { type: 'compare', i, j: i };
    count[Math.floor(a[i] / exp) % 10]++;
  }
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];
  for (let i = n - 1; i >= 0; i--) {
    const d = Math.floor(a[i] / exp) % 10;
    output[count[d] - 1] = a[i];
    count[d]--;
  }
  for (let i = 0; i < n; i++) {
    a[i] = output[i];
    yield { type: 'set', i, value: a[i] };
  }
}
