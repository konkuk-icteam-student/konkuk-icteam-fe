'use client';

import { IconAdd, IconPencil, IconTrash } from '@konkuk-icteam-fe/design-system/assets';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { ConfirmModal, IconButton, TagChip } from '@konkuk-icteam-fe/design-system/ui';
import { getTodoAssigneeCounts, type Todo, type TodoPeriod } from '../../../_apis/todos';
import { getWorkerChipTone } from '@/shared/utils/getWorkerChipTone';
import { PERIODS } from '../../../_constants/period';
import useTaskAssignment from '../../_hooks/useTaskAssignment';
import type { OnDutyWorker } from '../../_utils/getWorkersByPeriod';
import { getTaskStartOptions, getWorkersAt } from '../../_utils/taskTime';
import AssigneePicker from './AssigneePicker';
import TaskForm from './TaskForm';

type TaskAssignment = ReturnType<typeof useTaskAssignment>;
type TaskState = TaskAssignment['compatibleState'];
type TaskHandlers = TaskAssignment['compatibleHandlers'];

type TaskRowProps = {
  todo: Todo;
  workers: OnDutyWorker[];
  state: TaskState;
  handlers: TaskHandlers;
};

const TaskRow = ({ todo, workers, state, handlers }: TaskRowProps) => {
  const { todoId: id, title } = todo;
  const assignment = state.assignments[id];
  // 날짜나 업무 시간대가 바뀌어 저장한 시각에 아무도 근무하지 않으면 시작 시각을 다시 고르게 한다
  const start =
    assignment && getTaskStartOptions(workers).includes(assignment.start) ? assignment.start : null;
  // 그 시각에 근무하지 않는 학생은 빼고 보여 준다
  const availableWorkers = start ? getWorkersAt(workers, start) : [];
  const assignees = availableWorkers.filter(({ userId }) => assignment?.userIds.includes(userId));
  const isEditing = state.editingTaskId === id;
  const isCompleted = state.completedTodoIds.includes(id);

  if (state.renamingTaskId === id) {
    return (
      <li className='border-b border-gray-50 py-[0.9rem] last:border-b-0'>
        <TaskForm
          label={`${title} 수정`}
          initialTitle={title}
          initialPeriod={todo.period}
          canChangePeriod
          submitLabel='저장'
          onSubmit={(nextTitle, nextPeriod) => handlers.handleTodoUpdate(id, nextTitle, nextPeriod)}
          onCancel={handlers.handleRenameCancel}
        />
      </li>
    );
  }

  return (
    <li className='group border-b border-gray-50 py-[0.9rem] last:border-b-0'>
      <div className='flex items-center gap-[1rem]'>
        <p
          className={cn(
            'caption-14-md w-[18rem] shrink-0',
            isCompleted ? 'text-gray-400 line-through' : 'text-black',
          )}
        >
          {title}
          {isCompleted && <span className='sr-only'> (완료)</span>}
        </p>
        <div className='flex min-w-0 flex-1 flex-wrap items-center gap-[0.4rem]'>
          {assignees.length === 0 ? (
            <span className='caption-12-md text-gray-400'>미지정</span>
          ) : (
            <>
              <span className='caption-12-md text-blue'>{start}</span>
              {assignees.map(({ userId, userName }) => (
                <TagChip
                  key={userId}
                  label={userName}
                  tone={getWorkerChipTone(userId)}
                  onRemove={() => handlers.handleWorkerToggle(id, userId)}
                />
              ))}
            </>
          )}
        </div>
        <button
          type='button'
          aria-expanded={isEditing}
          disabled={workers.length === 0}
          className={cn(
            'caption-12-md flex shrink-0 cursor-pointer items-center gap-[0.2rem] rounded-[0.6rem] px-[0.8rem] py-[0.4rem] transition-colors disabled:cursor-not-allowed disabled:opacity-40',
            isEditing ? 'bg-blue text-black-1' : 'text-blue hover:bg-blue/10 bg-gray-50',
          )}
          onClick={() => handlers.handleEditToggle(id)}
        >
          {isEditing ? (
            '완료'
          ) : (
            <>
              <IconAdd aria-hidden className='h-[1.4rem] w-[1.4rem]' />
              지정
            </>
          )}
        </button>

        <div className='flex shrink-0 items-center gap-[0.2rem] opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100'>
          <IconButton
            aria-label={`${title} 수정`}
            className='group'
            onClick={() => handlers.handleRenameStart(id)}
          >
            <IconPencil
              aria-hidden
              className='h-[1.6rem] w-[1.6rem] text-gray-400 group-hover:text-black'
            />
          </IconButton>
          <IconButton
            aria-label={`${title} 삭제`}
            className='group'
            onClick={() => handlers.handleDeleteStart(todo)}
          >
            <IconTrash
              aria-hidden
              className='group-hover:text-red h-[1.6rem] w-[1.6rem] text-gray-400'
            />
          </IconButton>
        </div>
      </div>

      {isEditing && (
        <AssigneePicker
          title={title}
          workers={workers}
          start={start}
          userIds={assignees.map(({ userId }) => userId)}
          countByUserId={Object.fromEntries(
            getTodoAssigneeCounts({ todoId: id }).counts.map(({ userId, count }) => [
              userId,
              count,
            ]),
          )}
          onStartChange={(nextStart) => handlers.handleStartChange(id, workers, nextStart)}
          onToggle={(userId) => handlers.handleWorkerToggle(id, userId)}
        />
      )}
    </li>
  );
};

