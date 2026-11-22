import { Step } from "../types";

export interface LinkedListNodeData {
  id: string;
  value: number | string;
  nextId: string | null;
}

export const DEFAULT_LINKED_LIST_VALUES = [15, 42, 68, 83, 99];

// 1. REVERSE LINKED LIST (LeetCode #206)
export function generateReverseLinkedListSteps(values: number[] = DEFAULT_LINKED_LIST_VALUES): Step[] {
  const steps: Step[] = [];
  if (values.length === 0) return steps;

  // Build initial list structure
  const initialNodes: LinkedListNodeData[] = values.map((val, idx) => ({
    id: `node-${idx}`,
    value: val,
    nextId: idx < values.length - 1 ? `node-${idx + 1}` : null,
  }));

  const reversedEdges: [string, string][] = [];

  // Initial step
  steps.push({
    description: `Khởi tạo danh sách liên kết: Con trỏ Head trỏ vào node đầu tiên (${values[0]}). Chuẩn bị các con trỏ: prev = NULL, curr = Head, next = NULL.`,
    codeLine: 1,
    linkedList: JSON.parse(JSON.stringify(initialNodes)),
    headId: "node-0",
    prevNodeId: null,
    currNodeId: "node-0",
    nextNodeId: null,
    reversedEdges: [],
  });

  let prevId: string | null = null;
  let currId: string | null = "node-0";
  let stepCount = 0;

  while (currId !== null) {
    stepCount++;
    const currNode = initialNodes.find((n) => n.id === currId)!;
    const nextId = currNode.nextId;

    // Step: Save next pointer
    steps.push({
      description: `[Bước ${stepCount}.1] Lưu con trỏ kế tiếp: next = curr->next (Node ${
        nextId !== null ? initialNodes.find((n) => n.id === nextId)?.value : "NULL"
      }). Điều này để tránh bị mất liên kết đến phần còn lại của danh sách.`,
      codeLine: 5,
      linkedList: JSON.parse(JSON.stringify(initialNodes)),
      headId: "node-0",
      prevNodeId: prevId,
      currNodeId: currId,
      nextNodeId: nextId,
      reversedEdges: [...reversedEdges],
    });

    // Step: Reverse current node's next pointer to prev
    currNode.nextId = prevId;
    if (prevId) {
      reversedEdges.push([currId, prevId]);
    }

    steps.push({
      description: `[Bước ${stepCount}.2] Đảo chiều con trỏ: curr->next = prev. Con trỏ của Node ${currNode.value} giờ trỏ ngược về ${
        prevId ? `Node ${initialNodes.find((n) => n.id === prevId)?.value}` : "NULL"
      }.`,
      codeLine: 6,
      linkedList: JSON.parse(JSON.stringify(initialNodes)),
      headId: "node-0",
      prevNodeId: prevId,
      currNodeId: currId,
      nextNodeId: nextId,
      reversedEdges: [...reversedEdges],
    });

    // Advance prev and curr pointers
    prevId = currId;
    currId = nextId;

    steps.push({
      description: `[Bước ${stepCount}.3] Tịnh tiến con trỏ về phía trước: prev = curr, curr = next. Tiếp tục duyệt node kế tiếp.`,
      codeLine: 7,
      linkedList: JSON.parse(JSON.stringify(initialNodes)),
      headId: "node-0",
      prevNodeId: prevId,
      currNodeId: currId,
      nextNodeId: null,
      reversedEdges: [...reversedEdges],
    });
  }

  // Final step: update head to prev
  steps.push({
    description: `🎉 HOÀN THÀNH ĐẢO NGƯỢC! Con trỏ curr đã bằng NULL. Gán Head mới = prev (Node ${
      initialNodes.find((n) => n.id === prevId)?.value
    }). Danh sách liên kết đã đảo ngược hoàn toàn!`,
    codeLine: 10,
    linkedList: JSON.parse(JSON.stringify(initialNodes)),
    headId: prevId,
    prevNodeId: prevId,
    currNodeId: null,
    nextNodeId: null,
    reversedEdges: [...reversedEdges],
  });

  return steps;
}

