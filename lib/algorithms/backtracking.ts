import { Step } from "../types";

export const DEFAULT_N_QUEENS_SIZE = 4;

export function generateNQueensSteps(n: number = DEFAULT_N_QUEENS_SIZE): Step[] {
  const steps: Step[] = [];
  const board: number[] = Array(n).fill(-1); // board[row] = col of queen, or -1
  let backtrackCount = 0;
  let solutionsFound = 0;

  // Step 0: Initial state
  steps.push({
    description: `Khởi tạo bàn cờ kích thước ${n} × ${n}. Mục tiêu là đặt ${n} quân Hậu sao cho không có 2 quân Hậu nào tấn công nhau (không cùng hàng, cùng cột hay đường chéo).`,
    codeLine: 1,
    nQueensBoard: [...board],
    boardSize: n,
    isBacktracking: false,
    backtrackCount: 0,
    isSolution: false,
    solutionCount: 0,
    extraInfo: {
      "Kích thước bàn cờ": `${n} × ${n}`,
      "Số quân Hậu cần đặt": n,
      "Số lần quay lui": 0,
      "Trạng thái": "Sẵn sàng",
    },
  });

  // Check if placing Queen at (row, col) is safe against existing queens
  function getConflicts(row: number, col: number): [number, number][] {
    const conflicts: [number, number][] = [];
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === -1) continue;

      // Same column
      if (c === col) {
        conflicts.push([r, c]);
      }
      // Diagonal attack: |r - row| === |c - col|
      else if (Math.abs(r - row) === Math.abs(c - col)) {
        conflicts.push([r, c]);
      }
    }
    return conflicts;
  }

  function solve(row: number): boolean {
    if (row === n) {
      // Found a valid solution!
      solutionsFound++;
      steps.push({
        description: `🎉 TÌM THẤY LỜI GIẢI HỢP LỆ! Cả ${n} quân Hậu đã được xếp an toàn trên bàn cờ mà không có bất kỳ xung đột nào.`,
        codeLine: 15,
        nQueensBoard: [...board],
        boardSize: n,
        isBacktracking: false,
        backtrackCount,
        isSolution: true,
        solutionCount: solutionsFound,
        extraInfo: {
          "Trạng thái": "Thành công!",
          "Vị trí các quân Hậu": board.map((c, r) => `Hàng ${r}: Cột ${c}`).join(", "),
          "Tổng lần quay lui": backtrackCount,
        },
      });
      return true; // Stop at first solution for clear visualization
    }

    for (let col = 0; col < n; col++) {
      const conflicts = getConflicts(row, col);

      if (conflicts.length > 0) {
        // Cell is under attack
        const [confRow, confCol] = conflicts[0];
        const reason =
          confCol === col
            ? `cùng cột ${col}`
            : `đường chéo với quân Hậu tại [${confRow}, ${confCol}]`;

        steps.push({
          description: `Thử đặt Hậu tại hàng ${row}, cột ${col}: ❌ XUNG ĐỘT! Bị quân Hậu tại hàng ${confRow} chiếu (${reason}).`,
          codeLine: 6,
          nQueensBoard: [...board],
          boardSize: n,
          currentQueen: [row, col],
          queenConflicts: conflicts,
          isBacktracking: false,
          backtrackCount,
          isSolution: false,
          solutionCount: solutionsFound,
          extraInfo: {
            "Đang thử ô": `[${row}, ${col}]`,
            "Xung đột với": `[${confRow}, ${confCol}]`,
            "Số quân trên bàn": board.filter((c) => c !== -1).length,
          },
        });
      } else {
        // Safe to place!
        board[row] = col;
        steps.push({
          description: `Thử đặt Hậu tại hàng ${row}, cột ${col}:  AN TOÀN! Không có quân Hậu nào khống chế ô này. Đặt quân Hậu và tiến tới hàng ${row + 1}.`,
          codeLine: 8,
          nQueensBoard: [...board],
          boardSize: n,
          currentQueen: [row, col],
          queenConflicts: [],
          isBacktracking: false,
          backtrackCount,
          isSolution: false,
          solutionCount: solutionsFound,
          extraInfo: {
            "Vừa đặt": `Hàng ${row}, Cột ${col}`,
            "Số quân trên bàn": board.filter((c) => c !== -1).length,
            "Tiến vào hàng": row + 1 < n ? row + 1 : "Hoàn tất",
          },
        });

        const found = solve(row + 1);
        if (found) return true;

        // Backtrack
        backtrackCount++;
        const prevCol = board[row];
        board[row] = -1;

        steps.push({
          description: `↩️ QUAY LUI (Backtracking): Nhánh tìm kiếm phía dưới hàng ${row} đi vào ngõ cụt (không có ô hợp lệ). Rút lại quân Hậu tại hàng ${row}, cột ${prevCol} để thử cột tiếp theo.`,
          codeLine: 12,
          nQueensBoard: [...board],
          boardSize: n,
          currentQueen: [row, prevCol],
          queenConflicts: [],
          isBacktracking: true,
          backtrackCount,
          isSolution: false,
          solutionCount: solutionsFound,
          extraInfo: {
            "Hành động": "Quay lui (Backtrack)",
            "Gỡ quân tại": `[${row}, ${prevCol}]`,
            "Tổng lần quay lui": backtrackCount,
          },
        });
      }
    }

    return false;
  }

  solve(0);
  return steps;
}
