import type { WorkScheduleSlot } from '@/app/(student)/_apis/workSchedules';
import CollapsibleSection from '../CollapsibleSection';

import { StateChip } from '@konkuk-icteam-fe/design-system/ui';

type WorkTimeSectionProps = {
  slots: WorkScheduleSlot[];
  myUserId: number;
  isOpen: boolean;
  onToggleOpen: () => void;
};

export default function WorkTimeSection({
  slots,
  myUserId,
  isOpen,
  onToggleOpen,
}: WorkTimeSectionProps) {
  const hasWorker = slots.some(({ users }) => users.length > 0);

  return (
    <CollapsibleSection title='근로 시간' isOpen={isOpen} onToggleOpen={onToggleOpen}>
      {hasWorker ? (
        <ul>
          {slots.map(({ start, users }) => (
            <li
              key={start}
              className='flex items-center gap-[1.2rem] border-b border-gray-400/20 py-[1rem] last:border-b-0'
            >
              <span className='font-16-md w-[5.6rem] shrink-0 text-black'>{start}</span>
              <span className='flex min-w-0 flex-1 flex-wrap gap-[0.4rem]'>
                {users.length > 0 ? (
                  users.map(({ userId, userName }) => (
                    <StateChip
                      key={userId}
                      label={userName}
                      tone={userId === myUserId ? 'blue' : 'gray'}
                    />
                  ))
                ) : (
                  <span className='caption-12-md text-gray-400'>-</span>
                )}
              </span>
              <span className='caption-12-md shrink-0 text-gray-400'>{`${users.length}명`}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className='caption-14-md py-[1.6rem] text-gray-400'>근무자가 없습니다.</p>
      )}
    </CollapsibleSection>
  );
}