// 2. FLOYD'S CYCLE DETECTION (Rùa & Thỏ - LeetCode #141)
export function generateFloydCycleSteps(): Step[] {
  const steps: Step[] = [];

  // Create a cyclic list: 10 -> 25 -> 40 -> 55 -> 70 -> 85 -> loops back to 40 (node-2)
  const nodeValues = [10, 25, 40, 55, 70, 85];
  const cycleTargetIndex = 2; // Node 40

  const initialNodes: LinkedListNodeData[] = nodeValues.map((val, idx) => ({
    id: `cnode-${idx}`,
    value: val,
    nextId: idx < nodeValues.length - 1 ? `cnode-${idx + 1}` : `cnode-${cycleTargetIndex}`,
  }));

  // Initial step
  steps.push({
    description: `Khởi tạo thuật toán Rùa & Thỏ (Floyd's Tortoise & Hare): Đặt cả con trỏ Slow (🐢 Rùa - 1 bước) và Fast (🐇 Thỏ - 2 bước) tại Head (Node 10). Node 85 tạo chu trình trỏ ngược lại Node 40.`,
    codeLine: 1,
    linkedList: JSON.parse(JSON.stringify(initialNodes)),
    headId: "cnode-0",
    slowNodeId: "cnode-0",
    fastNodeId: "cnode-0",
    cycleEntryId: "cnode-2",
  });

  let slowIdx = 0;
  let fastIdx = 0;
  let meetingPoint: number | null = null;
  let loopCount = 0;

  // Move slow by 1, fast by 2
  while (loopCount < 10) {
    loopCount++;
    // Advance slow by 1 step
    slowIdx = (slowIdx + 1) % nodeValues.length;
    if (slowIdx === 0) slowIdx = cycleTargetIndex; // cycle handling

    // Advance fast by 2 steps
    for (let s = 0; s < 2; s++) {
      fastIdx = (fastIdx + 1) % nodeValues.length;
      if (fastIdx === 0) fastIdx = cycleTargetIndex;
    }

    const slowNode = initialNodes[slowIdx];
    const fastNode = initialNodes[fastIdx];

    const hasMet = slowIdx === fastIdx;

    steps.push({
      description: hasMet
        ? `🎯 BẮT KỊP NHAU! Con trỏ Slow 🐢 và Fast 🐇 đã gặp nhau tại Node ${slowNode.value}! Khẳng định 100% danh sách liên kết CÓ CHU TRÌNH (Cycle Detected)!`
        : `[Lượt ${loopCount}] Rùa 🐢 bước 1 bước tới Node ${slowNode.value}, Thỏ 🐇 chạy 2 bước tới Node ${fastNode.value}. Khoảng cách trong chu trình đang thu hẹp dần.`,
      codeLine: hasMet ? 8 : 4,
      linkedList: JSON.parse(JSON.stringify(initialNodes)),
      headId: "cnode-0",
      slowNodeId: `cnode-${slowIdx}`,
      fastNodeId: `cnode-${fastIdx}`,
      cycleEntryId: "cnode-2",
    });

    if (hasMet) {
      meetingPoint = slowIdx;
      break;
    }
  }

  // Extra step: Find the cycle entry point (LeetCode #142)
  if (meetingPoint !== null) {
    steps.push({
      description: `🔍 Tìm điểm bắt đầu chu trình (Cycle Entry): Đặt lại con trỏ ptr1 về Head (Node 10), giữ ptr2 tại điểm gặp nhau (Node ${nodeValues[meetingPoint]}). Di chuyển mỗi con trỏ 1 bước cùng tốc độ...`,
      codeLine: 11,
      linkedList: JSON.parse(JSON.stringify(initialNodes)),
      headId: "cnode-0",
      slowNodeId: "cnode-0",
      fastNodeId: `cnode-${meetingPoint}`,
      cycleEntryId: "cnode-2",
    });

    steps.push({
      description: `🎉 ĐIỂM BẮT ĐẦU CHU TRÌNH: Cả hai con trỏ gặp lại nhau chính xác tại Node ${nodeValues[cycleTargetIndex]}! Độ phức tạp thời gian O(N), bộ nhớ O(1).`,
      codeLine: 15,
      linkedList: JSON.parse(JSON.stringify(initialNodes)),
      headId: "cnode-0",
      slowNodeId: `cnode-${cycleTargetIndex}`,
      fastNodeId: `cnode-${cycleTargetIndex}`,
      cycleEntryId: "cnode-2",
    });
  }

  return steps;
}
