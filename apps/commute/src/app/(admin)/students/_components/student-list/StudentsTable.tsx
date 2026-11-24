import { IconArrowRight } from '@konkuk-icteam-fe/design-system/assets';
import { formatYearMonth } from '@/shared/utils/formatDate';
import type { WorkerListItem } from '../../../_apis/workers';
import { EMPTY_STUDENT_TEXT } from '../../_constants/student';
import { formatGrade, formatWorkedOverLimit } from '../../_utils/studentFormat';
import { checkMonthWorker } from '../../_utils/workRecord';

type Column = {
  label: string;
  className: string;
  render: (student: WorkerListItem) => React.ReactNode;
};

const PROFILE_COLUMNS: Column[] = [
  { label: '성명', className: 'w-[8.6rem]', render: ({ name }) => name },
  {
    label: '학번',
    className: 'w-[11.1rem]',
    render: ({ studentId }) => studentId ?? EMPTY_STUDENT_TEXT,
  },
  {
    label: '학과',
    className: 'w-[14.7rem]',
    render: ({ department }) => department ?? EMPTY_STUDENT_TEXT,
  },
  { label: '학년', className: 'w-[6.4rem]', render: ({ grade }) => formatGrade(grade) },
  {
    label: '연락처',
    className: 'w-[12.4rem]',
    render: ({ phoneNumber }) => phoneNumber ?? EMPTY_STUDENT_TEXT,
  },
  {
    label: '근로 시작',
    className: 'w-[9rem]',
    render: ({ workStartDate }) => formatYearMonth(workStartDate),
  },
];

const RECORD_COLUMNS: Column[] = [
  {
    label: '이번달 누적 근로시간',
    className: 'w-[15rem]',
    render: ({ monthlyWorkedMinutes, monthlyLimitMinutes }) =>
      formatWorkedOverLimit(monthlyWorkedMinutes, monthlyLimitMinutes),
  },
  {
    label: '지각 횟수 (시간)',
    className: 'w-[11.8rem]',
    render: (student) =>
      checkMonthWorker(student)
        ? `${student.lateCount}회 (${student.lateMinutes}분)`
        : EMPTY_STUDENT_TEXT,
  },
  {
    label: '수정요청',
    className: 'w-[14.5rem]',
    render: (student) =>
      checkMonthWorker(student)
        ? `총 ${student.totalChangeRequestCount}건 (승인 ${student.approvedChangeRequestCount}건)`
        : EMPTY_STUDENT_TEXT,
  },
];

const COLUMNS = [...PROFILE_COLUMNS, ...RECORD_COLUMNS];
// 번호·상세보기 열까지 더한 수
const COLUMN_COUNT = COLUMNS.length + 2;

const CELL_CLASS_NAME = 'h-[4.8rem] px-[1.2rem] whitespace-nowrap';

type StudentsTableProps = {
  students: WorkerListItem[];
  // 현재 페이지의 첫 줄 앞까지 센 인원 수. 여기에 이어서 순번을 매긴다
  startNumber: number;
  onDetailOpen: (userId: number) => void;
};

export default function StudentsTable({ students, startNumber, onDetailOpen }: StudentsTableProps) {
  return (
    <div className='w-full overflow-x-auto'>
      <table className='caption-12-rg w-full table-fixed border-collapse text-left'>
        <thead>
          <tr className='border-b-2 border-gray-50'>
            <th scope='col' className='caption-12-md h-[4rem] w-[5rem] px-[1.2rem] text-center'>
              번호
            </th>
            {COLUMNS.map(({ label, className }) => (
              <th
                key={label}
                scope='col'
                className={`caption-12-md h-[4rem] px-[1.2rem] whitespace-nowrap ${className}`}
              >
                {label}
              </th>
            ))}
            <th scope='col' className='caption-12-md h-[4rem] w-[7.7rem] px-[1.2rem]'>
              상세보기
            </th>
          </tr>
        </thead>
        <tbody className='caption-14-rg divide-y divide-gray-50 border-b border-gray-50 text-gray-700'>
          {students.length === 0 ? (
            <tr>
              <td
                colSpan={COLUMN_COUNT}
                className='font-16-rg py-[3.2rem] text-center text-gray-500'
              >
                조회된 근로장학생이 없습니다.
              </td>
            </tr>
          ) : (
            students.map((student, index) => (
              <tr key={student.userId} className='transition-colors hover:bg-gray-50'>
                <td className={`${CELL_CLASS_NAME} text-center`}>{startNumber + index + 1}</td>
                {COLUMNS.map(({ label, render }) => (
                  <td key={label} className={`${CELL_CLASS_NAME} truncate`}>
                    {render(student)}
                  </td>
                ))}
                <td className={CELL_CLASS_NAME}>
                  <button
                    type='button'
                    aria-label={`${student.name} 상세보기`}
                    className='flex h-[2.8rem] w-[2.8rem] cursor-pointer items-center justify-center rounded-[0.8rem] border border-gray-50 text-gray-700 hover:bg-gray-50'
                    onClick={() => onDetailOpen(student.userId)}
                  >
                    <IconArrowRight aria-hidden className='h-[2rem] w-[2rem]' />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
