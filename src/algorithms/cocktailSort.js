export default function* cocktailSort(a) {
  const n = a.length;
  let start = 0;
  let end = n - 1;
  let swapped = true;
  while (swapped) {
    swapped = false;
    for (let i = start; i < end; i++) {
      yield { type: 'compare', i, j: i + 1 };
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        yield { type: 'swap', i, j: i + 1 };
        swapped = true;
      }
    }
    yield { type: 'sorted', i: end };
    end--;
    if (!swapped) break;
    swapped = false;
    for (let i = end - 1; i >= start; i--) {
      yield { type: 'compare', i, j: i + 1 };
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        yield { type: 'swap', i, j: i + 1 };
        swapped = true;
      }
    }
    yield { type: 'sorted', i: start };
    start++;
  }
  for (let i = start; i <= end; i++) yield { type: 'sorted', i };
}
