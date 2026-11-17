import { useCallback, useState } from 'react';
import {
  deleteWorker,
  getWorkerDetail,
  getWorkerList,
  resetWorkerPassword,
  updateWorker,
  type GetWorkerListResponse,
  type Worker,
  type WorkerDetail,
} from '../../_apis/workers';
import { STUDENT_PAGE_SIZE } from '../_constants/student';

// 정보 수정에서 바꿀 수 있는 항목
const EDITABLE_KEYS = ['name', 'studentId', 'department', 'grade', 'phoneNumber'] as const;

type WorkerListQuery = {
  date: Date;
  keyword: string;
  page: number;
};

/**
 * 근무 인원 목록 한 페이지를 불러옵니다. 지우거나 검색해서 보던 페이지가 사라지면 마지막 페이지를 다시 불러옵니다.
 * @param query 조회 조건
 * @param query.date 기준일
 * @param query.keyword 이름 검색어
 * @param query.page 페이지 (0부터)
 * @returns 근무 인원 목록 응답
 * @example loadWorkerList({ date: new Date(), keyword: '', page: 0 }).totalElements; // 8
 */
const loadWorkerList = ({ date, keyword, page }: WorkerListQuery): GetWorkerListResponse => {
  const request = { date, keyword, page, size: STUDENT_PAGE_SIZE };
  const response = getWorkerList(request);
  const lastPage = Math.max(response.totalPages - 1, 0);

  return page > lastPage ? getWorkerList({ ...request, page: lastPage }) : response;
};

// 근로장학생 목록. 이름 검색과 페이지 나누기는 서버가 하고, 줄을 누르면 상세 정보를 불러온다
export const useStudents = () => {
  // 화면을 연 날을 기준일로 이번 주·이번 달 근무 기록을 받는다
  const [today] = useState(() => new Date());
  const [keyword, setKeyword] = useState('');
  const [list, setList] = useState(() => loadWorkerList({ date: today, keyword: '', page: 0 }));
  const [selectedStudent, setSelectedStudent] = useState<WorkerDetail | null>(null);

  const reloadList = (page: number) => setList(loadWorkerList({ date: today, keyword, page }));
  const loadDetail = (userId: number) => getWorkerDetail({ userId, date: today });

  // 상세 화면이 Escape 키 이벤트에 걸어 두므로, 그릴 때마다 새 함수가 되지 않게 고정한다
  const handleDetailClose = useCallback(() => setSelectedStudent(null), []);

  // 검색어가 바뀌면 결과가 통째로 달라지므로 첫 페이지부터 다시 받는다
  const handleKeywordChange = (nextKeyword: string) => {
    setKeyword(nextKeyword);
    setList(loadWorkerList({ date: today, keyword: nextKeyword, page: 0 }));
  };

  const handleDetailOpen = (userId: number) => {
    setSelectedStudent(loadDetail(userId));
  };

  // 바뀐 항목만 보낸다
  const handleProfileUpdate = (profile: Worker) => {
    const changes = Object.fromEntries(
      EDITABLE_KEYS.filter((key) => profile[key] !== selectedStudent?.[key]).map((key) => [
        key,
        profile[key],
      ]),
    );

    updateWorker({ userId: profile.userId, ...changes });
    setSelectedStudent(loadDetail(profile.userId));
    reloadList(list.page);
  };

  const handlePasswordReset = (userId: number) => {
    resetWorkerPassword({ userId });
  };

  // 지운 근로장학생은 목록에서 빠지고 상세 화면도 닫힌다
  const handleDelete = (userId: number) => {
    deleteWorker({ userId });
    setSelectedStudent(null);
    reloadList(list.page);
  };

  return {
    keyword,
    students: list.workers,
    totalCount: list.totalElements,
    page: list.page,
    totalPages: Math.max(list.totalPages, 1),
    isFirstPage: list.first,
    isLastPage: list.last,
    startNumber: list.page * list.size,
    selectedStudent,
    handleKeywordChange,
    handlePageChange: reloadList,
    handleDetailOpen,
    handleDetailClose,
    handleProfileUpdate,
    handlePasswordReset,
    handleDelete,
  };
};
