// 선택한 기간 (YYYY-MM-DD). 시작일만 고른 상태에서는 end가 비어 있다
export type DateRange = {
  start?: string;
  end?: string;
};

// 기간 안에서 날짜가 차지하는 위치 (달력에 띠를 이어 그릴 때 사용)
export type DateRangePosition = 'start' | 'middle' | 'end';
