import { Step } from "../types";

export function generateTwoSumSteps(initialArray: number[], target: number = 26): Step[] {
  const arr = [...initialArray];
  const steps: Step[] = [];
  const map: Record<number, number> = {};

  steps.push({
    array: [...arr],
    target,
    description: `Bắt đầu Two Sum bằng phương pháp Bảng Băm (Hash Map). Mục tiêu: Tìm 2 số có tổng bằng ${target}.`,
    codeLine: 1,
    extraInfo: { "Mục tiêu (Target)": target, "Hash Map": "{ rỗng }" },
  });

  let found = false;

  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    const complement = target - val;

    steps.push({
      array: [...arr],
      highlights: [i],
      target,
      description: `Xét index ${i} (giá trị: ${val}). Số bù cần tìm: complement = ${target} - ${val} = ${complement}.`,
      codeLine: 3,
      extraInfo: {
        "Giá trị hiện tại": `${val} (index ${i})`,
        "Số bù cần tìm": complement,
        "Hash Map": Object.keys(map).length > 0 ? JSON.stringify(map) : "{ rỗng }",
      },
    });

    if (complement in map) {
      const prevIdx = map[complement];
      found = true;
      steps.push({
        array: [...arr],
        sorted: [prevIdx, i],
        target,
        description: `TÌM THẤY! Số ${complement} đã có trong Hash Map tại index ${prevIdx}. Cặp nghiệm: arr[${prevIdx}] (${complement}) + arr[${i}] (${val}) = ${target}!`,
        codeLine: 5,
        extraInfo: {
          "Kết quả": `arr[${prevIdx}] + arr[${i}] = ${complement} + ${val} = ${target}`,
          "Index 1": prevIdx,
          "Index 2": i,
        },
      });
      break;
    }

    map[val] = i;
    steps.push({
      array: [...arr],
      highlights: [i],
      target,
      description: `Chưa có ${complement} trong Map. Lưu { ${val}: index ${i} } vào Hash Map và tiếp tục.`,
      codeLine: 8,
      extraInfo: {
        "Đã lưu vào Map": `{ ${val} ➔ index ${i} }`,
        "Hash Map hiện tại": JSON.stringify(map),
      },
    });
  }

  if (!found) {
    steps.push({
      array: [...arr],
      target,
      description: `Không tìm thấy bất kỳ cặp hai số nào có tổng bằng ${target}.`,
      codeLine: 10,
    });
  }

  return steps;
}

export function generateSlidingWindowSteps(initialArray: number[], k: number = 3): Step[] {
  const arr = [...initialArray];
  const steps: Step[] = [];
  const n = arr.length;
  const result: number[] = [];

  steps.push({
    array: [...arr],
    description: `Bắt đầu Sliding Window Maximum với kích thước cửa sổ k = ${k}.`,
    codeLine: 1,
    extraInfo: { "Kích thước cửa sổ (k)": k, "Mảng kết quả max": "[]" },
  });

  for (let i = 0; i <= n - k; i++) {
    const windowEnd = i + k - 1;
    const windowSlice = arr.slice(i, windowEnd + 1);
    let maxVal = windowSlice[0];
    let maxIdx = i;

    for (let j = 1; j < windowSlice.length; j++) {
      if (windowSlice[j] > maxVal) {
        maxVal = windowSlice[j];
        maxIdx = i + j;
      }
    }

    steps.push({
      array: [...arr],
      window: [i, windowEnd],
      highlights: Array.from({ length: k }, (_, idx) => i + idx),
      description: `Cửa sổ [${i}..${windowEnd}]: [${windowSlice.join(", ")}]. Đang tìm giá trị lớn nhất trong cửa sổ.`,
      codeLine: 3,
      extraInfo: {
        "Vị trí cửa sổ": `Index ${i} đến ${windowEnd}`,
        "Các phần tử": windowSlice.join(", "),
        "Kết quả đã có": `[${result.join(", ")}]`,
      },
    });

    result.push(maxVal);

    steps.push({
      array: [...arr],
      window: [i, windowEnd],
      sorted: [maxIdx],
      description: `Giá trị lớn nhất trong cửa sổ [${i}..${windowEnd}] là ${maxVal} (tại index ${maxIdx}). Ghi vào kết quả.`,
      codeLine: 6,
      extraInfo: {
        "Max của cửa sổ": maxVal,
        "Mảng kết quả hiện tại": `[${result.join(", ")}]`,
      },
    });
  }

  steps.push({
    array: [...arr],
    description: `Sliding Window hoàn thành! Mảng các giá trị lớn nhất theo từng cửa sổ: [${result.join(", ")}].`,
    codeLine: 8,
    extraInfo: {
      "Kết quả cuối cùng": `[${result.join(", ")}]`,
    },
  });

  return steps;
}

export function generateKadaneSteps(initialArray: number[]): Step[] {
  const arr = [...initialArray];
  const steps: Step[] = [];
  const n = arr.length;

  let maxSoFar = arr[0];
  let currentMax = arr[0];
  let bestStart = 0;
  let bestEnd = 0;
  let tempStart = 0;

  steps.push({
    array: [...arr],
    highlights: [0],
    description: `Khởi tạo Thuật toán Kadane (Maximum Subarray). Gán currentMax = ${arr[0]}, maxSoFar = ${arr[0]}.`,
    codeLine: 1,
    extraInfo: { "Current Max": currentMax, "Max So Far": maxSoFar },
  });

  for (let i = 1; i < n; i++) {
    const val = arr[i];
    let reset = false;

    if (val > currentMax + val) {
      currentMax = val;
      tempStart = i;
      reset = true;
    } else {
      currentMax = currentMax + val;
    }

    steps.push({
      array: [...arr],
      window: [tempStart, i],
      highlights: [i],
      description: reset
        ? `Tại index ${i} (${val}): Bắt đầu một đoạn con mới vì ${val} > tổng trước đó + ${val}. currentMax = ${currentMax}.`
        : `Tại index ${i} (${val}): Mở rộng đoạn con [${tempStart}..${i}]. currentMax mới = ${currentMax}.`,
      codeLine: 4,
      extraInfo: {
        "Đoạn con hiện tại": `[${tempStart}..${i}]`,
        "Current Max": currentMax,
        "Max So Far": maxSoFar,
      },
    });

    if (currentMax > maxSoFar) {
      maxSoFar = currentMax;
      bestStart = tempStart;
      bestEnd = i;

      steps.push({
        array: [...arr],
        window: [bestStart, bestEnd],
        sorted: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k),
        description: `KỶ LỤC MỚI! maxSoFar cập nhật thành ${maxSoFar} với đoạn con [${bestStart}..${bestEnd}].`,
        codeLine: 6,
        extraInfo: {
          "Kỷ lục mới": maxSoFar,
          "Đoạn con tốt nhất": `[${bestStart}..${bestEnd}]`,
        },
      });
    }
  }

  steps.push({
    array: [...arr],
    window: [bestStart, bestEnd],
    sorted: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k),
    description: `Kadane hoàn tất! Dãy con liên tiếp có tổng lớn nhất là [${arr.slice(bestStart, bestEnd + 1).join(", ")}] với Tổng cực đại = ${maxSoFar}.`,
    codeLine: 8,
    extraInfo: {
      "Tổng lớn nhất (Max Sum)": maxSoFar,
      "Vị trí đoạn con": `Index ${bestStart} đến ${bestEnd}`,
      "Các phần tử": arr.slice(bestStart, bestEnd + 1).join(", "),
    },
  });

  return steps;
}
