import { Step } from "../types";

export function generateLinearSearchSteps(initialArray: number[], target: number): Step[] {
  const arr = [...initialArray];
  const steps: Step[] = [];
  const n = arr.length;
  let comparisons = 0;

  steps.push({
    array: [...arr],
    target,
    description: `Bắt đầu Linear Search. Mục tiêu tìm kiếm: target = ${target}.`,
    comparisons: 0,
    codeLine: 1,
  });

  let foundIndex = -1;

  for (let i = 0; i < n; i++) {
    comparisons++;
    steps.push({
      array: [...arr],
      highlights: [i],
      target,
      description: `Kiểm tra vị trí index ${i}: arr[${i}] = ${arr[i]}. So sánh với target = ${target}.`,
      comparisons,
      codeLine: 3,
    });

    if (arr[i] === target) {
      foundIndex = i;
      steps.push({
        array: [...arr],
        sorted: [i],
        target,
        description: `Tìm thấy mục tiêu ${target} tại vị trí index ${i} sau ${comparisons} phép so sánh!`,
        comparisons,
        codeLine: 4,
      });
      break;
    }
  }

  if (foundIndex === -1) {
    steps.push({
      array: [...arr],
      target,
      description: `Không tìm thấy giá trị ${target} trong mảng sau khi đã duyệt qua tất cả ${n} phần tử.`,
      comparisons,
      codeLine: 7,
    });
  }

  return steps;
}

export function generateBinarySearchSteps(initialArray: number[], target: number): Step[] {
  // Binary search requires sorted array
  const arr = [...initialArray].sort((a, b) => a - b);
  const steps: Step[] = [];
  const n = arr.length;
  let comparisons = 0;

  steps.push({
    array: [...arr],
    target,
    window: [0, n - 1],
    description: `Bắt đầu Binary Search trên mảng đã được sắp xếp tăng dần. Mục tiêu tìm: target = ${target}.`,
    comparisons: 0,
    codeLine: 1,
  });

  let left = 0;
  let right = n - 1;
  let found = false;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    comparisons++;

    steps.push({
      array: [...arr],
      target,
      window: [left, right],
      pivot: mid,
      highlights: [left, right],
      description: `Khoảng tìm kiếm [${left}..${right}]. Tính điểm giữa mid = (${left} + ${right}) / 2 = ${mid} (giá trị: ${arr[mid]}).`,
      comparisons,
      codeLine: 4,
    });

    if (arr[mid] === target) {
      found = true;
      steps.push({
        array: [...arr],
        target,
        sorted: [mid],
        pivot: mid,
        description: `CHÍNH XÁC! Tìm thấy ${target} tại index ${mid} chỉ sau ${comparisons} lần so sánh!`,
        comparisons,
        codeLine: 6,
      });
      break;
    } else if (arr[mid] < target) {
      steps.push({
        array: [...arr],
        target,
        window: [mid + 1, right],
        pivot: mid,
        description: `Do arr[mid] = ${arr[mid]} < target (${target}), loại bỏ nửa bên trái [${left}..${mid}]. Thu hẹp khoảng tìm sang [${mid + 1}..${right}].`,
        comparisons,
        codeLine: 8,
      });
      left = mid + 1;
    } else {
      steps.push({
        array: [...arr],
        target,
        window: [left, mid - 1],
        pivot: mid,
        description: `Do arr[mid] = ${arr[mid]} > target (${target}), loại bỏ nửa bên phải [${mid}..${right}]. Thu hẹp khoảng tìm sang [${left}..${mid - 1}].`,
        comparisons,
        codeLine: 10,
      });
      right = mid - 1;
    }
  }

  if (!found) {
    steps.push({
      array: [...arr],
      target,
      description: `Không tìm thấy giá trị ${target} trong mảng. Vùng tìm kiếm rỗng (left > right).`,
      comparisons,
      codeLine: 12,
    });
  }

  return steps;
}
