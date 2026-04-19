export default function* cycleSort(a) {
  const n = a.length;
  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item = a[cycleStart];
    let pos = cycleStart;
    for (let i = cycleStart + 1; i < n; i++) {
      yield { type: 'compare', i, j: cycleStart };
      if (a[i] < item) pos++;
    }
    if (pos === cycleStart) {
      yield { type: 'sorted', i: cycleStart };
      continue;
    }
    while (item === a[pos]) pos++;
    [a[pos], item] = [item, a[pos]];
    yield { type: 'set', i: pos, value: a[pos] };
    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        yield { type: 'compare', i, j: cycleStart };
        if (a[i] < item) pos++;
      }
      while (item === a[pos]) pos++;
      [a[pos], item] = [item, a[pos]];
      yield { type: 'set', i: pos, value: a[pos] };
    }
    yield { type: 'sorted', i: cycleStart };
  }
  yield { type: 'sorted', i: n - 1 };
}
