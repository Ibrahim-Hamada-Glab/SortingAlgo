import bubbleSort from './bubbleSort.js';
import selectionSort from './selectionSort.js';
import insertionSort from './insertionSort.js';
import shellSort from './shellSort.js';
import cocktailSort from './cocktailSort.js';
import combSort from './combSort.js';
import gnomeSort from './gnomeSort.js';
import oddEvenSort from './oddEvenSort.js';
import mergeSort from './mergeSort.js';
import quickSort from './quickSort.js';
import heapSort from './heapSort.js';
import timSort from './timSort.js';
import introSort from './introSort.js';
import countingSort from './countingSort.js';
import radixSort from './radixSort.js';
import bucketSort from './bucketSort.js';
import pigeonholeSort from './pigeonholeSort.js';
import pancakeSort from './pancakeSort.js';
import cycleSort from './cycleSort.js';
import bitonicSort from './bitonicSort.js';
import stoogeSort from './stoogeSort.js';

export const ALGORITHMS = [
  { id: 'bubble',     name: 'Bubble Sort',      category: 'Comparison',     complexity: 'O(n²)',        fn: bubbleSort },
  { id: 'selection',  name: 'Selection Sort',   category: 'Comparison',     complexity: 'O(n²)',        fn: selectionSort },
  { id: 'insertion',  name: 'Insertion Sort',   category: 'Comparison',     complexity: 'O(n²)',        fn: insertionSort },
  { id: 'shell',      name: 'Shell Sort',       category: 'Comparison',     complexity: 'O(n log² n)',  fn: shellSort },
  { id: 'cocktail',   name: 'Cocktail Sort',    category: 'Comparison',     complexity: 'O(n²)',        fn: cocktailSort },
  { id: 'comb',       name: 'Comb Sort',        category: 'Comparison',     complexity: 'O(n²/2^p)',    fn: combSort },
  { id: 'gnome',      name: 'Gnome Sort',       category: 'Comparison',     complexity: 'O(n²)',        fn: gnomeSort },
  { id: 'oddeven',    name: 'Odd-Even Sort',    category: 'Parallel',       complexity: 'O(n²)',        fn: oddEvenSort },
  { id: 'merge',      name: 'Merge Sort',       category: 'Divide & Conquer', complexity: 'O(n log n)', fn: mergeSort },
  { id: 'quick',      name: 'Quick Sort',       category: 'Divide & Conquer', complexity: 'O(n log n)', fn: quickSort },
  { id: 'heap',       name: 'Heap Sort',        category: 'Selection',      complexity: 'O(n log n)',   fn: heapSort },
  { id: 'tim',        name: 'Timsort',          category: 'Hybrid',         complexity: 'O(n log n)',   fn: timSort },
  { id: 'intro',      name: 'Introsort',        category: 'Hybrid',         complexity: 'O(n log n)',   fn: introSort },
  { id: 'counting',   name: 'Counting Sort',    category: 'Non-comparison', complexity: 'O(n + k)',     fn: countingSort },
  { id: 'radix',      name: 'Radix Sort (LSD)', category: 'Non-comparison', complexity: 'O(nk)',        fn: radixSort },
  { id: 'bucket',     name: 'Bucket Sort',      category: 'Non-comparison', complexity: 'O(n + k)',     fn: bucketSort },
  { id: 'pigeonhole', name: 'Pigeonhole Sort',  category: 'Non-comparison', complexity: 'O(n + range)', fn: pigeonholeSort },
  { id: 'pancake',    name: 'Pancake Sort',     category: 'Exotic',         complexity: 'O(n²)',        fn: pancakeSort },
  { id: 'cycle',      name: 'Cycle Sort',       category: 'Exotic',         complexity: 'O(n²)',        fn: cycleSort },
  { id: 'bitonic',    name: 'Bitonic Sort',     category: 'Parallel',       complexity: 'O(log² n)',    fn: bitonicSort },
  { id: 'stooge',     name: 'Stooge Sort',      category: 'Joke',           complexity: 'O(n^2.71)',    fn: stoogeSort }
];

export const ALGO_BY_ID = Object.fromEntries(ALGORITHMS.map((a) => [a.id, a]));
