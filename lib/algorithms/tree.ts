import { Step, TreeNodeData } from "../types";

// Helper: Calculate height of tree node
function getHeight(node: TreeNodeData | null | undefined): number {
  if (!node) return 0;
  return node.height ?? (1 + Math.max(getHeight(node.left), getHeight(node.right)));
}

// Helper: Calculate balance factor (Left Height - Right Height)
function getBalanceFactor(node: TreeNodeData | null | undefined): number {
  if (!node) return 0;
  return getHeight(node.left) - getHeight(node.right);
}

// Helper: Clone tree deeply
export function cloneTree(node: TreeNodeData | null | undefined): TreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    height: node.height,
    balanceFactor: node.balanceFactor,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
    x: node.x,
    y: node.y,
  };
}

// Helper: Assign responsive (x, y) coordinates for SVG rendering
export function layoutTree(
  node: TreeNodeData | null | undefined,
  x: number = 350,
  y: number = 45,
  level: number = 0,
  spread: number = 150
): TreeNodeData | null {
  if (!node) return null;
  const nextSpread = Math.max(spread / 1.85, 24);
  const leftLayout = layoutTree(node.left, x - spread, y + 60, level + 1, nextSpread);
  const rightLayout = layoutTree(node.right, x + spread, y + 60, level + 1, nextSpread);

  const h = 1 + Math.max(getHeight(leftLayout), getHeight(rightLayout));
  const bf = getHeight(leftLayout) - getHeight(rightLayout);

  return {
    ...node,
    x,
    y,
    height: h,
    balanceFactor: bf,
    left: leftLayout,
    right: rightLayout,
  };
}

// =========================================================================
// 1. BINARY SEARCH TREE (BST)
// =========================================================================

