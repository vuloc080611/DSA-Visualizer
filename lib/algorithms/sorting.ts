import { Step } from "../types";

export function generateBubbleSortSteps(initialArray: number[]): Step[] {
  const arr = [...initialArray];
  const steps: Step[] = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [];

  steps.push({
    array: [...arr],
    description: "Khởi tạo mảng ban đầu. Chuẩn bị chạy Bubble Sort.",
    sorted: [],
    comparisons: 0,
    swaps: 0,
    codeLine: 1,
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      steps.push({
        array: [...arr],
        highlights: [j, j + 1],
        sorted: [...sortedIndices],
        description: `So sánh cặp phần tử arr[${j}] = ${arr[j]} và arr[${j + 1}] = ${arr[j + 1]}.`,
        comparisons,
        swaps,
        codeLine: 4,
      });

      if (arr[j] > arr[j + 1]) {
        swaps++;
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        steps.push({
          array: [...arr],
          swapping: [j, j + 1],
          sorted: [...sortedIndices],
          description: `Do ${arr[j + 1]} < ${arr[j]}, đổi chỗ (swap) hai phần tử.`,
          comparisons,
          swaps,
          codeLine: 5,
        });
      }
    }
    sortedIndices.unshift(n - 1 - i);
    steps.push({
      array: [...arr],
      sorted: [...sortedIndices],
      description: `Phần tử lớn nhất của lượt này (${arr[n - 1 - i]}) đã về đúng vị trí cuối.`,
      comparisons,
      swaps,
      codeLine: 8,
    });
    if (!swapped) {
      steps.push({
        array: [...arr],
        sorted: Array.from({ length: n }, (_, k) => k),
        description: "Mảng đã được sắp xếp hoàn toàn (không có hoán đổi nào trong lượt vừa rồi).",
        comparisons,
        swaps,
        codeLine: 9,
      });
      break;
    }
  }

  // Ensure all marked sorted
  const allSorted = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: [...arr],
    sorted: allSorted,
    description: `Bubble Sort hoàn thành! Tổng cộng: ${comparisons} phép so sánh, ${swaps} lần hoán đổi.`,
    comparisons,
    swaps,
    codeLine: 10,
  });

  return steps;
}

