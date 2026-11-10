import { StateChip } from '@konkuk-icteam-fe/design-system/ui';
import { SLOT_ATTENDANCE_STATUS_THEME } from '@/shared/constants/attendanceStatus';
import type useWorkSchedule from '../../../_hooks/useWorkSchedule';

type ScheduleGroup = ReturnType<typeof useWorkSchedule>['scheduleGroups'][number];

type ScheduleRowProps = {
  row: ScheduleGroup['rows'][number];
};

const ScheduleRow = ({ row }: ScheduleRowProps) => (
  <div className='grid grid-cols-[4rem_minmax(0,1fr)_3.2rem] items-center gap-[1.2rem] border-b border-gray-50 px-[0.8rem] py-[0.8rem] last:border-b-0'>
    <time className='font-16-md text-black'>{row.start}</time>
    <div
      className='grid justify-items-start gap-[0.6rem]'
      style={{ gridTemplateColumns: `repeat(${row.cells.length}, max-content)` }}
    >
      {row.cells.map(({ userId, userName, attendance }) =>
        attendance ? (
          <StateChip
            key={userId}
            label={userName}
            tone={attendance.tone}
            title={`${userName} · ${attendance.label}`}
          />
        ) : (
          // 근무하지 않는 칸도 자리는 차지해 사람마다 같은 열에 서게 한다
          <span key={userId} aria-hidden className='invisible'>
            <StateChip label={userName} />
          </span>
        ),
      )}
    </div>
    <span className='caption-12-md text-right text-gray-400'>{`${row.userCount}명`}</span>
  </div>
);

type WorkScheduleListProps = {
  groups: ScheduleGroup[];
};

export default function WorkScheduleList({ groups }: WorkScheduleListProps) {
  return (
    <div className='bg-black-1 rounded-[1.2rem] border border-gray-50 p-[1.6rem] pr-[2.1rem]'>
      <ul aria-label='근태 칩' className='flex flex-wrap justify-end gap-[0.6rem]'>
        {Object.values(SLOT_ATTENDANCE_STATUS_THEME).map(({ label, tone }) => (
          <li key={label}>
            <StateChip label={label} tone={tone} />
          </li>
        ))}
      </ul>
      {groups.length > 0 ? (
        <div className='flex flex-col gap-[2.4rem]'>
          {groups.map((group) => (
            <div key={group.label}>
              <p className='font-14-bd mb-[0.8rem] px-[0.6rem] text-black'>{group.label}</p>
              {group.rows.map((row) => (
                <ScheduleRow key={row.start} row={row} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className='caption-14-md py-[8rem] text-center text-gray-500'>
          이날은 근무 일정이 없습니다.
        </p>
      )}
    </div>
  );
}