export function generateBSTSteps(
  initialValues: number[] = [50, 30, 70, 20, 40, 60, 80],
  config?: { action?: "build" | "insert" | "search" | "delete"; target?: number }
): Step[] {
  const steps: Step[] = [];
  let root: TreeNodeData | null = null;

  steps.push({
    tree: null,
    description: "Khởi tạo Cây Nhị Phân Tìm Kiếm (BST) rỗng.",
    codeLine: 1,
    extraInfo: { "Số lượng node": 0, "Thao tác": "Khởi tạo" },
  });

  // Pure insert function that logs steps
  function insertNode(val: number) {
    const path: number[] = [];

    steps.push({
      tree: cloneTree(layoutTree(root)),
      description: `Bắt đầu chèn giá trị ${val} vào cây BST.`,
      treeAction: "insert",
      activeNodeValue: val,
      codeLine: 2,
    });

    if (!root) {
      root = { id: `node-${val}`, value: val };
      steps.push({
        tree: cloneTree(layoutTree(root)),
        description: `Cây đang rỗng. Tạo node gốc Root có giá trị = ${val}.`,
        treeAction: "insert",
        activeNodeValue: val,
        foundNodeValue: val,
        codeLine: 3,
        extraInfo: { "Root": val },
      });
      return;
    }

    let curr: TreeNodeData | null = root;
    let parent: TreeNodeData | null = null;
    let isLeft = false;

    while (curr) {
      parent = curr;
      path.push(curr.value);

      steps.push({
        tree: cloneTree(layoutTree(root)),
        treeHighlights: [...path],
        activeNodeValue: curr.value,
        treeAction: "search",
        description:
          val < curr.value
            ? `So sánh: ${val} < ${curr.value}. Rẽ sang nhánh con BÊN TRÁI.`
            : val > curr.value
            ? `So sánh: ${val} > ${curr.value}. Rẽ sang nhánh con BÊN PHẢI.`
            : `Giá trị ${val} đã tồn tại trong cây BST. Không chèn trùng lặp.`,
        codeLine: val < curr.value ? 5 : 7,
      });

      if (val < curr.value) {
        if (!curr.left) {
          isLeft = true;
          break;
        }
        curr = curr.left;
      } else if (val > curr.value) {
        if (!curr.right) {
          isLeft = false;
          break;
        }
        curr = curr.right;
      } else {
        return; // Duplicate
      }
    }

    const newNode: TreeNodeData = { id: `node-${val}`, value: val };
    if (parent) {
      if (isLeft) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }
    }

    steps.push({
      tree: cloneTree(layoutTree(root)),
      treeHighlights: [...path],
      activeNodeValue: val,
      foundNodeValue: val,
      treeAction: "insert",
      description: `Đã chèn node mới ${val} làm con ${isLeft ? "trái" : "phải"} của node ${parent?.value}.`,
      codeLine: 9,
      extraInfo: { "Node vừa chèn": val, "Node cha": parent?.value ?? "None" },
    });
  }

  // Pure search function that logs steps
  function searchNode(target: number) {
    const path: number[] = [];
    let curr = root;

    steps.push({
      tree: cloneTree(layoutTree(root)),
      description: `Bắt đầu tìm kiếm giá trị target = ${target} trên cây BST.`,
      treeAction: "search",
      codeLine: 11,
      extraInfo: { "Target": target },
    });

    let found = false;
    while (curr) {
      path.push(curr.value);

      if (curr.value === target) {
        found = true;
        steps.push({
          tree: cloneTree(layoutTree(root)),
          treeHighlights: [...path],
          foundNodeValue: target,
          activeNodeValue: target,
          treeAction: "search",
          description: `CHÍNH XÁC! Tìm thấy giá trị ${target} trong cây BST sau khi duyệt qua [${path.join(" ➔ ")}].`,
          codeLine: 13,
          extraInfo: { "Kết quả": "Tìm thấy", "Đường đi duyệt": path.join(" → ") },
        });
        break;
      }

      if (target < curr.value) {
        steps.push({
          tree: cloneTree(layoutTree(root)),
          treeHighlights: [...path],
          activeNodeValue: curr.value,
          treeAction: "search",
          description: `${target} < ${curr.value}. Tiếp tục tìm kiếm ở nhánh con BÊN TRÁI.`,
          codeLine: 15,
        });
        curr = curr.left ?? null;
      } else {
        steps.push({
          tree: cloneTree(layoutTree(root)),
          treeHighlights: [...path],
          activeNodeValue: curr.value,
          treeAction: "search",
          description: `${target} > ${curr.value}. Tiếp tục tìm kiếm ở nhánh con BÊN PHẢI.`,
          codeLine: 17,
        });
        curr = curr.right ?? null;
      }
    }

    if (!found) {
      steps.push({
        tree: cloneTree(layoutTree(root)),
        treeHighlights: [...path],
        treeAction: "search",
        description: `Không tìm thấy giá trị ${target} trong cây BST. Đã chạm nút lá rỗng (NULL).`,
        codeLine: 19,
        extraInfo: { "Kết quả": "Không tồn tại" },
      });
    }
  }

  // Pure delete function that logs steps
  function deleteNodeVal(target: number) {
    steps.push({
      tree: cloneTree(layoutTree(root)),
      description: `Bắt đầu thao tác xóa node có giá trị = ${target} khỏi cây BST.`,
      treeAction: "delete",
      activeNodeValue: target,
      codeLine: 21,
    });

    function deleteHelper(node: TreeNodeData | null | undefined, val: number): TreeNodeData | null {
      if (!node) return null;

      if (val < node.value) {
        node.left = deleteHelper(node.left, val);
      } else if (val > node.value) {
        node.right = deleteHelper(node.right, val);
      } else {
        // Found node to delete
        // Case 1: Leaf node
        if (!node.left && !node.right) {
          steps.push({
            tree: cloneTree(layoutTree(root)),
            activeNodeValue: val,
            treeAction: "delete",
            description: `Node ${val} là Node Lá (không có con). Xóa trực tiếp node này.`,
            codeLine: 23,
          });
          return null;
        }
        // Case 2: Only 1 child
        if (!node.left) {
          const rightChild = node.right ?? null;
          steps.push({
            tree: cloneTree(layoutTree(root)),
            activeNodeValue: val,
            treeAction: "delete",
            description: `Node ${val} chỉ có 1 con phải (${rightChild?.value}). Nối trực tiếp con phải lên thay thế cha.`,
            codeLine: 25,
          });
          return rightChild;
        }
        if (!node.right) {
          const leftChild = node.left ?? null;
          steps.push({
            tree: cloneTree(layoutTree(root)),
            activeNodeValue: val,
            treeAction: "delete",
            description: `Node ${val} chỉ có 1 con trái (${leftChild?.value}). Nối trực tiếp con trái lên thay thế cha.`,
            codeLine: 27,
          });
          return leftChild;
        }

        // Case 3: 2 children
        // Find inorder successor (min in right subtree)
        let successor = node.right;
        while (successor.left) {
          successor = successor.left;
        }

        steps.push({
          tree: cloneTree(layoutTree(root)),
          activeNodeValue: val,
          foundNodeValue: successor.value,
          treeAction: "delete",
          description: `Node ${val} có 2 con. Tìm phần tử nhỏ nhất bên cây con phải (Inorder Successor) là node ${successor.value}.`,
          codeLine: 29,
          extraInfo: { "Node cần xóa": val, "Successor thay thế": successor.value },
        });

        node.value = successor.value;
        node.id = `node-${successor.value}`;

        steps.push({
          tree: cloneTree(layoutTree(root)),
          activeNodeValue: successor.value,
          treeAction: "delete",
          description: `Gán giá trị ${successor.value} vào vị trí cần xóa. Sau đó đệ quy xóa node ${successor.value} ở nhánh phải.`,
          codeLine: 31,
        });

        node.right = deleteHelper(node.right, successor.value);
      }
      return node;
    }

    root = deleteHelper(root, target);

    steps.push({
      tree: cloneTree(layoutTree(root)),
      treeAction: "delete",
      description: `Đã hoàn tất xóa node ${target}. Cây BST vẫn đảm bảo tính chất thứ tự.`,
      codeLine: 33,
    });
  }

  // Execute demo sequence
  for (const v of initialValues) {
    insertNode(v);
  }

  // If specific action requested
  if (config?.action === "search" && config.target !== undefined) {
    searchNode(config.target);
  } else if (config?.action === "delete" && config.target !== undefined) {
    deleteNodeVal(config.target);
  } else if (config?.action === "insert" && config.target !== undefined) {
    insertNode(config.target);
  } else {
    // Default walkthrough demo: Search 40, then Delete 30 (demonstrating 2-child replacement!)
    searchNode(40);
    deleteNodeVal(30);
  }

  steps.push({
    tree: cloneTree(layoutTree(root)),
    description: "BST hoàn thành chuỗi thao tác minh họa! Độ phức tạp trung bình O(log N).",
    codeLine: 35,
    extraInfo: { "Trạng thái": "Hoàn tất", "Số node": initialValues.length },
  });

  return steps;
}

