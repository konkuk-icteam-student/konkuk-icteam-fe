import { StateChip } from '@konkuk-icteam-fe/design-system/ui';
import { formatMonthDayWithWeekday, formatYearMonth } from '@/shared/utils/formatDate';
import { convertDateToTime } from '@/shared/utils/time';
import type { WorkerDetail } from '../../../_apis/workers';
import { EMPTY_STUDENT_TEXT } from '../../_constants/student';
import { useMonthlyAttendance } from '../../_hooks/useMonthlyAttendance';
import StatCard from './StatCard';

type InfoItemProps = {
  label: string;
  value: string;
};

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className='flex flex-1 flex-col gap-[0.4rem]'>
    <dt className='caption-14-md text-gray-400'>{label}</dt>
    <dd className='font-16-bd text-black'>{value}</dd>
  </div>
);

type BasicInfoTabProps = {
  // 오늘 기준으로 받은 상세 정보. 수정 요청 횟수는 이번 달 값이다
  student: WorkerDetail;
};

// 상세보기 기본 정보 탭. 연락처, 이번 달 근태 요약과 지각 기록 (계정은 상세보기가 이 아래에 붙인다).
// 지각·결근과 지각 기록은 상세 API에 없어서 근무 구간으로 계산한다
export default function BasicInfoTab({ student }: BasicInfoTabProps) {
  const { summary, lateRecords } = useMonthlyAttendance(student.userId);
  const { totalChangeRequestCount, approvedChangeRequestCount } = student;

  return (
    <>
      <dl className='flex gap-[2.8rem] rounded-[1.2rem] border border-gray-50 px-[1.8rem] py-[1.6rem]'>
        <InfoItem label='연락처' value={student.phoneNumber ?? EMPTY_STUDENT_TEXT} />
        <InfoItem label='근로 시작' value={formatYearMonth(student.workStartDate)} />
      </dl>

      <section className='flex flex-col gap-[1.2rem]'>
        <h3 className='font-16-bd text-black'>근태 요약</h3>
        <dl className='flex gap-[1.2rem]'>
          <StatCard
            label='지각'
            value={`${summary.lateCount}회`}
            caption={`총 ${summary.lateMinutes}분`}
          />
          <StatCard label='결근' value={`${summary.absentCount}회`} caption={EMPTY_STUDENT_TEXT} />
        </dl>
        <dl className='flex items-center justify-between rounded-[1.2rem] bg-gray-50 px-[1.6rem] py-[1.4rem]'>
          <dt className='caption-12-md text-gray-500'>수정 요청 횟수</dt>
          <dd className='flex items-center gap-[0.4rem]'>
            <span className='caption-14-bd text-black'>{`총 ${totalChangeRequestCount}회`}</span>
            <span className='caption-12-rg text-gray-400'>{`(승인 ${approvedChangeRequestCount}회)`}</span>
          </dd>
        </dl>
      </section>

      <section className='flex flex-col gap-[0.8rem]'>
        <div className='flex items-center justify-between'>
          <h3 className='font-16-bd text-black'>지각 기록</h3>
          <span className='caption-12-md text-gray-400'>이번 달</span>
        </div>
        {lateRecords.length === 0 ? (
          <p className='caption-14-rg rounded-[1.2rem] border border-gray-50 py-[1.6rem] text-center text-gray-400'>
            이번 달 지각 기록이 없어요.
          </p>
        ) : (
          <ul className='flex flex-col rounded-[1.2rem] border border-gray-50 px-[1.6rem] py-[0.4rem]'>
            {lateRecords.map(({ date, start, checkedInAt, lateMinutes }) => (
              <li
                key={`${date.getTime()}-${start}`}
                className='flex items-center gap-[1.2rem] py-[1rem]'
              >
                <span className='caption-14-md w-[9.6rem] shrink-0 text-black'>
                  {formatMonthDayWithWeekday(date)}
                </span>
                <span className='caption-14-rg min-w-0 flex-1 text-gray-700'>
                  {`근무 시작 ${start} · ${convertDateToTime(checkedInAt)} 출근`}
                </span>
                <StateChip label={`${lateMinutes}분 지각`} tone='purple' />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
