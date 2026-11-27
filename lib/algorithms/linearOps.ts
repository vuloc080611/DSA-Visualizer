import { Step } from "../types";

export function generateLinearOpsSteps(): Step[] {
  const steps: Step[] = [];
  const stack: string[] = [];
  const queue: string[] = [];

  steps.push({
    linearOpsStack: [],
    linearOpsQueue: [],
    linearOpsAction: "Khởi tạo",
    description:
      "Khởi tạo Ngăn xếp (Stack - LIFO: Vào sau ra trước) và Hàng đợi (Queue - FIFO: Vào trước ra trước) đều rỗng.",
    codeLine: 1,
    extraInfo: {
      "Stack (Top)": "Rỗng",
      "Queue (Front → Back)": "Rỗng",
    },
  });

  const inputs = ["Task A", "Task B", "Task C"];

  for (const item of inputs) {
    stack.push(item);
    queue.push(item);
    steps.push({
      linearOpsStack: [...stack],
      linearOpsQueue: [...queue],
      linearOpsAction: `Push & Enqueue "${item}"`,
      description: `Thêm "${item}" vào đỉnh Stack (Push) và cuối Queue (Enqueue) — Cả hai đều mất O(1).`,
      codeLine: 3,
      extraInfo: {
        "Stack (LIFO)": stack.join(" → "),
        "Queue (FIFO)": queue.join(" → "),
      },
    });
  }

  // Pop 1 from stack & Dequeue 1 from queue to demonstrate LIFO vs FIFO difference
  const popped = stack.pop()!;
  const dequeued = queue.shift()!;
  steps.push({
    linearOpsStack: [...stack],
    linearOpsQueue: [...queue],
    linearOpsAction: `Pop("${popped}") vs Dequeue("${dequeued}")`,
    description: `Khác biệt cốt lõi: Stack Pop lấy "${popped}" (vào sau cùng, LIFO), trong khi Queue Dequeue lấy "${dequeued}" (vào đầu tiên, FIFO).`,
    codeLine: 6,
    extraInfo: {
      "Stack Pop ra": popped,
      "Queue Dequeue ra": dequeued,
    },
  });

  // Push D to stack & Enqueue D to queue
  stack.push("Task D");
  queue.push("Task D");
  steps.push({
    linearOpsStack: [...stack],
    linearOpsQueue: [...queue],
    linearOpsAction: 'Push & Enqueue "Task D"',
    description: 'Tiếp tục nạp "Task D": đặt lên đỉnh mới của Stack và xếp vào cuối hàng Queue.',
    codeLine: 4,
    extraInfo: {
      "Stack Đỉnh Top": "Task D",
      "Queue Đuôi Back": "Task D",
    },
  });

  // Pop/Dequeue next
  const popped2 = stack.pop()!;
  const dequeued2 = queue.shift()!;
  steps.push({
    linearOpsStack: [...stack],
    linearOpsQueue: [...queue],
    linearOpsAction: `Pop("${popped2}") vs Dequeue("${dequeued2}")`,
    description: `Lượt lấy tiếp theo: Stack lấy ngay "${popped2}" vừa vào; Queue phục vụ "${dequeued2}" theo đúng thứ tự xếp hàng.`,
    codeLine: 7,
    extraInfo: {
      "Stack còn lại": stack.join(" → "),
      "Queue còn lại": queue.join(" → "),
    },
  });

  steps.push({
    linearOpsStack: [...stack],
    linearOpsQueue: [...queue],
    linearOpsAction: "Hoàn tất so sánh LIFO & FIFO",
    description:
      "Hoàn tất minh họa Stack (LIFO - dùng cho Call Stack, Undo/Redo, DFS) và Queue (FIFO - dùng cho Task Queue, BFS) với mọi thao tác O(1).",
    codeLine: 8,
    extraInfo: {
      "Độ phức tạp Push/Pop": "O(1)",
      "Độ phức tạp Enqueue/Dequeue": "O(1)",
    },
  });

  return steps;
}
