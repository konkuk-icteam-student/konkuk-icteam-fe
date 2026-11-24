import { useState } from 'react';
import { getMe } from '@/app/(student)/_apis/me';
import {
  getDailyTodos,
  updateTodoCompletion,
  type DailyTodo,
  type TodoPeriod,
} from '@/app/(student)/_apis/todos';
import { getWorkApplicationSettings } from '@/app/(student)/_apis/workApplications';
import { getWorkSchedules } from '@/app/(student)/_apis/workSchedules';
import { checkUnavailableSlot } from '@/shared/utils/slot';
import { getSlotPeriod } from '../_utils/period';

const useTodayTodos = (today: Date, period: TodoPeriod) => {
  const [me] = useState(() => getMe());

  const [slots] = useState(() => {
    // 그 달 근무 불가 시간대 칸은 업무 칸으로 보이지 않는다
    const { settings } = getWorkApplicationSettings({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
    });
    const unavailableTimeRanges = settings?.unavailableTimeRanges ?? [];

    return (getWorkSchedules({ startDate: today, endDate: today }).days[0]?.slots ?? []).filter(
      ({ start }) => !checkUnavailableSlot(start, unavailableTimeRanges),
    );
  });

  const [updatedTodos, setUpdatedTodos] = useState<Record<number, DailyTodo>>({});

  const todos = getDailyTodos({ date: today })
    .todos.filter((todo) => todo.period === period)
    .map((todo) => updatedTodos[todo.todoId] ?? todo);
  const periodSlots = slots.filter(({ start }) => getSlotPeriod(start) === period);
  // 그 시간대에 내 근무가 있어야 업무를 체크할 수 있다
  const isOnDuty = periodSlots.some(({ users }) =>
    users.some(({ userId }) => userId === me.userId),
  );

  const handleToggleTodo = (todo: DailyTodo) => {
    const updatedTodo = updateTodoCompletion({
      todoId: todo.todoId,
      date: today,
      isCompleted: !todo.isCompleted,
    });

    setUpdatedTodos((prev) => ({ ...prev, [todo.todoId]: updatedTodo }));
  };

  return { myUserId: me.userId, todos, periodSlots, isOnDuty, handleToggleTodo };
};

export default useTodayTodos;
