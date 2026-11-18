import WeekSchedule from '../../_components/week-schedule/WeekSchedule';

// 근로신청 시간표. 근로시간 관리와 같은 주간 시간표를 근로신청 관리 아래 주소로 띄운다
// (주소가 근로신청 관리 아래라 사이드바도 근로신청 관리가 켜진다)
export default function WorkApplicationsTimetablePage() {
  return <WeekSchedule variant='application' />;
}
