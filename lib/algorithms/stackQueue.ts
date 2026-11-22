import { Step } from "../types";

export const DEFAULT_PARENTHESES_STRING = "{ [ ( ) ] }";

export function generateValidParenthesesSteps(input: string = DEFAULT_PARENTHESES_STRING): Step[] {
  const steps: Step[] = [];
  const cleanInput = input.replace(/\s+/g, "");
  if (!cleanInput) return steps;

  const stack: { id: string; value: string; status?: "push" | "pop" | "matched" | "unmatched" | "normal" }[] = [];
  const matchingPairs: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  // Initial step
  steps.push({
    description: `Khởi tạo thuật toán Kiểm tra ngoặc hợp lệ: Chuỗi đầu vào là "${cleanInput}". Ngăn xếp (Stack) hiện đang rỗng. Bắt đầu quét từ trái qua phải.`,
    codeLine: 1,
    inputString: cleanInput,
    charIndex: -1,
    stackItems: [],
  });

  let isValid = true;

  for (let i = 0; i < cleanInput.length; i++) {
    const char = cleanInput[i];

    // If opening bracket: Push into stack
    if (char === "(" || char === "[" || char === "{") {
      const newItem = { id: `item-${i}`, value: char, status: "push" as const };
      stack.push(newItem);

      steps.push({
        description: `[Ký tự ${i + 1}/${cleanInput.length}: '${char}'] Là dấu mở ngoặc. Đẩy (PUSH) '${char}' vào đỉnh ngăn xếp Stack.`,
        codeLine: 5,
        inputString: cleanInput,
        charIndex: i,
        stackItems: stack.map((item) => ({ ...item, status: item.id === newItem.id ? "push" : "normal" })),
      });
    } else if (char === ")" || char === "]" || char === "}") {
      // Closing bracket: Check top of stack
      const expectedOpen = matchingPairs[char];

      if (stack.length === 0) {
        isValid = false;
        steps.push({
          description: `❌ LỖI KHÔNG HỢP LỆ! Gặp dấu đóng ngoặc '${char}' nhưng ngăn xếp Stack đang rỗng (không có dấu mở ngoặc tương ứng).`,
          codeLine: 9,
          inputString: cleanInput,
          charIndex: i,
          stackItems: [],
        });
        break;
      }

      const topItem = stack[stack.length - 1];

      if (topItem.value === expectedOpen) {
        // Matched! Pop from stack
        const popped = stack.pop()!;
        steps.push({
          description: `✅ KHỚP CẶP NGOẶC! Dấu đóng '${char}' khớp hoàn hảo với dấu mở '${popped.value}' ở đỉnh Stack. Lấy (POP) '${popped.value}' ra khỏi ngăn xếp!`,
          codeLine: 12,
          inputString: cleanInput,
          charIndex: i,
          stackItems: [
            ...stack.map((item) => ({ ...item, status: "normal" as const })),
            { ...popped, status: "matched" as const },
          ],
        });
      } else {
        // Mismatched
        isValid = false;
        steps.push({
          description: `❌ LỖI SAI KHỚP NGOẶC! Dấu đóng '${char}' không khớp với dấu mở '${topItem.value}' ở đỉnh Stack (Cần '${expectedOpen}' nhưng lại thấy '${topItem.value}').`,
          codeLine: 15,
          inputString: cleanInput,
          charIndex: i,
          stackItems: stack.map((item, idx) => ({
            ...item,
            status: idx === stack.length - 1 ? "unmatched" : "normal",
          })),
        });
        break;
      }
    }
  }

  // Final validation
  if (isValid) {
    if (stack.length === 0) {
      steps.push({
        description: `🎉 CHUỖI NGOẶC HỢP LỆ (VALID)! Đã duyệt hết chuỗi và ngăn xếp Stack hoàn toàn rỗng. Tất cả các cặp ngoặc đều đã đóng đúng thứ tự LIFO!`,
        codeLine: 18,
        inputString: cleanInput,
        charIndex: cleanInput.length,
        stackItems: [],
      });
    } else {
      steps.push({
        description: `❌ LỖI CÒN NGOẶC CHƯA ĐÓNG! Đã duyệt hết chuỗi nhưng trong Stack vẫn còn ${stack.length} dấu mở ngoặc chưa được đóng lại.`,
        codeLine: 20,
        inputString: cleanInput,
        charIndex: cleanInput.length,
        stackItems: stack.map((item) => ({ ...item, status: "unmatched" as const })),
      });
    }
  }

  return steps;
}
