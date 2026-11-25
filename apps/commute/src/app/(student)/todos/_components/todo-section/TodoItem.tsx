import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { CheckBox, StateChip } from '@konkuk-icteam-fe/design-system/ui';
import type { DailyTodo } from '@/app/(student)/_apis/todos';
import { convertDateToTime } from '@/shared/utils/time';

type TodoItemProps = {
  todo: DailyTodo;
  myUserId: number;
  isDisabled: boolean;
  onToggle: (todo: DailyTodo) => void;
};

export default function TodoItem({ todo, myUserId, isDisabled, onToggle }: TodoItemProps) {
  const completionLabel =
    todo.isCompleted && todo.completedBy && todo.completedAt
      ? `${todo.completedBy.userName} ${convertDateToTime(todo.completedAt)} 완료`
      : null;

  return (
    <li className='border-b border-gray-400/20 py-[1.2rem] last:border-b-0'>
      <CheckBox
        checked={todo.isCompleted}
        disabled={isDisabled}
        onChange={() => onToggle(todo)}
        className='w-full items-start [&>span:first-child]:h-[1.8rem] [&>span:first-child]:w-[1.8rem]'
      >
        <span className='flex min-w-0 flex-col gap-[0.6rem]'>
          <span
            className={cn(
              'caption-14-md leading-[1.8rem]!',
              todo.isCompleted ? 'text-gray-400' : 'text-black',
            )}
          >
            {todo.title}
          </span>
          {(todo.assignees.length > 0 || completionLabel) && (
            <span className='flex flex-wrap items-center gap-[0.4rem]'>
              {todo.assignees.map(({ userId, userName }) => (
                <StateChip
                  key={userId}
                  label={userName}
                  tone={userId === myUserId ? 'blue' : 'gray'}
                />
              ))}
              {completionLabel && (
                <span className='caption-12-md ml-[0.4rem] text-center text-gray-500'>
                  {completionLabel}
                </span>
              )}
            </span>
          )}
        </span>
      </CheckBox>
    </li>
  );
}
