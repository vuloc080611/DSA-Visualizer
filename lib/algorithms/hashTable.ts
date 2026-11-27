import { Step, HashBucket } from "../types";

export const DEFAULT_HASH_TABLE_SIZE = 7;
export const DEFAULT_HASH_KEYS = [12, 26, 42, 19, 31, 5, 20];

export function generateHashTableSteps(keys?: number[], tableSize: number = DEFAULT_HASH_TABLE_SIZE): Step[] {
  const steps: Step[] = [];
  const inputKeys = keys && keys.length > 0 ? keys : DEFAULT_HASH_KEYS;

  // Initialize empty buckets
  let buckets: HashBucket[] = Array.from({ length: tableSize }, (_, i) => ({
    index: i,
    items: [],
    status: "idle",
  }));

  const cloneBuckets = (list: HashBucket[]): HashBucket[] =>
    list.map((b) => ({ ...b, items: [...b.items] }));

  // Step 1: Initial state
  steps.push({
    hashBuckets: cloneBuckets(buckets),
    description: `Khởi tạo Bảng Băm (Hash Table) với kích thước M = ${tableSize} ô nhớ (buckets từ 0 đến ${tableSize - 1}). Hàm băm cơ bản: hash(key) = key mod ${tableSize}.`,
    codeLine: 1,
  });

  // Step 2 to N: Insert each key
  for (const key of inputKeys) {
    const bucketIndex = key % tableSize;

    // Reset statuses
    buckets.forEach((b) => (b.status = "idle"));

    // Step: Compute hash
    buckets[bucketIndex].status = "inserting";
    steps.push({
      hashBuckets: cloneBuckets(buckets),
      currentHashKey: key,
      computedHashIndex: bucketIndex,
      description: `Tính toán hàm băm cho khóa key = ${key}: hash(${key}) = ${key} mod ${tableSize} = ${bucketIndex}. Định vị ô bucket [${bucketIndex}].`,
      codeLine: 2,
    });

    const isCollision = buckets[bucketIndex].items.length > 0;

    if (isCollision) {
      // Step: Collision detected!
      buckets[bucketIndex].status = "collided";
      const existingItems = buckets[bucketIndex].items.map((it) => it.key).join(", ");
      steps.push({
        hashBuckets: cloneBuckets(buckets),
        currentHashKey: key,
        computedHashIndex: bucketIndex,
        hashCollisionDetected: true,
        description: `Xung đột băm (Hash Collision)! Ô bucket [${bucketIndex}] đã chứa phần tử (${existingItems}). Áp dụng kỹ thuật Chaining (Nối chuỗi danh sách liên kết).`,
        codeLine: 3,
      });

      // Append item to linked chain
      buckets[bucketIndex].items.push({ key, label: `k=${key}` });
      steps.push({
        hashBuckets: cloneBuckets(buckets),
        currentHashKey: key,
        computedHashIndex: bucketIndex,
        hashCollisionDetected: true,
        description: `Chèn khóa ${key} vào cuối danh sách liên kết tại bucket [${bucketIndex}]. Chuỗi hiện tại: ${buckets[bucketIndex].items.map((it) => it.key).join(" → ")}.`,
        codeLine: 4,
      });
    } else {
      // No collision -> Direct insert
      buckets[bucketIndex].items.push({ key, label: `k=${key}` });
      steps.push({
        hashBuckets: cloneBuckets(buckets),
        currentHashKey: key,
        computedHashIndex: bucketIndex,
        hashCollisionDetected: false,
        description: `Ô bucket [${bucketIndex}] đang trống. Chèn trực tiếp khóa ${key} với thời gian O(1) tức thì!`,
        codeLine: 4,
      });
    }
  }

  // Final Step: Search demonstration
  const searchTarget = 19;
  const targetIndex = searchTarget % tableSize;
  buckets.forEach((b) => (b.status = b.index === targetIndex ? "matched" : "idle"));

  steps.push({
    hashBuckets: cloneBuckets(buckets),
    currentHashKey: searchTarget,
    computedHashIndex: targetIndex,
    description: `Thao tác Tìm kiếm (Search) khóa target = ${searchTarget}: Tính hash(${searchTarget}) = ${targetIndex}, nhảy thẳng đến bucket [${targetIndex}] trong O(1) và duyệt qua danh sách liên kết để tìm thấy ${searchTarget}!`,
    codeLine: 5,
  });

  return steps;
}
