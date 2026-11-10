import { LUNCH_BREAK } from '@/shared/config/slot';
import { ArrowButton } from '@/shared/ui';
import { formatMonthDay, formatWeekday } from '@/shared/utils/formatDate';
import type { Worker } from '../../../_apis/workers';
import { PERIODS } from '../../../_constants/period';
import { EMPTY_STUDENT_TEXT } from '../../_constants/student';
import { useWorkLedger } from '../../_hooks/useWorkLedger';
import { formatMinutesToHours } from '../../_utils/studentFormat';
import StatCard from './StatCard';

type LedgerColumn = {
  label: string;
  className: string;
};

const LEDGER_COLUMNS: LedgerColumn[] = [
  { label: '일자', className: 'w-[7rem]' },
  { label: '요일', className: 'w-[4.4rem]' },
  { label: '오전/오후', className: 'w-[7rem]' },
  { label: '시작시간', className: 'w-[7.6rem]' },
  { label: '종료시간', className: 'w-[7.6rem]' },
  { label: '근무시간', className: 'w-[4.6rem]' },
];

const BODY_CELL_CLASS_NAME = 'py-[1rem] text-center';

/**
 * 최대 근로시간 글자를 만듭니다. 최대치가 없으면 -입니다.
 * @param limitMinutes 최대 근로시간 (분)
 * @returns '/ 최대 N시간' 또는 '-'
 * @example createLimitCaption(900); // '/ 최대 15시간'
 */
const createLimitCaption = (limitMinutes: number | null) =>
  limitMinutes === null ? EMPTY_STUDENT_TEXT : `/ 최대 ${formatMinutesToHours(limitMinutes)}시간`;

type WorkLedgerTabProps = {
  student: Pick<Worker, 'userId' | 'name' | 'workStartDate'>;
};

// 상세보기 근로대장 탭. 고른 달의 근무 완료 건을 배정된 시간 기준으로 적는다
export default function WorkLedgerTab({ student }: WorkLedgerTabProps) {
  const ledger = useWorkLedger(student);

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-[1.2rem]'>
          <ArrowButton
            direction='left'
            aria-label='이전 달'
            className='h-[2.8rem] w-[2.8rem]'
            disabled={ledger.isPrevMonthDisabled}
            onClick={() => ledger.handleMonthMove(-1)}
          />
          <h3 className='font-16-bd text-black'>{`${ledger.year}년 ${ledger.month}월`}</h3>
          <ArrowButton
            direction='right'
            aria-label='다음 달'
            className='h-[2.8rem] w-[2.8rem]'
            disabled={ledger.isNextMonthDisabled}
            onClick={() => ledger.handleMonthMove(1)}
          />
        </div>
        <span className='caption-12-md text-gray-400'>
          {`휴게 ${LUNCH_BREAK.start} - ${LUNCH_BREAK.end}`}
        </span>
      </div>

      <dl className='flex gap-[1.2rem]'>
        {ledger.weeklyWorkedMinutes === null ? null : (
          <StatCard
            label='이번주 누적 근무시간'
            value={`${formatMinutesToHours(ledger.weeklyWorkedMinutes)}시간`}
            caption={createLimitCaption(ledger.weeklyLimitMinutes)}
          />
        )}
        <StatCard
          label={ledger.isCurrentMonth ? '이번달 누적 근무시간' : `${ledger.month}월 누적 근무시간`}
          value={`${formatMinutesToHours(ledger.monthlyWorkedMinutes)}시간`}
          caption={createLimitCaption(ledger.monthlyLimitMinutes)}
        />
      </dl>

      <section className='flex flex-col gap-[1.2rem] rounded-[1.2rem] border border-gray-50 p-[1.6rem]'>
        <h3 className='caption-14-bd text-center text-black'>
          {`교내근로장학생 근로대장 (${ledger.year}년 ${ledger.month}월)`}
        </h3>
        <p className='caption-12-md text-right text-gray-700'>{`성명 : ${student.name}`}</p>
        <table className='w-full table-fixed border-collapse'>
          <thead>
            <tr className='border-b border-gray-400'>
              {LEDGER_COLUMNS.map(({ label, className }) => (
                <th
                  key={label}
                  scope='col'
                  className={`caption-12-md py-[0.8rem] text-center text-black ${className}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='caption-14-rg text-gray-700'>
            {ledger.rows.length === 0 ? (
              <tr className='border-b border-gray-50'>
                <td
                  colSpan={LEDGER_COLUMNS.length}
                  className='py-[1.6rem] text-center text-gray-400'
                >
                  이 달에 근무 완료한 기록이 없어요.
                </td>
              </tr>
            ) : (
              ledger.rows.map(({ date, period, start, end, workedMinutes }) => (
                <tr key={`${date.getTime()}-${start}`} className='border-b border-gray-50'>
                  <td className={BODY_CELL_CLASS_NAME}>{formatMonthDay(date)}</td>
                  <td className={BODY_CELL_CLASS_NAME}>{formatWeekday(date)}</td>
                  <td className={BODY_CELL_CLASS_NAME}>
                    {PERIODS.find((option) => option.period === period)?.label}
                  </td>
                  <td className={BODY_CELL_CLASS_NAME}>{start}</td>
                  <td className={BODY_CELL_CLASS_NAME}>{end}</td>
                  <td className={BODY_CELL_CLASS_NAME}>{formatMinutesToHours(workedMinutes)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <dl className='caption-14-bd flex items-center justify-end gap-[2.4rem] pt-[0.4rem] pr-[0.4rem] text-black'>
          <dt>월 총 근로시간</dt>
          <dd>{`${formatMinutesToHours(ledger.monthlyWorkedMinutes)}시간`}</dd>
        </dl>
      </section>
    </>
  );
}
