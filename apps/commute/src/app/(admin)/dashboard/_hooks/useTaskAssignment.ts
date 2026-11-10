import { useReducer, useState } from 'react';
import { parseISO } from '@konkuk-icteam-fe/design-system/date';
import {
  createTodo,
  deleteTodo,
  getTodoAssignments,
  getTodoProgress,
  getTodos,
  saveTodoAssignments,
  updateTodo,
  type Todo,
  type TodoAssignment,
  type TodoPeriod,
} from '../../_apis/todos';
import type { OnDutyWorker } from '../_utils/getWorkersByPeriod';
import { getWorkersAt } from '../_utils/taskTime';

// 고른 날의 반복 업무와 지정. 업무 추가·수정·삭제, 시작 시각·근로학생 지정, 한 번에 하나만 여는 입력 줄 상태를 함께 다룬다
export default function useTaskAssignment(dateKey: string, onNotify: (message: string) => void) {
  // 근로학생을 고르는 중인 업무. 한 번에 한 업무만 펼친다
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  // 이름·시간대를 고치는 중인 업무
  const [renamingTaskId, setRenamingTaskId] = useState<number | null>(null);
  // 업무를 추가하는 중인 시간대. 그 시간대 목록 맨 아래에 입력 줄을 연다
  const [addingPeriod, setAddingPeriod] = useState<TodoPeriod | null>(null);
  // 지울지 묻는 중인 업무
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  // 지정을 저장한 뒤 다시 불러오게 한다
  const [, refresh] = useReducer((count: number) => count + 1, 0);

  const date = parseISO(dateKey);
  const { todos } = getTodos();
  // 그날 근로학생이 완료한 업무. 이름에 취소선을 긋는다
  const { completedTodoIds } = getTodoProgress({ date });
  // 업무 id → 시작 시각과 맡은 근로학생
  const assignments: Record<number, TodoAssignment> = Object.fromEntries(
    getTodoAssignments({ date }).assignments.map((assignment) => [assignment.todoId, assignment]),
  );

  const saveAssignment = (todoId: number, start: string, userIds: number[]) => {
    const nextAssignments = { ...assignments, [todoId]: { todoId, start, userIds } };

    saveTodoAssignments({ date, assignments: Object.values(nextAssignments) });
    refresh();
  };

  // 시작 시각을 바꾸면 그 시각에 근무하지 않는 사람은 지정에서 뺀다
  const handleStartChange = (todoId: number, workers: OnDutyWorker[], start: string) => {
    const availableUserIds = getWorkersAt(workers, start).map(({ userId }) => userId);
    const userIds = (assignments[todoId]?.userIds ?? []).filter((userId) =>
      availableUserIds.includes(userId),
    );

    saveAssignment(todoId, start, userIds);
  };

  // 맡기거나 빼는 사람은 고른 시작 시각에 근무하는 사람뿐이라, 시작 시각이 없으면 아무것도 하지 않는다
  const handleWorkerToggle = (todoId: number, userId: number) => {
    const assignment = assignments[todoId];
    if (!assignment) return;

    const { start, userIds } = assignment;
    saveAssignment(
      todoId,
      start,
      userIds.includes(userId)
        ? userIds.filter((assigneeId) => assigneeId !== userId)
        : [...userIds, userId],
    );
  };

  // 펼쳐 둔 업무를 다시 누르면 접는다
  const handleEditToggle = (todoId: number) => {
    setEditingTaskId(editingTaskId === todoId ? null : todoId);
  };

  // 한 번에 입력 줄 하나만 연다
  const handleAddStart = (period: TodoPeriod) => {
    setEditingTaskId(null);
    setRenamingTaskId(null);
    setAddingPeriod(period);
  };

  const handleAddCancel = () => setAddingPeriod(null);

  const handleTodoAdd = (title: string, period: TodoPeriod) => {
    createTodo({ title, period });
    setAddingPeriod(null);
    onNotify('업무를 추가했어요.');
  };

  const handleRenameStart = (todoId: number) => {
    setEditingTaskId(null);
    setAddingPeriod(null);
    setRenamingTaskId(todoId);
  };

  const handleRenameCancel = () => setRenamingTaskId(null);

  const handleTodoUpdate = (todoId: number, title: string, period: TodoPeriod) => {
    updateTodo({ todoId, title, period });
    setRenamingTaskId(null);
    onNotify('업무를 수정했어요.');
  };

  const handleDeleteStart = (todo: Todo) => setDeletingTodo(todo);

  const handleDeleteCancel = () => setDeletingTodo(null);

  const handleDeleteConfirm = () => {
    if (!deletingTodo) return;
    deleteTodo({ todoId: deletingTodo.todoId });
    if (editingTaskId === deletingTodo.todoId) setEditingTaskId(null);
    setDeletingTodo(null);
    onNotify('업무를 삭제했어요.');
  };

  const compatibleState = {
    todos,
    completedTodoIds,
    assignments,
    editingTaskId,
    renamingTaskId,
    addingPeriod,
    deletingTodo,
  };

  const compatibleHandlers = {
    handleAddCancel,
    handleTodoAdd,
    handleRenameStart,
    handleRenameCancel,
    handleTodoUpdate,
    handleDeleteStart,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleEditToggle,
    handleStartChange,
    handleWorkerToggle,
    handleAddStart,
  };

  return {
    compatibleState,
    compatibleHandlers,
  };
}
