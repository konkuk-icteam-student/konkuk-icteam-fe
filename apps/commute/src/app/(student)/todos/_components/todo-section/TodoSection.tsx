import type { DailyTodo, TodoPeriod } from '@/app/(student)/_apis/todos';
import CollapsibleSection from '../CollapsibleSection';
import TodoItem from './TodoItem';

const PERIOD_LABELS: Record<TodoPeriod, string> = { MORNING: '오전', AFTERNOON: '오후' };

type TodoSectionProps = {
  period: TodoPeriod;
  todos: DailyTodo[];
  myUserId: number;
  // 그 시간대에 내 근무가 있어야 체크할 수 있다
  isOnDuty: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleTodo: (todo: DailyTodo) => void;
};

export default function TodoSection({
  period,
  todos,
  myUserId,
  isOnDuty,
  isOpen,
  onToggleOpen,
  onToggleTodo,
}: TodoSectionProps) {
  return (
    <CollapsibleSection title='업무 사항' isOpen={isOpen} onToggleOpen={onToggleOpen}>
      {todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.todoId}
              todo={todo}
              myUserId={myUserId}
              isDisabled={!isOnDuty}
              onToggle={onToggleTodo}
            />
          ))}
        </ul>
      ) : (
        <p className='caption-14-md py-[1.6rem] text-gray-400'>
          {`${PERIOD_LABELS[period]} 업무가 없습니다.`}
        </p>
      )}
    </CollapsibleSection>
  );
}