export function generateSelectionSortSteps(initialArray: number[]): Step[] {
  const arr = [...initialArray];
  const steps: Step[] = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [];

  steps.push({
    array: [...arr],
    description: "Khởi tạo mảng ban đầu. Chuẩn bị chạy Selection Sort.",
    sorted: [],
    comparisons: 0,
    swaps: 0,
    codeLine: 1,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({
      array: [...arr],
      highlights: [minIdx],
      sorted: [...sortedIndices],
      description: `Bắt đầu lượt ${i + 1}: Giả định phần tử nhỏ nhất hiện tại ở vị trí ${minIdx} (giá trị: ${arr[minIdx]}).`,
      comparisons,
      swaps,
      codeLine: 3,
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      steps.push({
        array: [...arr],
        highlights: [minIdx, j],
        sorted: [...sortedIndices],
        description: `So sánh arr[${j}] = ${arr[j]} với giá trị nhỏ nhất hiện tại arr[${minIdx}] = ${arr[minIdx]}.`,
        comparisons,
        swaps,
        codeLine: 5,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          highlights: [minIdx],
          sorted: [...sortedIndices],
          description: `Tìm thấy phần tử nhỏ hơn mới tại vị trí ${minIdx} (giá trị: ${arr[minIdx]}).`,
          comparisons,
          swaps,
          codeLine: 6,
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({
        array: [...arr],
        swapping: [i, minIdx],
        sorted: [...sortedIndices],
        description: `Đổi chỗ phần tử nhỏ nhất arr[${minIdx}] với phần tử đầu đoạn chưa sắp xếp arr[${i}].`,
        comparisons,
        swaps,
        codeLine: 8,
      });
    }

    sortedIndices.push(i);
    steps.push({
      array: [...arr],
      sorted: [...sortedIndices],
      description: `Vị trí index ${i} đã được cố định giá trị nhỏ nhất (${arr[i]}).`,
      comparisons,
      swaps,
      codeLine: 9,
    });
  }

  const allSorted = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: [...arr],
    sorted: allSorted,
    description: `Selection Sort hoàn tất! Đã sắp xếp xong toàn bộ mảng.`,
    comparisons,
    swaps,
    codeLine: 10,
  });

  return steps;
}

export function generateInsertionSortSteps(initialArray: number[]): Step[] {
  const arr = [...initialArray];
  const steps: Step[] = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [0];

  steps.push({
    array: [...arr],
    sorted: [0],
    description: "Coi phần tử đầu tiên arr[0] đã được sắp xếp.",
    comparisons: 0,
    swaps: 0,
    codeLine: 1,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      highlights: [i],
      sorted: [...sortedIndices],
      description: `Lấy key = ${key} (tại vị trí index ${i}) để chèn vào đoạn đã sắp xếp [0..${i - 1}].`,
      comparisons,
      swaps,
      codeLine: 3,
    });

    while (j >= 0) {
      comparisons++;
      steps.push({
        array: [...arr],
        highlights: [j, j + 1],
        sorted: [...sortedIndices],
        description: `So sánh arr[${j}] = ${arr[j]} với key = ${key}.`,
        comparisons,
        swaps,
        codeLine: 5,
      });

      if (arr[j] > key) {
        swaps++;
        arr[j + 1] = arr[j];
        steps.push({
          array: [...arr],
          swapping: [j, j + 1],
          sorted: [...sortedIndices],
          description: `Do ${arr[j]} > ${key}, dời arr[${j}] sang phải vị trí ${j + 1}.`,
          comparisons,
          swaps,
          codeLine: 6,
        });
        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    sortedIndices.push(i);
    steps.push({
      array: [...arr],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      highlights: [j + 1],
      description: `Chèn key = ${key} vào vị trí index ${j + 1}.`,
      comparisons,
      swaps,
      codeLine: 8,
    });
  }

  const allSorted = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: [...arr],
    sorted: allSorted,
    description: `Insertion Sort hoàn tất! Toàn bộ mảng đã được sắp xếp.`,
    comparisons,
    swaps,
    codeLine: 10,
  });

  return steps;
}

export function generateMergeSortSteps(initialArray: number[]): Step[] {
  const arr = [...initialArray];
  const steps: Step[] = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  steps.push({
    array: [...arr],
    description: "Khởi tạo Merge Sort. Thuật toán hoạt động theo nguyên lý Chia để Trị (Divide & Conquer).",
    sorted: [],
    comparisons: 0,
    swaps: 0,
    codeLine: 1,
  });

  function merge(start: number, mid: number, end: number) {
    const leftArr = arr.slice(start, mid + 1);
    const rightArr = arr.slice(mid + 1, end + 1);
    let i = 0;
    let j = 0;
    let k = start;

    steps.push({
      array: [...arr],
      window: [start, end],
      description: `Chuẩn bị gộp hai nửa đã sắp xếp: [${start}..${mid}] và [${mid + 1}..${end}].`,
      comparisons,
      swaps,
      codeLine: 6,
    });

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      steps.push({
        array: [...arr],
        highlights: [start + i, mid + 1 + j],
        window: [start, end],
        description: `So sánh ${leftArr[i]} (nửa trái) và ${rightArr[j]} (nửa phải).`,
        comparisons,
        swaps,
        codeLine: 8,
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
        swaps++;
      }

      steps.push({
        array: [...arr],
        swapping: [k],
        window: [start, end],
        description: `Ghi giá trị nhỏ hơn (${arr[k]}) vào vị trí index ${k}.`,
        comparisons,
        swaps,
        codeLine: 10,
      });
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        array: [...arr],
        swapping: [k],
        window: [start, end],
        description: `Đưa phần tử còn lại của nửa trái (${leftArr[i]}) vào vị trí ${k}.`,
        comparisons,
        swaps,
        codeLine: 12,
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        array: [...arr],
        swapping: [k],
        window: [start, end],
        description: `Đưa phần tử còn lại của nửa phải (${rightArr[j]}) vào vị trí ${k}.`,
        comparisons,
        swaps,
        codeLine: 14,
      });
      j++;
      k++;
    }

    steps.push({
      array: [...arr],
      window: [start, end],
      description: `Đã gộp xong đoạn [${start}..${end}].`,
      comparisons,
      swaps,
      codeLine: 15,
    });
  }

  function mergeSort(start: number, end: number) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);

    steps.push({
      array: [...arr],
      window: [start, end],
      pivot: mid,
      description: `Chia đoạn [${start}..${end}] tại điểm giữa mid = ${mid}.`,
      comparisons,
      swaps,
      codeLine: 3,
    });

    mergeSort(start, mid);
    mergeSort(mid + 1, end);
    merge(start, mid, end);
  }

  mergeSort(0, n - 1);

  const allSorted = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: [...arr],
    sorted: allSorted,
    description: `Merge Sort hoàn thành! Độ phức tạp O(N log N) cho mọi trường hợp.`,
    comparisons,
    swaps,
    codeLine: 16,
  });

  return steps;
}

