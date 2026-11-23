import { Step } from "../types";

export const DEFAULT_KMP_TEXT = "ABABDABACDABABCABAB";
export const DEFAULT_KMP_PATTERN = "ABABCABAB";

export function computeLPSArray(pattern: string): number[] {
  const lps = Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;

  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  return lps;
}

export function generateKMPSteps(
  text: string = DEFAULT_KMP_TEXT,
  pattern: string = DEFAULT_KMP_PATTERN
): Step[] {
  const steps: Step[] = [];
  const n = text.length;
  const m = pattern.length;

  // Compute LPS array step-by-step
  const lps: number[] = Array(m).fill(0);

  steps.push({
    description: `Khởi tạo thuật toán KMP (Knuth-Morris-Pratt). Văn bản (Text): "${text}" (N=${n}), Mẫu tìm kiếm (Pattern): "${pattern}" (M=${m}). Bước 1 là xây dựng bảng tiền tố LPS (Longest Prefix Suffix).`,
    codeLine: 2,
    kmpText: text,
    kmpPattern: pattern,
    kmpLps: [...lps],
    kmpState: "comparing",
    extraInfo: {
      "Độ dài Text": n,
      "Độ dài Pattern": m,
      "Giai đoạn": "Tính toán mảng LPS",
    },
  });

  // Calculate LPS table
  let len = 0;
  let pIdx = 1;

  while (pIdx < m) {
    if (pattern[pIdx] === pattern[len]) {
      len++;
      lps[pIdx] = len;

      steps.push({
        description: `Bảng LPS: Pattern[${pIdx}]='${pattern[pIdx]}' TRÙNG Pattern[${len - 1}]='${pattern[len - 1]}'. Tiền tố và Hậu tố dài nhất khớp tăng lên ${len}. Đặt lps[${pIdx}] = ${len}.`,
        codeLine: 6,
        kmpText: text,
        kmpPattern: pattern,
        kmpLps: [...lps],
        kmpPatternIndex: pIdx,
        kmpState: "match",
        extraInfo: {
          "Ký tự xét": pattern[pIdx],
          "Vị trí": pIdx,
          "Giá trị LPS": len,
        },
      });

      pIdx++;
    } else {
      if (len !== 0) {
        const prevLen = len;
        len = lps[len - 1];

        steps.push({
          description: `Bảng LPS: Pattern[${pIdx}]='${pattern[pIdx]}' KHÔNG KHỚP Pattern[${prevLen}]. Nhảy lùi độ dài tiền tố về lps[${prevLen - 1}] = ${len}.`,
          codeLine: 8,
          kmpText: text,
          kmpPattern: pattern,
          kmpLps: [...lps],
          kmpPatternIndex: pIdx,
          kmpState: "lps-jump",
          extraInfo: {
            "Ký tự xét": pattern[pIdx],
            "Lùi độ dài về": len,
          },
        });
      } else {
        lps[pIdx] = 0;

        steps.push({
          description: `Bảng LPS: Không có tiền tố nào khớp với hậu tố kết thúc tại '${pattern[pIdx]}'. Đặt lps[${pIdx}] = 0.`,
          codeLine: 10,
          kmpText: text,
          kmpPattern: pattern,
          kmpLps: [...lps],
          kmpPatternIndex: pIdx,
          kmpState: "mismatch",
          extraInfo: {
            "Ký tự xét": pattern[pIdx],
            "Giá trị LPS": 0,
          },
        });

        pIdx++;
      }
    }
  }

  steps.push({
    description: `Bảng LPS hoàn thành: [${lps.join(", ")}]. Bắt đầu quét tìm kiếm Pattern trong Text. Con trỏ Text i và con trỏ Pattern j bắt đầu từ 0.`,
    codeLine: 12,
    kmpText: text,
    kmpPattern: pattern,
    kmpLps: [...lps],
    kmpTextIndex: 0,
    kmpPatternIndex: 0,
    kmpState: "comparing",
    extraInfo: {
      "Mảng LPS": `[${lps.join(", ")}]`,
      "Trạng thái": "Bắt đầu so khớp Text & Pattern",
    },
  });

  // Search phase
  let i = 0;
  let j = 0;
  const matches: number[] = [];

  while (i < n) {
    if (pattern[j] === text[i]) {
      steps.push({
        description: `So khớp tại Text[${i}]='${text[i]}' và Pattern[${j}]='${pattern[j]}':  KHỚP! Cả hai con trỏ cùng tiến 1 bước.`,
        codeLine: 15,
        kmpText: text,
        kmpPattern: pattern,
        kmpLps: [...lps],
        kmpTextIndex: i,
        kmpPatternIndex: j,
        kmpMatchedIndices: [...matches],
        kmpState: "match",
        extraInfo: {
          "Text index (i)": i,
          "Pattern index (j)": j,
          "Ký tự khớp": text[i],
        },
      });

      i++;
      j++;

      if (j === m) {
        const foundIdx = i - j;
        matches.push(foundIdx);

        steps.push({
          description: `🎉 TÌM THẤY MẪU KHỚP HOÀN TOÀN TẠI VỊ TRÍ INDEX ${foundIdx}! (Đoạn Text: "${text.slice(foundIdx, foundIdx + m)}"). Dùng LPS để trượt tiếp: j = lps[${j - 1}] = ${lps[j - 1]}.`,
          codeLine: 18,
          kmpText: text,
          kmpPattern: pattern,
          kmpLps: [...lps],
          kmpTextIndex: i - 1,
          kmpPatternIndex: j - 1,
          kmpMatchedIndices: [...matches],
          kmpState: "found",
          extraInfo: {
            "Tìm thấy tại index": foundIdx,
            "Đoạn khớp": text.slice(foundIdx, foundIdx + m),
            "Số lần tìm thấy": matches.length,
          },
        });

        j = lps[j - 1];
      }
    } else {
      steps.push({
        description: `❌ LỆCH KÝ TỰ tại Text[${i}]='${text[i]}' và Pattern[${j}]='${pattern[j]}'.`,
        codeLine: 20,
        kmpText: text,
        kmpPattern: pattern,
        kmpLps: [...lps],
        kmpTextIndex: i,
        kmpPatternIndex: j,
        kmpMatchedIndices: [...matches],
        kmpState: "mismatch",
        extraInfo: {
          "Lệch tại": `Text[${i}]='${text[i]}' vs Pattern[${j}]='${pattern[j]}'`,
        },
      });

      if (j !== 0) {
        const oldJ = j;
        j = lps[j - 1];

        steps.push({
          description: `⚡ KMP SMART SLIDE (Nhảy cóc): Thay vì lùi i về ${i - oldJ + 1} như thuật toán ngây thơ (Brute Force), KMP giữ nguyên i=${i} và nhảy j về lps[${oldJ - 1}] = ${j} (bỏ qua ${oldJ - j} ký tự đã biết trùng khớp)!`,
          codeLine: 22,
          kmpText: text,
          kmpPattern: pattern,
          kmpLps: [...lps],
          kmpTextIndex: i,
          kmpPatternIndex: j,
          kmpMatchedIndices: [...matches],
          kmpState: "lps-jump",
          extraInfo: {
            "Giữ nguyên con trỏ Text i": i,
            "Nhảy con trỏ Pattern j về": j,
            "Số bước tiết kiệm": oldJ - j,
          },
        });
      } else {
        steps.push({
          description: `j = 0 và ký tự không khớp: Tiến con trỏ Text i sang ký tự tiếp theo (${i + 1}).`,
          codeLine: 24,
          kmpText: text,
          kmpPattern: pattern,
          kmpLps: [...lps],
          kmpTextIndex: i,
          kmpPatternIndex: 0,
          kmpMatchedIndices: [...matches],
          kmpState: "mismatch",
          extraInfo: {
            "Tăng Text i": `${i} ➔ ${i + 1}`,
          },
        });

        i++;
      }
    }
  }

  // Completion step
  steps.push({
    description: `🎉 HOÀN TẤT THUẬT TOÁN KMP! Tổng số lần tìm thấy mẫu "${pattern}": ${matches.length} lần tại các vị trí [${matches.join(", ")}]. Độ phức tạp thời gian đạt tuyến tính O(N + M).`,
    codeLine: 26,
    kmpText: text,
    kmpPattern: pattern,
    kmpLps: [...lps],
    kmpMatchedIndices: [...matches],
    kmpState: "found",
    extraInfo: {
      "Kết quả": `Tìm thấy ${matches.length} vị trí`,
      "Vị trí bắt đầu": matches.length > 0 ? matches.join(", ") : "Không có",
      "Độ phức tạp": `O(N + M) = O(${n} + ${m})`,
    },
  });

  return steps;
}