type PeriodSectionProps = {
  period: TodoPeriod;
  label: string;
  workers: OnDutyWorker[];
  state: TaskState;
  handlers: TaskHandlers;
};

const PeriodSection = ({ period, label, workers, state, handlers }: PeriodSectionProps) => (
  <section aria-label={`${label} 업무`}>
    <div className='flex items-center justify-between border-b border-gray-50 px-[0.4rem] pb-[0.8rem]'>
      <div className='flex items-center gap-[0.4rem]'>
        <h4 className='font-14-bd text-black'>{label}</h4>
        <IconButton
          aria-label={`${label} 업무 추가`}
          aria-expanded={state.addingPeriod === period}
          className='group'
          onClick={() => handlers.handleAddStart(period)}
        >
          <IconAdd
            aria-hidden
            className='group-hover:text-blue h-[1.6rem] w-[1.6rem] text-gray-400'
          />
        </IconButton>
      </div>
      <span className='caption-12-md text-gray-400'>
        {workers.length === 0 ? '근무자 없음' : `근무자 ${workers.length}명`}
      </span>
    </div>
    <ul className='flex flex-col'>
      {state.todos
        .filter((todo) => todo.period === period)
        .map((todo) => (
          <TaskRow
            key={todo.todoId}
            todo={todo}
            workers={workers}
            state={state}
            handlers={handlers}
          />
        ))}
      {state.addingPeriod === period ? (
        <li className='py-[0.9rem]'>
          <TaskForm
            label={`${label} 업무 추가`}
            initialPeriod={period}
            submitLabel='추가'
            onSubmit={handlers.handleTodoAdd}
            onCancel={handlers.handleAddCancel}
          />
        </li>
      ) : null}
    </ul>
  </section>
);

type AssignTaskListProps = {
  dateKey: string;
  // 시간대별로 그날 근무하는 근로학생. 업무는 그 시간대에 근무하는 사람에게만 맡길 수 있다
  workersByPeriod: Record<TodoPeriod, OnDutyWorker[]>;
  onNotify: (message: string) => void;
};

// 반복 업무를 오전·오후로 나눠 보여 주고, 업무마다 시작 시각과 근로학생을 지정한다. 지정은 날짜별로 저장한다
export default function AssignTaskList({
  dateKey,
  workersByPeriod,
  onNotify,
}: AssignTaskListProps) {
  const { compatibleState, compatibleHandlers } = useTaskAssignment(dateKey, onNotify);

  return (
    <div className='flex flex-col gap-[1.6rem]'>
      {PERIODS.map(({ period, label }) => (
        <PeriodSection
          key={period}
          period={period}
          label={label}
          workers={workersByPeriod[period]}
          state={compatibleState}
          handlers={compatibleHandlers}
        />
      ))}

      <ConfirmModal
        open={compatibleState.deletingTodo !== null}
        handleOpenChange={(open) => {
          if (!open) compatibleHandlers.handleDeleteCancel();
        }}
        title='업무를 삭제하시겠습니까?'
        description={
          compatibleState.deletingTodo
            ? `'${compatibleState.deletingTodo.title}'을(를) 지우면 모든 날짜의 지정도 함께 사라집니다.`
            : undefined
        }
        buttons={[
          { label: '이전', tone: 'subtle_2', color: 'gray', size: 'medium' },
          {
            label: '삭제하기',
            color: 'red',
            size: 'medium',
            onClick: compatibleHandlers.handleDeleteConfirm,
          },
        ]}
      />
    </div>
  );
}
