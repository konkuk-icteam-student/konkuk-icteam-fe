import WorktimePageClient from '../../worktime/page.client';

// 근로신청 시간표. 근로시간 관리와 같은 시간표를 신청 받는 달만 보이게 띄운다
// (주소가 근로신청 관리 아래라 사이드바도 근로신청 관리가 켜진다)
export default function WorkApplicationsTimetablePage() {
  return <WorktimePageClient variant='application' />;
}
