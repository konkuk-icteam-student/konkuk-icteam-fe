'use client';

import { useState } from 'react';
import { Button, ConfirmModal } from '@konkuk-icteam-fe/design-system/ui';
import type { WorkTimeRange } from '@/app/(student)/_apis/common';
import { useToast } from '@/shared/hooks/useToast';
import {
  WORK_CHANGE_REQUEST_STATUS,
  WORK_CHANGE_REQUEST_STATUS_THEME,
} from '@/shared/constants/workChangeRequestStatus';
import { ArrowButton } from '@/shared/ui';
import type { WorkChangeRequest } from '../../_apis/workChangeRequests';
import type { Worker } from '../../_apis/workers';
import { getWeekStartKey, shiftWeek } from '../../_components/week-schedule/utils/weekKey';
import { getCurrentMonthKey, parseMonthKey, shiftMonthKey } from '../../_utils/monthKey';
import RejectModal from './_components/RejectModal';
import RequestTimeTablePanel from './_components/RequestTimeTablePanel';
import StatusFilterTabs from './_components/StatusFilterTabs';
import { STATUS_FILTER_ALL, type StatusFilter } from './_utils/statusFilter';
import WorkChangeRequestCard from './_components/WorkChangeRequestCard';
import { useWorkChangeRequests } from './_hooks/useWorkChangeRequests';

// 다음 달 요청까지 볼 수 있다 (근무 신청은 다음 달 것까지 받는다)
const MAX_MONTH_OFFSET = 1;

const NO_CHANGES = { addSchedules: [], deleteSchedules: [] };

/**
 * 요청에서 가장 이른 날짜가 든 주를 얻습니다. 요청을 고르면 시간표를 그 주로 옮깁니다.
 * @param request 근무 변경 요청
 * @returns 그 주 월요일 (YYYY-MM-DD). 바꿀 근무가 없으면 이번 주
 * @example getRequestWeekStartKey(request); // '2026-11-23'
 */
const getRequestWeekStartKey = ({ addSchedules, deleteSchedules }: WorkChangeRequest) => {
  const [earliest] = [...deleteSchedules, ...addSchedules]
    .map(({ date }) => date)
    .sort((a, b) => a.getTime() - b.getTime());

  return getWeekStartKey(earliest ?? new Date());
};

/**
 * 승인 대기 요청들의 더할·뺄 근무를 모읍니다.
 * @param requests 근무 변경 요청 목록
 * @returns 승인 대기(CS01) 요청의 더할 근무·뺄 근무
 * @example createPendingChanges(requests).addSchedules.length; // 3
 */
const createPendingChanges = (requests: WorkChangeRequest[]) => {
  const pendingRequests = requests.filter(
    ({ statusCode }) => statusCode === WORK_CHANGE_REQUEST_STATUS.PENDING,
  );

  return {
    addSchedules: pendingRequests.flatMap(({ addSchedules }) => addSchedules),
    deleteSchedules: pendingRequests.flatMap(({ deleteSchedules }) => deleteSchedules),
  } satisfies { addSchedules: WorkTimeRange[]; deleteSchedules: WorkTimeRange[] };
};

type PageClientProps = {
  statusFilter: StatusFilter;
};