// =========================================================================
// 2. AVL TREE (Self-Balancing Binary Search Tree)
// =========================================================================

export function generateAVLSteps(
  initialValues: number[] = [10, 20, 30, 40, 50, 25],
  config?: { action?: "insert" | "delete"; target?: number }
): Step[] {
  const steps: Step[] = [];
  let root: TreeNodeData | null = null;

  steps.push({
    tree: null,
    description: "Khởi tạo Cây Tự Cân Bằng AVL (Adelson-Velsky & Landis). Hệ số cân bằng BF = Height(Left) - Height(Right) luôn thuộc {-1, 0, 1}.",
    codeLine: 1,
    extraInfo: { "Điều kiện AVL": "-1 ≤ BF ≤ 1", "Thao tác": "Khởi tạo" },
  });

  function rightRotate(y: TreeNodeData): TreeNodeData {
    const x = y.left!;
    const T2 = x.right;

    steps.push({
      tree: cloneTree(layoutTree(root)),
      activeNodeValue: y.value,
      unbalancedNodeValue: x.value,
      treeAction: "rotate-right",
      rotationType: "LL",
      description: `Thực hiện XOAY PHẢI (Right Rotation) tại node ${y.value}. Node ${x.value} sẽ vươn lên làm cha mới.`,
      codeLine: 14,
      extraInfo: { "Gốc xoay": y.value, "Trục nâng lên": x.value, "Loại xoay": "Right (LL)" },
    });

    x.right = y;
    y.left = T2;

    y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
    x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));

    return x;
  }

  function leftRotate(x: TreeNodeData): TreeNodeData {
    const y = x.right!;
    const T2 = y.left;

    steps.push({
      tree: cloneTree(layoutTree(root)),
      activeNodeValue: x.value,
      unbalancedNodeValue: y.value,
      treeAction: "rotate-left",
      rotationType: "RR",
      description: `Thực hiện XOAY TRÁI (Left Rotation) tại node ${x.value}. Node ${y.value} sẽ vươn lên làm cha mới.`,
      codeLine: 20,
      extraInfo: { "Gốc xoay": x.value, "Trục nâng lên": y.value, "Loại xoay": "Left (RR)" },
    });

    y.left = x;
    x.right = T2;

    x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
    y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));

    return y;
  }

  function insertAVL(node: TreeNodeData | null | undefined, val: number): TreeNodeData {
    if (!node) {
      const newNode: TreeNodeData = { id: `avl-${val}`, value: val, height: 1 };
      steps.push({
        tree: cloneTree(layoutTree(root || newNode)),
        activeNodeValue: val,
        foundNodeValue: val,
        treeAction: "insert",
        description: `Chèn node ${val} vào vị trí lá.`,
        codeLine: 4,
        extraInfo: { "Node mới": val, "Height": 1 },
      });
      return newNode;
    }

    if (val < node.value) {
      steps.push({
        tree: cloneTree(layoutTree(root)),
        activeNodeValue: node.value,
        treeAction: "search",
        description: `${val} < ${node.value}: Đi xuống nhánh con TRÁI.`,
        codeLine: 6,
      });
      node.left = insertAVL(node.left, val);
    } else if (val > node.value) {
      steps.push({
        tree: cloneTree(layoutTree(root)),
        activeNodeValue: node.value,
        treeAction: "search",
        description: `${val} > ${node.value}: Đi xuống nhánh con PHẢI.`,
        codeLine: 8,
      });
      node.right = insertAVL(node.right, val);
    } else {
      return node; // Duplicate
    }

    // Update height
    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
    const bf = getBalanceFactor(node);
    node.balanceFactor = bf;

    steps.push({
      tree: cloneTree(layoutTree(root)),
      activeNodeValue: node.value,
      treeAction: "rebalance",
      description: `Kiểm tra cân bằng tại node ${node.value}: Chiều cao h = ${node.height}, Hệ số cân bằng BF = ${bf}.`,
      codeLine: 10,
      extraInfo: { "Node": node.value, "Height": node.height, "Balance Factor": bf },
    });

    // Case 1: Left-Left (LL) -> Single Right Rotation
    if (bf > 1 && val < (node.left?.value ?? 0)) {
      steps.push({
        tree: cloneTree(layoutTree(root)),
        activeNodeValue: node.value,
        unbalancedNodeValue: node.value,
        treeAction: "rebalance",
        rotationType: "LL",
        description: `⚠️ MẤT CÂN BẰNG LEFT-LEFT (LL) tại node ${node.value} (BF = ${bf} > 1). Chuẩn bị Xoay Phải (Right Rotation).`,
        codeLine: 12,
        extraInfo: { "Trường hợp": "Left-Left (LL)", "Biện pháp": "Xoay Phải (Right Rotate)" },
      });
      return rightRotate(node);
    }

    // Case 2: Right-Right (RR) -> Single Left Rotation
    if (bf < -1 && val > (node.right?.value ?? 0)) {
      steps.push({
        tree: cloneTree(layoutTree(root)),
        activeNodeValue: node.value,
        unbalancedNodeValue: node.value,
        treeAction: "rebalance",
        rotationType: "RR",
        description: `⚠️ MẤT CÂN BẰNG RIGHT-RIGHT (RR) tại node ${node.value} (BF = ${bf} < -1). Chuẩn bị Xoay Trái (Left Rotation).`,
        codeLine: 18,
        extraInfo: { "Trường hợp": "Right-Right (RR)", "Biện pháp": "Xoay Trái (Left Rotate)" },
      });
      return leftRotate(node);
    }

    // Case 3: Left-Right (LR) -> Left Rotate child, then Right Rotate node
    if (bf > 1 && val > (node.left?.value ?? 0)) {
      steps.push({
        tree: cloneTree(layoutTree(root)),
        activeNodeValue: node.value,
        unbalancedNodeValue: node.value,
        treeAction: "rebalance",
        rotationType: "LR",
        description: `⚠️ MẤT CÂN BẰNG LEFT-RIGHT (LR) tại node ${node.value} (BF = ${bf} > 1). Bước 1: Xoay Trái tại con trái (${node.left?.value}).`,
        codeLine: 24,
        extraInfo: { "Trường hợp": "Left-Right (LR)", "Bước 1": `Xoay Trái tại ${node.left?.value}` },
      });
      node.left = leftRotate(node.left!);

      steps.push({
        tree: cloneTree(layoutTree(root)),
        activeNodeValue: node.value,
        unbalancedNodeValue: node.value,
        treeAction: "rebalance",
        rotationType: "LR",
        description: `Bước 2: Xoay Phải tại node cha ${node.value} để hoàn tất cân bằng kép LR.`,
        codeLine: 26,
        extraInfo: { "Bước 2": `Xoay Phải tại ${node.value}` },
      });
      return rightRotate(node);
    }

    // Case 4: Right-Left (RL) -> Right Rotate child, then Left Rotate node
    if (bf < -1 && val < (node.right?.value ?? 0)) {
      steps.push({
        tree: cloneTree(layoutTree(root)),
        activeNodeValue: node.value,
        unbalancedNodeValue: node.value,
        treeAction: "rebalance",
        rotationType: "RL",
        description: `⚠️ MẤT CÂN BẰNG RIGHT-LEFT (RL) tại node ${node.value} (BF = ${bf} < -1). Bước 1: Xoay Phải tại con phải (${node.right?.value}).`,
        codeLine: 28,
        extraInfo: { "Trường hợp": "Right-Left (RL)", "Bước 1": `Xoay Phải tại ${node.right?.value}` },
      });
      node.right = rightRotate(node.right!);

      steps.push({
        tree: cloneTree(layoutTree(root)),
        activeNodeValue: node.value,
        unbalancedNodeValue: node.value,
        treeAction: "rebalance",
        rotationType: "RL",
        description: `Bước 2: Xoay Trái tại node cha ${node.value} để hoàn tất cân bằng kép RL.`,
        codeLine: 30,
        extraInfo: { "Bước 2": `Xoay Trái tại ${node.value}` },
      });
      return leftRotate(node);
    }

    return node;
  }

  // Insert items one by one
  for (const v of initialValues) {
    root = insertAVL(root, v);
    steps.push({
      tree: cloneTree(layoutTree(root)),
      activeNodeValue: v,
      foundNodeValue: v,
      treeAction: "insert",
      description: `Node ${v} đã được cân bằng hoàn hảo trong Cây AVL.`,
      codeLine: 32,
    });
  }

  steps.push({
    tree: cloneTree(layoutTree(root)),
    description: "Cây AVL hoàn tất quá trình tự cân bằng! Đảm bảo chiều cao luôn là O(log N) cho mọi thao tác.",
    codeLine: 34,
    extraInfo: { "Số lượng node": initialValues.length, "Chiều cao cây": getHeight(root) },
  });

  return steps;
}
