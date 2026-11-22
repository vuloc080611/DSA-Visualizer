import { Step } from "../types";

export interface KnapsackItem {
  id: number;
  name: string;
  weight: number;
  value: number;
}

export const DEFAULT_KNAPSACK_ITEMS: KnapsackItem[] = [
  { id: 1, name: "Laptop", weight: 2, value: 3 },
  { id: 2, name: "Camera", weight: 3, value: 4 },
  { id: 3, name: "Drone", weight: 4, value: 5 },
  { id: 4, name: "Diamond", weight: 5, value: 8 },
];

export const DEFAULT_KNAPSACK_CAPACITY = 7;

export function generateKnapsackSteps(
  items: KnapsackItem[] = DEFAULT_KNAPSACK_ITEMS,
  capacity: number = DEFAULT_KNAPSACK_CAPACITY
): Step[] {
  const steps: Step[] = [];
  const n = items.length;

  // Initialize dp table (n+1) rows by (capacity+1) cols with zeros
  const dpTable: number[][] = Array.from({ length: n + 1 }, () =>
    Array(capacity + 1).fill(0)
  );

  const rowLabels = [
    "Ø (Chưa chọn đồ)",
    ...items.map((item) => `${item.name} (w:${item.weight}, v:${item.value})`),
  ];
  const colLabels = Array.from({ length: capacity + 1 }, (_, w) => w);

  // Step 0: Initial state
  steps.push({
    description: `Khởi tạo bảng Quy hoạch động Kích thước (${n + 1} × ${capacity + 1}). Hàng 0 đại diện cho 0 đồ vật, khởi tạo toàn bộ bằng 0.`,
    codeLine: 2,
    dpTable: dpTable.map((row) => [...row]),
    dpRowLabels: rowLabels,
    dpColLabels: colLabels,
    knapsackItems: items,
    knapsackCapacity: capacity,
    totalValue: 0,
    totalWeight: 0,
    selectedItems: [],
    extraInfo: {
      "Số đồ vật": n,
      "Sức chứa tối đa (W)": capacity,
      "Trạng thái": "Khởi tạo bảng DP",
    },
  });

  // Dynamic programming filling
  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];

    for (let w = 0; w <= capacity; w++) {
      if (w === 0) {
        dpTable[i][0] = 0;
        steps.push({
          description: `Xét đồ vật ${item.name}: Với sức chứa balo W = 0, giá trị tối đa luôn bằng 0.`,
          codeLine: 5,
          dpTable: dpTable.map((row) => [...row]),
          dpRowLabels: rowLabels,
          dpColLabels: colLabels,
          currentDpCell: [i, 0],
          knapsackItems: items,
          knapsackCapacity: capacity,
          selectedItems: [],
          dpFormula: `dp[${i}][0] = 0`,
          extraInfo: {
            "Đang xét": item.name,
            "Sức chứa W": 0,
            "Trọng lượng w_i": item.weight,
            "Giá trị v_i": item.value,
          },
        });
        continue;
      }

      if (item.weight > w) {
        // Cannot include item i because it exceeds current capacity w
        dpTable[i][w] = dpTable[i - 1][w];
        steps.push({
          description: `Đồ vật ${item.name} có khối lượng ${item.weight} > ${w} (vượt quá sức chứa). Không thể chọn đồ vật này! Lấy lại giá trị tối ưu của các đồ vật trước: dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dpTable[i][w]}.`,
          codeLine: 6,
          dpTable: dpTable.map((row) => [...row]),
          dpRowLabels: rowLabels,
          dpColLabels: colLabels,
          currentDpCell: [i, w],
          dpSourceCells: [[i - 1, w]],
          dpFormula: `dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dpTable[i][w]}`,
          knapsackItems: items,
          knapsackCapacity: capacity,
          selectedItems: [],
          extraInfo: {
            "Đang xét": item.name,
            "Sức chứa W": w,
            "Hành động": "Bỏ qua (quá nặng)",
            "Giá trị": dpTable[i][w],
          },
        });
      } else {
        // Can consider including item i: max(not include, include)
        const notInclude = dpTable[i - 1][w];
        const include = dpTable[i - 1][w - item.weight] + item.value;
        const chosen = Math.max(notInclude, include);
        dpTable[i][w] = chosen;

        const isIncluded = include > notInclude;
        const explanation = isIncluded
          ? `Chọn ${item.name} mang lại giá trị cao hơn: max(${notInclude}, ${include}) = ${chosen}.`
          : `Không chọn ${item.name} tối ưu hơn hoặc tương đương: max(${notInclude}, ${include}) = ${chosen}.`;

        steps.push({
          description: `Xét đồ vật ${item.name} (w=${item.weight}, v=${item.value}) với W = ${w}: So sánh [Bỏ qua: dp[${i - 1}][${w}]=${notInclude}] vs [Chọn: dp[${i - 1}][${w - item.weight}] + ${item.value} = ${include}]. ${explanation}`,
          codeLine: 8,
          dpTable: dpTable.map((row) => [...row]),
          dpRowLabels: rowLabels,
          dpColLabels: colLabels,
          currentDpCell: [i, w],
          dpSourceCells: [
            [i - 1, w],
            [i - 1, w - item.weight],
          ],
          dpFormula: `dp[${i}][${w}] = max(${notInclude}, ${include}) = ${chosen}`,
          knapsackItems: items,
          knapsackCapacity: capacity,
          selectedItems: [],
          extraInfo: {
            "Đang xét": item.name,
            "Sức chứa W": w,
            "Không chọn": notInclude,
            "Có chọn": include,
            "Giá trị tối ưu": chosen,
          },
        });
      }
    }
  }

  // Backtracking to find selected items
  steps.push({
    description: `Bảng Quy hoạch động đã được hoàn tất! Giá trị tối ưu tại ô cuối cùng dp[${n}][${capacity}] = ${dpTable[n][capacity]}. Bắt đầu giai đoạn Truy vết ngược (Backtracking) để tìm danh sách các món đồ đã chọn.`,
    codeLine: 12,
    dpTable: dpTable.map((row) => [...row]),
    dpRowLabels: rowLabels,
    dpColLabels: colLabels,
    currentDpCell: [n, capacity],
    knapsackItems: items,
    knapsackCapacity: capacity,
    totalValue: dpTable[n][capacity],
    selectedItems: [],
    extraInfo: {
      "Giai đoạn": "Bắt đầu truy vết",
      "Giá trị cực đại": dpTable[n][capacity],
    },
  });

  let currW = capacity;
  const selected: number[] = [];
  let totalW = 0;
  let totalV = 0;

  for (let i = n; i > 0 && currW > 0; i--) {
    const item = items[i - 1];
    const picked = dpTable[i][currW] !== dpTable[i - 1][currW];

    if (picked) {
      selected.unshift(item.id);
      totalW += item.weight;
      totalV += item.value;

      steps.push({
        description: `Tại ô dp[${i}][${currW}] = ${dpTable[i][currW]} khác dp[${i - 1}][${currW}] = ${dpTable[i - 1][currW]} ➔ Đồ vật "${item.name}" ĐƯỢC CHỌN! Trừ khối lượng ${item.weight}, sức chứa còn lại: ${currW} - ${item.weight} = ${currW - item.weight}.`,
        codeLine: 15,
        dpTable: dpTable.map((row) => [...row]),
        dpRowLabels: rowLabels,
        dpColLabels: colLabels,
        currentDpCell: [i, currW],
        dpSourceCells: [[i - 1, currW - item.weight]],
        selectedItems: [...selected],
        knapsackItems: items,
        knapsackCapacity: capacity,
        totalValue: totalV,
        totalWeight: totalW,
        extraInfo: {
          "Truy vết": `Chọn ${item.name}`,
          "Khối lượng hiện tại": `${totalW} / ${capacity}`,
          "Tổng giá trị": totalV,
        },
      });

      currW -= item.weight;
    } else {
      steps.push({
        description: `Tại ô dp[${i}][${currW}] = ${dpTable[i][currW]} bằng dp[${i - 1}][${currW}] = ${dpTable[i - 1][currW]} ➔ Đồ vật "${item.name}" KHÔNG ĐƯỢC CHỌN. Tiếp tục lùi về hàng trên với cùng sức chứa ${currW}.`,
        codeLine: 18,
        dpTable: dpTable.map((row) => [...row]),
        dpRowLabels: rowLabels,
        dpColLabels: colLabels,
        currentDpCell: [i, currW],
        dpSourceCells: [[i - 1, currW]],
        selectedItems: [...selected],
        knapsackItems: items,
        knapsackCapacity: capacity,
        totalValue: totalV,
        totalWeight: totalW,
        extraInfo: {
          "Truy vết": `Bỏ qua ${item.name}`,
          "Khối lượng hiện tại": `${totalW} / ${capacity}`,
          "Tổng giá trị": totalV,
        },
      });
    }
  }

  // Final celebration step
  const selectedNames = items
    .filter((it) => selected.includes(it.id))
    .map((it) => it.name)
    .join(", ");

  steps.push({
    description: `🎉 HOÀN TẤT THUẬT TOÁN BALO 0/1! Các đồ vật được chọn: [${selectedNames}]. Tổng khối lượng: ${totalW}/${capacity}, Tổng giá trị tối ưu đạt được: ${totalV}.`,
    codeLine: 20,
    dpTable: dpTable.map((row) => [...row]),
    dpRowLabels: rowLabels,
    dpColLabels: colLabels,
    currentDpCell: [n, capacity],
    selectedItems: [...selected],
    knapsackItems: items,
    knapsackCapacity: capacity,
    totalValue: totalV,
    totalWeight: totalW,
    extraInfo: {
      "Kết quả cuối cùng": `Giá trị tối đa: ${totalV}`,
      "Đồ vật đã lấy": selectedNames,
      "Hiệu suất balo": `${Math.round((totalW / capacity) * 100)}% dung lượng`,
    },
  });

  return steps;
}