export function generateQuickSortSteps(initialArray: number[]): Step[] {
  const arr = [...initialArray];
  const steps: Step[] = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const fixedPivots: number[] = [];

  steps.push({
    array: [...arr],
    description: "Khởi tạo Quick Sort. Thuật toán chọn một phần tử làm Pivot để phân hoạch (Partition).",
    sorted: [],
    comparisons: 0,
    swaps: 0,
    codeLine: 1,
  });

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      array: [...arr],
      pivot: high,
      window: [low, high],
      sorted: [...fixedPivots],
      description: `Chọn pivot = ${pivot} tại index ${high} cho đoạn [${low}..${high}].`,
      comparisons,
      swaps,
      codeLine: 4,
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      steps.push({
        array: [...arr],
        highlights: [j, high],
        pivot: high,
        window: [low, high],
        sorted: [...fixedPivots],
        description: `So sánh arr[${j}] = ${arr[j]} với pivot = ${pivot}.`,
        comparisons,
        swaps,
        codeLine: 6,
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          swaps++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            array: [...arr],
            swapping: [i, j],
            pivot: high,
            window: [low, high],
            sorted: [...fixedPivots],
            description: `arr[${j}] < ${pivot}, hoán đổi arr[${i}] và arr[${j}] để đưa phần tử nhỏ hơn về bên trái.`,
            comparisons,
            swaps,
            codeLine: 8,
          });
        }
      }
    }

    swaps++;
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const pivotIndex = i + 1;
    fixedPivots.push(pivotIndex);

    steps.push({
      array: [...arr],
      swapping: [pivotIndex, high],
      pivot: pivotIndex,
      sorted: [...fixedPivots],
      description: `Đưa pivot = ${pivot} về vị trí chính xác index ${pivotIndex}. Tất cả phần tử bên trái đều nhỏ hơn, bên phải đều lớn hơn.`,
      comparisons,
      swaps,
      codeLine: 10,
    });

    return pivotIndex;
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high) {
      if (!fixedPivots.includes(low)) {
        fixedPivots.push(low);
      }
    }
  }

  quickSort(0, n - 1);

  const allSorted = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: [...arr],
    sorted: allSorted,
    description: `Quick Sort hoàn thành! Tổng: ${comparisons} so sánh, ${swaps} hoán đổi.`,
    comparisons,
    swaps,
    codeLine: 14,
  });

  return steps;
}

export function generateHeapSortSteps(initialArray: number[]): Step[] {
  const arr = [...initialArray];
  const steps: Step[] = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices: number[] = [];

  steps.push({
    array: [...arr],
    description: "Khởi tạo Heap Sort. Bước 1: Xây dựng Max-Heap từ mảng ban đầu.",
    sorted: [],
    comparisons: 0,
    swaps: 0,
    codeLine: 1,
  });

  function heapify(size: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < size) {
      comparisons++;
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      comparisons++;
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      swaps++;
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({
        array: [...arr],
        swapping: [i, largest],
        sorted: [...sortedIndices],
        description: `Max-Heap vi phạm tại index ${i}. Hoán đổi arr[${i}] = ${arr[largest]} với arr[${largest}] = ${arr[i]}.`,
        comparisons,
        swaps,
        codeLine: 6,
      });
      heapify(size, largest);
    }
  }

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      array: [...arr],
      highlights: [i],
      sorted: [...sortedIndices],
      description: `Heapify nút cha tại index ${i} (giá trị: ${arr[i]}).`,
      comparisons,
      swaps,
      codeLine: 3,
    });
    heapify(n, i);
  }

  steps.push({
    array: [...arr],
    description: "Đã hoàn thành cấu trúc Max-Heap. Gốc (arr[0]) luôn là phần tử lớn nhất hiện tại.",
    sorted: [...sortedIndices],
    comparisons,
    swaps,
    codeLine: 8,
  });

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    swaps++;
    [arr[0], arr[i]] = [arr[i], arr[0]];
    sortedIndices.unshift(i);

    steps.push({
      array: [...arr],
      swapping: [0, i],
      sorted: [...sortedIndices],
      description: `Đổi chỗ gốc max-heap arr[0] (${arr[i]}) về cuối heap tại index ${i}. Cố định phần tử này.`,
      comparisons,
      swaps,
      codeLine: 10,
    });

    steps.push({
      array: [...arr],
      highlights: [0],
      sorted: [...sortedIndices],
      description: `Heapify lại gốc arr[0] trên heap kích thước ${i}.`,
      comparisons,
      swaps,
      codeLine: 12,
    });

    heapify(i, 0);
  }

  const allSorted = Array.from({ length: n }, (_, k) => k);
  steps.push({
    array: [...arr],
    sorted: allSorted,
    description: `Heap Sort hoàn tất! Toàn bộ mảng đã được sắp xếp tăng dần.`,
    comparisons,
    swaps,
    codeLine: 14,
  });

  return steps;
}
