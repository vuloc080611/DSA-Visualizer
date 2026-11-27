import { Step } from "../types";

export const DEFAULT_HEAP_VALUES = [35, 20, 15, 40, 10, 8];

export function generateMinHeapSteps(inputValues?: number[]): Step[] {
  const steps: Step[] = [];
  const valuesToInsert = inputValues && inputValues.length > 0 ? inputValues : DEFAULT_HEAP_VALUES;

  const heap: number[] = [];

  // Step 1: Initial state
  steps.push({
    heapArray: [],
    description: "Khởi tạo Đống Nhỏ Nhất (Binary Min Heap) rỗng. Quy tắc Min Heap: Giá trị nút cha luôn nhỏ hơn hoặc bằng hai nút con. Gốc (Root) luôn là phần tử nhỏ nhất O(1).",
    codeLine: 1,
    heapAction: "insert",
  });

  // Helper for Sift Up (Bubble Up)
  const siftUp = (startIndex: number) => {
    let curr = startIndex;
    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);

      // Comparison step
      steps.push({
        heapArray: [...heap],
        heapHighlightIndices: [curr, parent],
        description: `Thao tác Sift Up (Đẩy lên): So sánh phần tử con heap[${curr}] = ${heap[curr]} với nút cha heap[${parent}] = ${heap[parent]}.`,
        codeLine: 3,
        heapAction: "sift-up",
      });

      if (heap[curr] < heap[parent]) {
        // Swap
        const temp = heap[curr];
        heap[curr] = heap[parent];
        heap[parent] = temp;

        steps.push({
          heapArray: [...heap],
          heapHighlightIndices: [parent],
          heapSwappingIndices: [curr, parent],
          description: `Vì con (${temp}) < cha (${heap[curr]}), hoán đổi vị trí để bảo toàn tính chất Min Heap! Tiếp tục đẩy lên nếu cần.`,
          codeLine: 4,
          heapAction: "sift-up",
        });

        curr = parent;
      } else {
        steps.push({
          heapArray: [...heap],
          heapHighlightIndices: [curr],
          description: `Phần tử ${heap[curr]} >= cha ${heap[parent]}. Vị trí đã thỏa mãn tính chất Min Heap!`,
          codeLine: 5,
          heapAction: "sift-up",
        });
        break;
      }
    }
  };

  // Helper for Sift Down (Heapify Down)
  const siftDown = (startIndex: number) => {
    let curr = startIndex;
    const n = heap.length;

    while (2 * curr + 1 < n) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      let smallest = curr;

      if (left < n && heap[left] < heap[smallest]) {
        smallest = left;
      }
      if (right < n && heap[right] < heap[smallest]) {
        smallest = right;
      }

      steps.push({
        heapArray: [...heap],
        heapHighlightIndices: right < n ? [curr, left, right] : [curr, left],
        description: `Thao tác Sift Down (Hạ xuống): So sánh nút cha heap[${curr}] = ${heap[curr]} với các con (trái: ${heap[left]}${right < n ? `, phải: ${heap[right]}` : ""}). Con nhỏ nhất là: ${heap[smallest]}.`,
        codeLine: 8,
        heapAction: "sift-down",
      });

      if (smallest !== curr) {
        const temp = heap[curr];
        heap[curr] = heap[smallest];
        heap[smallest] = temp;

        steps.push({
          heapArray: [...heap],
          heapHighlightIndices: [smallest],
          heapSwappingIndices: [curr, smallest],
          description: `Hoán đổi cha ${temp} với con nhỏ hơn ${heap[curr]}. Tiếp tục hạ xuống để hoàn tất Heapify!`,
          codeLine: 9,
          heapAction: "sift-down",
        });

        curr = smallest;
      } else {
        steps.push({
          heapArray: [...heap],
          heapHighlightIndices: [curr],
          description: `Nút ${heap[curr]} đã nhỏ hơn cả hai con. Quá trình Sift Down kết thúc!`,
          codeLine: 10,
          heapAction: "sift-down",
        });
        break;
      }
    }
  };

  // Step 2: Insert elements one by one
  for (const val of valuesToInsert) {
    heap.push(val);
    const newIdx = heap.length - 1;

    steps.push({
      heapArray: [...heap],
      heapHighlightIndices: [newIdx],
      description: `Thao tác Chèn (Insert ${val}): Đặt phần tử mới ${val} vào cuối mảng (vị trí lá ngoài cùng bên phải heap[${newIdx}]).`,
      codeLine: 2,
      heapAction: "insert",
    });

    siftUp(newIdx);
  }

  // Step 3: Extract Min demonstration
  if (heap.length > 0) {
    const minVal = heap[0];
    const lastVal = heap.pop()!;

    if (heap.length > 0) {
      heap[0] = lastVal;
      steps.push({
        heapArray: [...heap],
        heapHighlightIndices: [0],
        heapExtractedValue: minVal,
        description: `Thao tác Rút phần tử nhỏ nhất (Extract-Min): Lấy phần tử gốc min = ${minVal}. Đưa phần tử cuối cùng (${lastVal}) lên thay thế vị trí gốc.`,
        codeLine: 7,
        heapAction: "extract-min",
      });

      siftDown(0);
    }
  }

  // Final step
  steps.push({
    heapArray: [...heap],
    description: `Hoàn tất các thao tác trên Min Heap! Gốc hiện tại heap[0] = ${heap[0]} luôn là giá trị nhỏ nhất. Độ phức tạp: Chèn O(log N), Lấy Min O(log N), Tra cứu Min O(1).`,
    codeLine: 11,
    heapAction: "complete",
  });

  return steps;
}
