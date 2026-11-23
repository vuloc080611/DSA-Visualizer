import { Step, TrieNodeData } from "../types";

export const DEFAULT_TRIE_WORDS = ["app", "apple", "apt", "bat", "ball"];

function cloneTrie(node: TrieNodeData): TrieNodeData {
  const childrenClone: Record<string, TrieNodeData> = {};
  for (const [char, child] of Object.entries(node.children)) {
    childrenClone[char] = cloneTrie(child);
  }
  return {
    id: node.id,
    char: node.char,
    isEndOfWord: node.isEndOfWord,
    word: node.word,
    children: childrenClone,
  };
}

function getAllWordsFromNode(node: TrieNodeData): string[] {
  const words: string[] = [];
  if (node.isEndOfWord && node.word) {
    words.push(node.word);
  }
  for (const child of Object.values(node.children)) {
    words.push(...getAllWordsFromNode(child));
  }
  return words;
}

export function generateTrieSteps(words: string[] = DEFAULT_TRIE_WORDS): Step[] {
  const steps: Step[] = [];

  let root: TrieNodeData = {
    id: "root",
    char: "*",
    isEndOfWord: false,
    children: {},
  };

  // Step 0: Initial root
  steps.push({
    description: `Khởi tạo cây Tiền tố (Trie) rỗng với Node gốc Root ('*'). Mỗi cạnh sẽ đại diện cho một ký tự, cho phép tìm kiếm tiền tố siêu nhanh trong O(L).`,
    codeLine: 2,
    trie: cloneTrie(root),
    trieActivePath: ["root"],
    trieAction: "insert",
    extraInfo: {
      "Trạng thái": "Khởi tạo Trie",
      "Tổng số từ cần nạp": words.length,
      "Danh sách từ": words.join(", "),
    },
  });

  // Insert words one by one
  for (const word of words) {
    let currNode = root;
    const currentPath: string[] = ["root"];

    steps.push({
      description: `Bắt đầu chèn từ "${word}" vào Trie. Duyệt lần lượt từng ký tự từ trái sang phải bắt đầu từ Root.`,
      codeLine: 6,
      trie: cloneTrie(root),
      trieActivePath: [...currentPath],
      trieCurrentWord: word,
      trieAction: "insert",
      extraInfo: {
        "Đang chèn": word,
        "Độ dài": word.length,
        "Tại node": "Root",
      },
    });

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const isLast = i === word.length - 1;
      const childId = `${currNode.id}-${char}`;

      if (!currNode.children[char]) {
        // Create new node
        currNode.children[char] = {
          id: childId,
          char,
          isEndOfWord: false,
          children: {},
        };

        currentPath.push(childId);

        steps.push({
          description: `Ký tự '${char}' chưa tồn tại dưới node '${currNode.char}'. Tạo Node mới '${char}' và liên kết cạnh.`,
          codeLine: 8,
          trie: cloneTrie(root),
          trieActivePath: [...currentPath],
          trieCurrentWord: word,
          trieAction: "insert",
          extraInfo: {
            "Đang xét": `'${char}' (vị trí ${i + 1}/${word.length})`,
            "Hành động": `Tạo node mới '${char}'`,
            "Node cha": currNode.char === "*" ? "Root" : currNode.char,
          },
        });
      } else {
        // Re-use existing node
        currentPath.push(currNode.children[char].id);

        steps.push({
          description: `Ký tự '${char}' ĐÃ TỒN TẠI dưới node '${currNode.char}'. Tái sử dụng node có sẵn (tiết kiệm bộ nhớ nhờ chung tiền tố).`,
          codeLine: 9,
          trie: cloneTrie(root),
          trieActivePath: [...currentPath],
          trieCurrentWord: word,
          trieAction: "insert",
          extraInfo: {
            "Đang xét": `'${char}' (vị trí ${i + 1}/${word.length})`,
            "Hành động": "Tái sử dụng tiền tố chung",
            "Node hiện tại": char,
          },
        });
      }

      currNode = currNode.children[char];

      if (isLast) {
        currNode.isEndOfWord = true;
        currNode.word = word;

        steps.push({
          description: `Đã đến ký tự cuối cùng của từ "${word}". Đánh dấu cờ isEndOfWord = true (viền xanh lá) để xác nhận "${word}" là một từ hoàn chỉnh trong từ điển!`,
          codeLine: 12,
          trie: cloneTrie(root),
          trieActivePath: [...currentPath],
          trieCurrentWord: word,
          trieAction: "insert",
          extraInfo: {
            "Từ hoàn thành": word,
            "Cờ kết thúc": "isEndOfWord = true",
          },
        });
      }
    }
  }

  // Demonstration of Autocomplete / Prefix Search: prefix "ap"
  const searchPrefix = "ap";
  let searchNode: TrieNodeData | null = root;
  const searchPath: string[] = ["root"];

  steps.push({
    description: `🔍 MINH HỌA GỢI Ý TÌM KIẾM (AUTOCOMPLETE): Người dùng gõ tiền tố "${searchPrefix}". Trie sẽ truy vết tiền tố và tìm tất cả từ hoàn chỉnh bắt đầu bằng "${searchPrefix}".`,
    codeLine: 15,
    trie: cloneTrie(root),
    trieActivePath: ["root"],
    trieCurrentWord: searchPrefix,
    trieAction: "autocomplete",
    extraInfo: {
      "Tính năng": "Autocomplete Gợi ý tìm kiếm",
      "Tiền tố gõ vào": searchPrefix,
    },
  });

  for (let i = 0; i < searchPrefix.length; i++) {
    const char = searchPrefix[i];
    if (searchNode && searchNode.children[char]) {
      searchNode = searchNode.children[char];
      searchPath.push(searchNode.id);

      steps.push({
        description: `Gõ ký tự '${char}': Đi theo nhánh '${char}' (Node ID: ${searchNode.id}). Tiền tố hiện tại khớp: "${searchPrefix.slice(0, i + 1)}".`,
        codeLine: 17,
        trie: cloneTrie(root),
        trieActivePath: [...searchPath],
        trieCurrentWord: searchPrefix,
        trieAction: "autocomplete",
        extraInfo: {
          "Ký tự": char,
          "Khớp tiền tố": searchPrefix.slice(0, i + 1),
          "Node đang đứng": char,
        },
      });
    } else {
      searchNode = null;
      break;
    }
  }

  if (searchNode) {
    const suggestions = getAllWordsFromNode(searchNode);
    steps.push({
      description: `🎉 Tìm thấy tiền tố "${searchPrefix}"! Từ node '${searchNode.char}', duyệt toàn bộ cây con bên dưới để thu thập danh sách gợi ý: [${suggestions.join(", ")}].`,
      codeLine: 20,
      trie: cloneTrie(root),
      trieActivePath: [...searchPath],
      trieCurrentWord: searchPrefix,
      trieAction: "autocomplete",
      trieSuggestions: suggestions,
      extraInfo: {
        "Tiền tố": searchPrefix,
        "Số từ gợi ý": suggestions.length,
        "Danh sách gợi ý": suggestions.join(", "),
      },
    });
  }

  return steps;
}
