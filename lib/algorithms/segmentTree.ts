import { Step, SegTreeNodeData } from "../types";

export const DEFAULT_SEG_TREE_ARRAY = [1, 3, 5, 7, 9, 11];

function cloneSegTree(node: SegTreeNodeData | null): SegTreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    range: [...node.range],
    sum: node.sum,
    status: node.status,
    left: cloneSegTree(node.left || null),
    right: cloneSegTree(node.right || null),
  };
}

export function generateSegmentTreeSteps(
  arr: number[] = DEFAULT_SEG_TREE_ARRAY,
  queryRange: [number, number] = [1, 4]
): Step[] {
  const steps: Step[] = [];
  const n = arr.length;
  let currentArr = [...arr];

  // Helper to build tree
  function build(L: number, R: number, id: string = "root"): SegTreeNodeData {
    if (L === R) {
      return {
        id,
        range: [L, R],
        sum: currentArr[L],
        status: "normal",
        left: null,
        right: null,
      };
    }

    const mid = Math.floor((L + R) / 2);
    const leftChild = build(L, mid, `${id}-L`);
    const rightChild = build(mid + 1, R, `${id}-R`);

    return {
      id,
      range: [L, R],
      sum: leftChild.sum + rightChild.sum,
      status: "normal",
      left: leftChild,
      right: rightChild,
    };
  }

  const root = build(0, n - 1);

  // Step 0: Built tree
  steps.push({
    description: `Khởi tạo Cây Phân Đoạn (Segment Tree) cho mảng [${currentArr.join(", ")}]. Mỗi Node đại diện cho một đoạn [L, R] và lưu tổng các phần tử trong đoạn đó. Chiều cao cây là O(log N).`,
    codeLine: 2,
    segTree: cloneSegTree(root),
    segTreeArray: [...currentArr],
    segTreeAction: "build",
    extraInfo: {
      "Kích thước mảng": n,
      "Tổng toàn mảng": root.sum,
      "Gốc đại diện": `[0, ${n - 1}]`,
    },
  });

  // Query Range [qL, qR]
  const [qL, qR] = queryRange;
  let collectedSum = 0;
  const matchedNodes: string[] = [];

  steps.push({
    description: `🔍 BẮT ĐẦU TRUY VẤN TỔNG ĐOẠN (Range Sum Query): Tính tổng các phần tử trong khoảng index [${qL}, ${qR}]. Thay vì duyệt O(N), Segment Tree chỉ duyệt tối đa O(log N) node con!`,
    codeLine: 6,
    segTree: cloneSegTree(root),
    segTreeArray: [...currentArr],
    segTreeQueryRange: [qL, qR],
    segTreeAction: "query",
    extraInfo: {
      "Khoảng truy vấn [L, R]": `[${qL}, ${qR}]`,
      "Mục tiêu": "Tìm tập hợp node con phủ kín đoạn",
    },
  });

  function query(node: SegTreeNodeData | null): void {
    if (!node) return;
    const [L, R] = node.range;

    // Completely outside
    if (R < qL || L > qR) {
      return;
    }

    // Completely inside query range
    if (L >= qL && R <= qR) {
      node.status = "matched";
      matchedNodes.push(node.id);
      collectedSum += node.sum;

      steps.push({
        description: ` Node [${L}, ${R}] (Tổng = ${node.sum}) NẰM HOÀN TOÀN TRONG KHOẢNG [${qL}, ${qR}]. Chọn luôn giá trị tổng ${node.sum} mà không cần đi sâu xuống các con! Tổng tích lũy hiện tại: ${collectedSum}.`,
        codeLine: 9,
        segTree: cloneSegTree(root),
        segTreeArray: [...currentArr],
        segTreeQueryRange: [qL, qR],
        segTreeAction: "query",
        extraInfo: {
          "Node được chọn": `[${L}, ${R}]`,
          "Giá trị node": node.sum,
          "Tổng tích lũy": collectedSum,
        },
      });
      return;
    }

    // Partially overlaps
    node.status = "inspecting";
    steps.push({
      description: `🔍 Node [${L}, ${R}] giao một phần với [${qL}, ${qR}]. Cần rẽ nhánh xuống cây con bên trái và bên phải.`,
      codeLine: 11,
      segTree: cloneSegTree(root),
      segTreeArray: [...currentArr],
      segTreeQueryRange: [qL, qR],
      segTreeAction: "query",
      extraInfo: {
        "Đoạn giao nhau": `[${L}, ${R}] ∩ [${qL}, ${qR}]`,
        "Hành động": "Tách nhánh con",
      },
    });

    query(node.left || null);
    query(node.right || null);
  }

  query(root);

  // Result of query
  steps.push({
    description: `🎉 KẾT QUẢ TRUY VẤN: Tổng đoạn [${qL}, ${qR}] = ${collectedSum}. Hoàn thành chỉ trong O(log N) phép tính!`,
    codeLine: 13,
    segTree: cloneSegTree(root),
    segTreeArray: [...currentArr],
    segTreeQueryRange: [qL, qR],
    segTreeAction: "query",
    extraInfo: {
      "Kết quả tổng": collectedSum,
      "Số node đã ghép": matchedNodes.length,
      "Độ phức tạp": "O(log N)",
    },
  });

  // Point Update Demo: Update arr[2] from 5 to 10
  const updateIdx = 2;
  const newVal = 10;
  const oldVal = currentArr[updateIdx];
  const diff = newVal - oldVal;
  currentArr[updateIdx] = newVal;

  // Reset statuses for update phase
  function resetStatus(node: SegTreeNodeData | null) {
    if (!node) return;
    node.status = "normal";
    resetStatus(node.left || null);
    resetStatus(node.right || null);
  }
  resetStatus(root);

  steps.push({
    description: `⚡ BẮT ĐẦU CẬP NHẬT ĐIỂM (Point Update): Thay đổi giá trị tại index ${updateIdx} từ ${oldVal} thành ${newVal} (chênh lệch: +${diff}). Một đường truyền cập nhật sẽ đi từ Gốc xuống Lá rồi cập nhật ngược lên trong O(log N).`,
    codeLine: 15,
    segTree: cloneSegTree(root),
    segTreeArray: [...currentArr],
    segTreeUpdatedIndex: updateIdx,
    segTreeAction: "update",
    extraInfo: {
      "Vị trí cập nhật": `arr[${updateIdx}]`,
      "Giá trị cũ": oldVal,
      "Giá trị mới": newVal,
    },
  });

  function update(node: SegTreeNodeData | null): void {
    if (!node) return;
    const [L, R] = node.range;

    if (L === R && L === updateIdx) {
      node.sum = newVal;
      node.status = "updated";

      steps.push({
        description: ` Đã chạm tới Node Lá [${L}, ${R}]: Cập nhật giá trị lá từ ${oldVal} ➔ ${newVal}. Bắt đầu lan truyền ngược lên các node cha.`,
        codeLine: 18,
        segTree: cloneSegTree(root),
        segTreeArray: [...currentArr],
        segTreeUpdatedIndex: updateIdx,
        segTreeAction: "update",
        extraInfo: {
          "Cập nhật tại lá": `[${L}, ${R}] = ${newVal}`,
        },
      });
      return;
    }

    const mid = Math.floor((L + R) / 2);
    if (updateIdx <= mid) {
      update(node.left || null);
    } else {
      update(node.right || null);
    }

    // Recompute parent sum
    const leftSum = node.left?.sum || 0;
    const rightSum = node.right?.sum || 0;
    node.sum = leftSum + rightSum;
    node.status = "updated";

    steps.push({
      description: ` Cập nhật Node cha [${L}, ${R}]: Tổng mới = Cây con trái (${leftSum}) + Cây con phải (${rightSum}) = ${node.sum}.`,
      codeLine: 20,
      segTree: cloneSegTree(root),
      segTreeArray: [...currentArr],
      segTreeUpdatedIndex: updateIdx,
      segTreeAction: "update",
      extraInfo: {
        "Node cha": `[${L}, ${R}]`,
        "Tổng mới": node.sum,
      },
    });
  }

  update(root);

  // Final summary
  steps.push({
    description: `🎉 HOÀN TẤT CẬP NHẬT SEGMENT TREE! Mảng hiện tại: [${currentArr.join(", ")}]. Toàn bộ cây đã được đồng bộ chuẩn xác với độ phức tạp O(log N).`,
    codeLine: 22,
    segTree: cloneSegTree(root),
    segTreeArray: [...currentArr],
    segTreeUpdatedIndex: updateIdx,
    segTreeAction: "update",
    extraInfo: {
      "Trạng thái": "Cây Segment Tree hoàn chỉnh",
      "Tổng mới toàn mảng": root.sum,
    },
  });

  return steps;
}
