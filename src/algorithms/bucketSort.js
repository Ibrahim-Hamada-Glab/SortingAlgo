export default function* bucketSort(a) {
  const n = a.length;
  if (n === 0) return;
  let max = a[0];
  for (let i = 1; i < n; i++) if (a[i] > max) max = a[i];
  const bucketCount = Math.max(1, Math.floor(Math.sqrt(n)));
  const size = Math.ceil((max + 1) / bucketCount);
  const buckets = Array.from({ length: bucketCount }, () => []);
  for (let i = 0; i < n; i++) {
    yield { type: 'compare', i, j: i };
    const idx = Math.min(bucketCount - 1, Math.floor(a[i] / size));
    buckets[idx].push(a[i]);
  }
  let k = 0;
  for (const b of buckets) {
    b.sort((x, y) => x - y);
    for (const v of b) {
      a[k] = v;
      yield { type: 'set', i: k, value: v };
      yield { type: 'sorted', i: k };
      k++;
    }
  }
}
