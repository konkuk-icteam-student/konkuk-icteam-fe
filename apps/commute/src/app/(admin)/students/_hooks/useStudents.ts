import { useCallback, useState } from 'react';
import {
  deleteWorker,
  getMonthlyWorkers,
  getWorkers,
  resetWorkerPassword,
  updateWorker,
  type MonthlyWorkRecord,
  type Worker,
} from '../../_apis/workers';
import { getCurrentMonthKey, parseMonthKey } from '../../_utils/monthKey';
import { STUDENT_PAGE_SIZE } from '../_constants/student';

// 근로장학생 표 한 줄. 이번 달 근로학생이면 이번 달 근무 기록이 붙고, 아니면 null이다
export type StudentRow = Worker & {
  monthlyRecord: MonthlyWorkRecord | null;
};

// 정보 수정에서 바꿀 수 있는 항목
const EDITABLE_KEYS = ['name', 'studentId', 'department', 'grade', 'phoneNumber'] as const;

/**
 * 모든 근로장학생에 이번 달 근무 기록을 붙여 불러옵니다.
 * @returns 근로장학생 표 줄 목록
 * @example loadStudents()[0].monthlyRecord?.lateCount; // 1
 */
const loadStudents = (): StudentRow[] => {
  const records = new Map(
    getMonthlyWorkers(parseMonthKey(getCurrentMonthKey())).workers.map(
      ({ userId, monthlyRecord }) => [userId, monthlyRecord],
    ),
  );

  return getWorkers().workers.map((worker) => ({
    ...worker,
    monthlyRecord: records.get(worker.userId) ?? null,
  }));
};

// 근로장학생 목록. 달을 고르지 않고 모든 근로장학생을 보여 주고, 이번 달 근무 기록을 붙인다
export const useStudents = () => {
  // 근무 기록 목업은 한 달 근무를 모두 세서 무겁다. 정보를 고치거나 지울 때만 다시 불러온다
  const [allStudents, setAllStudents] = useState(loadStudents);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const students = allStudents.filter(({ name }) => name.includes(keyword.trim()));
  const totalPages = Math.max(Math.ceil(students.length / STUDENT_PAGE_SIZE), 1);
  const currentPage = Math.min(page, totalPages - 1);

  // 상세 화면이 Escape 키 이벤트에 걸어 두므로, 그릴 때마다 새 함수가 되지 않게 고정한다
  const handleDetailClose = useCallback(() => setSelectedUserId(null), []);

  const handleKeywordChange = (nextKeyword: string) => {
    setKeyword(nextKeyword);
    setPage(0);
  };

  // 바뀐 항목만 보낸다
  const handleProfileUpdate = (profile: Worker) => {
    const current = allStudents.find(({ userId }) => userId === profile.userId);
    const changes = Object.fromEntries(
      EDITABLE_KEYS.filter((key) => profile[key] !== current?.[key]).map((key) => [
        key,
        profile[key],
      ]),
    );

    updateWorker({ userId: profile.userId, ...changes });
    setAllStudents(loadStudents());
  };

  const handlePasswordReset = (userId: number) => {
    resetWorkerPassword({ userId });
  };

  // 지운 근로장학생은 목록에서 빠지고 상세 화면도 닫힌다
  const handleDelete = (userId: number) => {
    deleteWorker({ userId });
    setSelectedUserId(null);
    setAllStudents(loadStudents());
  };

  return {
    keyword,
    students: students.slice(
      currentPage * STUDENT_PAGE_SIZE,
      (currentPage + 1) * STUDENT_PAGE_SIZE,
    ),
    totalCount: allStudents.length,
    page: currentPage,
    totalPages,
    startNumber: currentPage * STUDENT_PAGE_SIZE,
    selectedStudent: allStudents.find(({ userId }) => userId === selectedUserId) ?? null,
    handleKeywordChange,
    handlePageChange: setPage,
    handleDetailOpen: setSelectedUserId,
    handleDetailClose,
    handleProfileUpdate,
    handlePasswordReset,
    handleDelete,
  };
};