// 근로시간 수정요청. 왼쪽에서 달마다 요청을 상태별로 보고 승인·반려하고,
// 오른쪽 시간표에서 고른 요청(또는 이름으로 찾은 학생)의 한 주 근무와 승인되면 바뀔 칸을 본다
export default function PageClient({ statusFilter }: PageClientProps) {
  const [currentMonthKey] = useState(getCurrentMonthKey);
  const [monthKey, setMonthKey] = useState(currentMonthKey);
  const [rejectTarget, setRejectTarget] = useState<WorkChangeRequest | null>(null);
  const [isBulkApproveOpen, setIsBulkApproveOpen] = useState(false);
  // 오른쪽 시간표에서 보고 있는 요청. 처음에는 아무것도 고르지 않는다
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  // 이름으로 찾은 학생. 고른 요청보다 먼저 보여 준다
  const [searchedWorker, setSearchedWorker] = useState<Worker | null>(null);
  const [weekStartKey, setWeekStartKey] = useState(() => getWeekStartKey(new Date()));
  const { showToast, toast } = useToast();

  const { year, month } = parseMonthKey(monthKey);
  const maxMonthKey = shiftMonthKey(currentMonthKey, MAX_MONTH_OFFSET);
  const { summary, requests, handleApprove, handleReject } = useWorkChangeRequests(year, month);
  const visibleRequests = requests.filter(
    ({ statusCode }) => statusFilter === STATUS_FILTER_ALL || statusCode === statusFilter,
  );
  const pendingRequests = requests.filter(
    ({ statusCode }) => statusCode === WORK_CHANGE_REQUEST_STATUS.PENDING,
  );
  // 고른 요청은 id로 들고 있다가 최신 목록에서 찾는다 (승인·반려하면 상태가 바뀐다)
  const activeRequest = requests.find(({ requestId }) => requestId === selectedRequestId) ?? null;

  const focusedUser = searchedWorker
    ? { userId: searchedWorker.userId, name: searchedWorker.name }
    : activeRequest
      ? { userId: activeRequest.userId, name: activeRequest.userName }
      : null;
  // 이름으로 찾았으면 그 학생의 승인 대기 요청을 모두, 요청을 골랐으면 그 요청만 예정으로 보여 준다
  const pendingChanges = searchedWorker
    ? createPendingChanges(requests.filter(({ userId }) => userId === searchedWorker.userId))
    : activeRequest
      ? createPendingChanges([activeRequest])
      : NO_CHANGES;

  const handleMonthMove = (delta: number) => {
    setMonthKey((prev) => shiftMonthKey(prev, delta));
    setSelectedRequestId(null);
  };

  const handleRequestSelect = (request: WorkChangeRequest) => {
    setSelectedRequestId(request.requestId);
    setSearchedWorker(null);
    setWeekStartKey(getRequestWeekStartKey(request));
  };

  const handleReset = () => {
    setSelectedRequestId(null);
    setSearchedWorker(null);
  };

  const handleApproveClick = ({ requestId, userName }: WorkChangeRequest) => {
    handleApprove(requestId);
    showToast(`${userName}님의 요청을 승인했어요.`);
  };

  const handleBulkApproveConfirm = () => {
    pendingRequests.forEach(({ requestId }) => handleApprove(requestId));
    showToast(`승인 대기 ${pendingRequests.length}건을 모두 승인했어요.`);
  };

  const handleRejectSubmit = (reason: string) => {
    if (!rejectTarget) return;
    handleReject(rejectTarget.requestId, reason);
    showToast(`${rejectTarget.userName}님의 요청을 반려했어요.`);
    setRejectTarget(null);
  };

  return (
    <div className='mx-auto flex w-full max-w-[140rem] flex-col gap-[3.2rem] p-[3.4rem]'>
      <div className='flex items-center justify-center gap-[2rem]'>
        <ArrowButton
          direction='left'
          size='medium'
          aria-label='이전 달'
          onClick={() => handleMonthMove(-1)}
        />
        <h1 className='title-26-eb min-w-[24rem] text-center text-black'>
          {`${year}년 ${month}월 수정요청`}
        </h1>
        <ArrowButton
          direction='right'
          size='medium'
          aria-label='다음 달'
          disabled={monthKey >= maxMonthKey}
          onClick={() => handleMonthMove(1)}
        />
      </div>

      <StatusFilterTabs summary={summary} selected={statusFilter} />

      <div className='grid grid-cols-[36rem_minmax(0,1fr)] items-start gap-[2.4rem]'>
        <section className='flex flex-col gap-[1.2rem]'>
          <div className='flex items-center justify-between'>
            <h2 className='font-16-bd text-black'>{`승인 대기 ${summary.pendingCount}건`}</h2>
            <Button
              display='inline'
              size='small'
              color='blue'
              disabled={pendingRequests.length === 0}
              onClick={() => setIsBulkApproveOpen(true)}
            >
              일괄 승인
            </Button>
          </div>
          {visibleRequests.length === 0 ? (
            <p className='bg-black-1 font-16-rg rounded-[1.2rem] border border-gray-50 py-[6rem] text-center text-gray-500'>
              해당하는 요청이 없습니다.
            </p>
          ) : (
            // 목록은 그 안에서 스크롤하고, 오른쪽 시간표 높이에 맞춘다
            <ul className='flex max-h-[calc(100vh-12rem)] flex-col gap-[1.2rem] overflow-y-auto pr-[0.8rem]'>
              {visibleRequests.map((request) => (
                <li key={request.requestId}>
                  <WorkChangeRequestCard
                    request={request}
                    isSelected={!searchedWorker && activeRequest?.requestId === request.requestId}
                    onSelect={() => handleRequestSelect(request)}
                    onApprove={() => handleApproveClick(request)}
                    onReject={() => setRejectTarget(request)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 왼쪽 목록이 길어도 시간표는 화면에 붙어 있다 */}
        <div className='sticky top-[2.4rem]'>
          <RequestTimeTablePanel
            focusedUser={focusedUser}
            statusChip={
              !searchedWorker && activeRequest
                ? WORK_CHANGE_REQUEST_STATUS_THEME[activeRequest.statusCode]
                : null
            }
            pendingChanges={pendingChanges}
            weekStartKey={weekStartKey}
            onWeekMove={(delta) => setWeekStartKey((prev) => shiftWeek(prev, delta))}
            onWorkerSelect={setSearchedWorker}
            onReset={handleReset}
          />
        </div>
      </div>

      <RejectModal
        requesterName={rejectTarget?.userName ?? null}
        onClose={() => setRejectTarget(null)}
        onSubmit={handleRejectSubmit}
      />
      <ConfirmModal
        open={isBulkApproveOpen}
        handleOpenChange={setIsBulkApproveOpen}
        title={`승인 대기 ${pendingRequests.length}건을 모두 승인하시겠습니까?`}
        description='승인하면 요청한 근무가 시간표에 바로 반영됩니다.'
        buttons={[
          { label: '취소', tone: 'subtle_2', color: 'gray', size: 'medium' },
          { label: '모두 승인', color: 'blue', size: 'medium', onClick: handleBulkApproveConfirm },
        ]}
      />
      {toast}
    </div>
  );
}
