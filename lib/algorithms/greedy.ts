import { Step, IntervalActivity } from "../types";

export const DEFAULT_ACTIVITIES: IntervalActivity[] = [
  { id: "act-1", name: "A1: Hội thảo Kỹ thuật", start: 1, end: 4, status: "normal" },
  { id: "act-2", name: "A2: Khóa đào tạo Dev", start: 3, end: 5, status: "normal" },
  { id: "act-3", name: "A3: Họp tổng kết ban", start: 0, end: 6, status: "normal" },
  { id: "act-4", name: "A4: Phỏng vấn ứng viên", start: 5, end: 7, status: "normal" },
  { id: "act-5", name: "A5: Thuyết trình đồ án", start: 3, end: 9, status: "normal" },
  { id: "act-6", name: "A6: Seminar Trí tuệ AI", start: 5, end: 9, status: "normal" },
  { id: "act-7", name: "A7: Workshop Cloud", start: 6, end: 10, status: "normal" },
  { id: "act-8", name: "A8: Thảo luận kiến trúc", start: 8, end: 11, status: "normal" },
  { id: "act-9", name: "A9: Lễ ký kết đối tác", start: 8, end: 12, status: "normal" },
  { id: "act-10", name: "A10: Sự kiện toàn thể", start: 2, end: 14, status: "normal" },
  { id: "act-11", name: "A11: Họp ban điều hành", start: 12, end: 15, status: "normal" },
];

export function generateIntervalSchedulingSteps(initialActivities?: IntervalActivity[]): Step[] {
  const steps: Step[] = [];
  const rawList = initialActivities && initialActivities.length > 0 ? [...initialActivities] : [...DEFAULT_ACTIVITIES];

  // Deep clone helper
  const cloneIntervals = (list: IntervalActivity[]): IntervalActivity[] =>
    list.map((item) => ({ ...item }));

  // Step 1: Initial state
  steps.push({
    intervals: cloneIntervals(rawList),
    selectedIntervalsCount: 0,
    description: `Khởi tạo bài toán Chọn lịch hoạt động (Interval Scheduling) với ${rawList.length} sự kiện chưa sắp xếp. Mục tiêu: Chọn được số sự kiện tối đa mà không bị trùng giờ.`,
    codeLine: 1,
  });

  // Step 2: Sort by finish time
  const sortedList = [...rawList].sort((a, b) => a.end - b.end);
  steps.push({
    intervals: cloneIntervals(sortedList),
    selectedIntervalsCount: 0,
    description: `Chiến lược Tham lam (Greedy Choice): Sắp xếp toàn bộ các sự kiện theo giờ kết thúc (end time) tăng dần. Sự kiện kết thúc càng sớm sẽ để lại nhiều thời gian trống nhất cho tương lai!`,
    codeLine: 2,
  });

  // Step 3: Pick the first activity
  const intervalsState = cloneIntervals(sortedList);
  intervalsState[0].status = "selected";
  let lastEndTime = intervalsState[0].end;
  let selectedCount = 1;

  steps.push({
    intervals: cloneIntervals(intervalsState),
    selectedIntervalsCount: selectedCount,
    currentIntervalId: intervalsState[0].id,
    lastEndTime: lastEndTime,
    description: `Tham lam chọn sự kiện đầu tiên '${intervalsState[0].name}' (kết thúc sớm nhất lúc ${intervalsState[0].end}h). Cập nhật mốc thời gian bận đến: ${lastEndTime}h.`,
    codeLine: 3,
  });

  // Step 4 to N: Inspect remaining activities
  for (let i = 1; i < intervalsState.length; i++) {
    const act = intervalsState[i];

    // Inspecting step
    intervalsState[i].status = "inspecting";
    steps.push({
      intervals: cloneIntervals(intervalsState),
      selectedIntervalsCount: selectedCount,
      currentIntervalId: act.id,
      lastEndTime: lastEndTime,
      description: `Đang xét sự kiện '${act.name}' [${act.start}h → ${act.end}h]. So sánh giờ bắt đầu (${act.start}h) với mốc phòng trống (${lastEndTime}h).`,
      codeLine: 4,
    });

    if (act.start >= lastEndTime) {
      // Non-overlapping -> Pick
      intervalsState[i].status = "selected";
      lastEndTime = act.end;
      selectedCount++;
      steps.push({
        intervals: cloneIntervals(intervalsState),
        selectedIntervalsCount: selectedCount,
        currentIntervalId: act.id,
        lastEndTime: lastEndTime,
        description: `Thỏa mãn (${act.start}h >= ${act.end - (act.end - act.start)}h >= ${lastEndTime}h)! Phòng đã trống. Tham lam chọn '${act.name}'! Mốc phòng bận mới: ${lastEndTime}h.`,
        codeLine: 5,
      });
    } else {
      // Overlapping -> Reject
      intervalsState[i].status = "overlapping";
      steps.push({
        intervals: cloneIntervals(intervalsState),
        selectedIntervalsCount: selectedCount,
        currentIntervalId: act.id,
        lastEndTime: lastEndTime,
        description: `Xung đột (${act.start}h < ${lastEndTime}h)! Sự kiện '${act.name}' bắt đầu khi phòng họp vẫn đang bận. Bỏ qua sự kiện này.`,
        codeLine: 6,
      });
    }
  }

  // Final summary step
  steps.push({
    intervals: cloneIntervals(intervalsState),
    selectedIntervalsCount: selectedCount,
    lastEndTime: lastEndTime,
    description: `Thuật toán Tham lam hoàn tất! Đã chọn được ${selectedCount} sự kiện tối đa mà không bị trùng lịch (Độ phức tạp O(N log N) cho sắp xếp + O(N) cho duyệt tham lam).`,
    codeLine: 7,
  });

  return steps;
}
