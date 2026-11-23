import { Step } from "../types";

export const DEFAULT_LCS_STR1 = "AGGTAB";
export const DEFAULT_LCS_STR2 = "GXTXAYB";

export function generateLCSSteps(
  str1: string = DEFAULT_LCS_STR1,
  str2: string = DEFAULT_LCS_STR2
): Step[] {
  const steps: Step[] = [];
  const m = str1.length;
  const n = str2.length;

  // Initialize dp table (m+1) x (n+1) with zeros
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  // Step 0: Initial state
  steps.push({
    description: `Khởi tạo thuật toán Chuỗi con chung dài nhất (Longest Common Subsequence - LCS). Xâu 1: "${str1}" (độ dài ${m}), Xâu 2: "${str2}" (độ dài ${n}). Bảng DP có kích thước (${m + 1} × ${n + 1}).`,
    codeLine: 2,
    lcsString1: str1,
    lcsString2: str2,
    lcsTable: dp.map((row) => [...row]),
    extraInfo: {
      "Xâu 1": str1,
      "Xâu 2": str2,
      "Trạng thái": "Khởi tạo bảng DP",
    },
  });

  // Dynamic programming filling
  for (let i = 1; i <= m; i++) {
    const c1 = str1[i - 1];

    for (let j = 1; j <= n; j++) {
      const c2 = str2[j - 1];

      if (c1 === c2) {
        dp[i][j] = dp[i - 1][j - 1] + 1;

        steps.push({
          description: `Tại Xâu 1[${i - 1}]='${c1}' và Xâu 2[${j - 1}]='${c2}':  KÝ TỰ TRÙNG KHỚP! Giá trị tăng thêm 1 từ ô đường chéo: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}.`,
          codeLine: 6,
          lcsString1: str1,
          lcsString2: str2,
          lcsTable: dp.map((row) => [...row]),
          currentLcsCell: [i, j],
          lcsMatchChar: c1,
          extraInfo: {
            "Ký tự trùng": c1,
            "Tọa độ DP": `[${i}, ${j}]`,
            "Giá trị mới": dp[i][j],
          },
        });
      } else {
        const topVal = dp[i - 1][j];
        const leftVal = dp[i][j - 1];
        dp[i][j] = Math.max(topVal, leftVal);

        steps.push({
          description: `Tại Xâu 1[${i - 1}]='${c1}' và Xâu 2[${j - 1}]='${c2}': Không trùng. Lấy giá trị lớn hơn giữa ô trên (${topVal}) và ô trái (${leftVal}): dp[${i}][${j}] = ${dp[i][j]}.`,
          codeLine: 8,
          lcsString1: str1,
          lcsString2: str2,
          lcsTable: dp.map((row) => [...row]),
          currentLcsCell: [i, j],
          extraInfo: {
            "So sánh": `'${c1}' ≠ '${c2}'`,
            "Lấy max(Trên, Trái)": dp[i][j],
          },
        });
      }
    }
  }

  // Backtracking reconstruction phase
  const lcsLength = dp[m][n];
  const backtrackPath: [number, number][] = [];
  let currI = m;
  let currJ = n;
  const lcsChars: string[] = [];

  steps.push({
    description: `Bảng DP đã điền xong! Độ dài LCS tối đa tại dp[${m}][${n}] là ${lcsLength}. Bắt đầu giai đoạn Truy vết ngược (Backtracking) để tìm xâu ký tự cụ thể.`,
    codeLine: 12,
    lcsString1: str1,
    lcsString2: str2,
    lcsTable: dp.map((row) => [...row]),
    currentLcsCell: [m, n],
    lcsBacktrackPath: [],
    extraInfo: {
      "Độ dài cực đại": lcsLength,
      "Giai đoạn": "Truy vết ngược",
    },
  });

  while (currI > 0 && currJ > 0) {
    backtrackPath.push([currI, currJ]);

    if (str1[currI - 1] === str2[currJ - 1]) {
      const matchChar = str1[currI - 1];
      lcsChars.unshift(matchChar);

      steps.push({
        description: `Tại ô [${currI}, ${currJ}]: Ký tự '${matchChar}' TRÙNG KHỚP! Thêm '${matchChar}' vào kết quả LCS. Lùi chéo về ô [${currI - 1}, ${currJ - 1}].`,
        codeLine: 15,
        lcsString1: str1,
        lcsString2: str2,
        lcsTable: dp.map((row) => [...row]),
        currentLcsCell: [currI, currJ],
        lcsBacktrackPath: [...backtrackPath],
        lcsMatchChar: matchChar,
        lcsResult: lcsChars.join(""),
        extraInfo: {
          "Ký tự chọn": matchChar,
          "Chuỗi LCS hiện tại": lcsChars.join(""),
        },
      });

      currI--;
      currJ--;
    } else if (dp[currI - 1][currJ] >= dp[currI][currJ - 1]) {
      steps.push({
        description: `Tại ô [${currI}, ${currJ}]: Ô trên (${dp[currI - 1][currJ]}) lớn hơn hoặc bằng ô trái (${dp[currI][currJ - 1]}). Lùi lên hàng trên [${currI - 1}, ${currJ}].`,
        codeLine: 18,
        lcsString1: str1,
        lcsString2: str2,
        lcsTable: dp.map((row) => [...row]),
        currentLcsCell: [currI, currJ],
        lcsBacktrackPath: [...backtrackPath],
        lcsResult: lcsChars.join(""),
        extraInfo: {
          "Hướng đi": "Lùi lên hàng trên",
        },
      });

      currI--;
    } else {
      steps.push({
        description: `Tại ô [${currI}, ${currJ}]: Ô trái (${dp[currI][currJ - 1]}) lớn hơn ô trên. Lùi sang cột trái [${currI}, ${currJ - 1}].`,
        codeLine: 20,
        lcsString1: str1,
        lcsString2: str2,
        lcsTable: dp.map((row) => [...row]),
        currentLcsCell: [currI, currJ],
        lcsBacktrackPath: [...backtrackPath],
        lcsResult: lcsChars.join(""),
        extraInfo: {
          "Hướng đi": "Lùi sang cột trái",
        },
      });

      currJ--;
    }
  }

  const finalLCS = lcsChars.join("");

  steps.push({
    description: `🎉 HOÀN TẤT THUẬT TOÁN LCS! Chuỗi con chung dài nhất của "${str1}" và "${str2}" là "${finalLCS}" (độ dài: ${finalLCS.length}). Đây chính là nguyên lý so sánh mã nguồn của Git Diff!`,
    codeLine: 22,
    lcsString1: str1,
    lcsString2: str2,
    lcsTable: dp.map((row) => [...row]),
    lcsBacktrackPath: [...backtrackPath],
    lcsResult: finalLCS,
    extraInfo: {
      "Kết quả cuối cùng": finalLCS,
      "Độ dài": finalLCS.length,
      "Độ phức tạp": `O(M × N) = O(${m} × ${n})`,
    },
  });

  return steps;
}
