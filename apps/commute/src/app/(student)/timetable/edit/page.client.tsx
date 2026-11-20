'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  BottomCTAButton,
  Button,
  ConfirmModal,
  ResultModal,
} from '@konkuk-icteam-fe/design-system/ui';

import { parseISO } from '@konkuk-icteam-fe/design-system/date';

import { getWorkApplicationSettings } from '@/app/(student)/_apis/workApplications';
import {
  createWorkChangeRequest,
  getMyWorkChangeRequests,
} from '@/app/(student)/_apis/workChangeRequests';
import { SlotLegend, TimeTable } from '@/shared/ui';
import { useTimeTable } from '../_components/timetable/hooks/useTimeTable';
import { useTimeTableWeek } from '../_components/timetable/hooks/useTimeTableWeek';
import type { SlotEdit } from '../_components/timetable/types';
import {
  getDatesWorkHours,
  getMonthWorkHours,
  mergeSlotsToRanges,
} from '../_components/timetable/utils';
import { getMonthWeekInfo } from '@/shared/utils/week';
import { ROUTES } from '@/shared/config/routes';
import { SLOT_MINUTES } from '@/shared/config/slot';
import { SCHEDULE_CHANGE_RULES } from '@/shared/config/workHours';

import BackHeader from '../_components/BackHeader';
import RefreshableInfo from '../_components/RefreshableInfo';
import TimeTableToolbar from '../_components/TimeTableToolbar';
import WorkHoursSummary from '../_components/WorkHoursSummary';
import WorkRuleNotice from '../_components/WorkRuleNotice';
import { EDIT_LEGEND_ITEMS } from '../_constants/slotLegend';
import { useLeaveGuard } from '../_hooks/useLeaveGuard';
import { createScheduleSource } from '../_lib/createTimeTableSource';
import ChangeRequestModal from './_components/ChangeRequestModal';

const HOUR_MS = 60 * 60 * 1000;

/**
 * 같은 상태로 바꾼 칸을 이어진 근무 구간으로 묶습니다.
 * @param slots 바꾼 칸 목록
 * @param status 고를 상태 (추가 예정·삭제 예정)
 * @returns 근무 구간 목록
 * @example createChangedRanges(changedSlots, 'PENDING_ADD');
 */
const createChangedRanges = (slots: SlotEdit[], status: SlotEdit['status']) =>
  mergeSlotsToRanges(
    slots.filter((slot) => slot.status === status),
    SLOT_MINUTES,
  ).map((range) => ({ ...range, date: parseISO(range.date) }));

// 근로시간 수정 요청 화면. 칸을 눌러 추가·삭제 예정을 표시하고 한 번에 요청한다.
export default function PageClient() {
  const router = useRouter();
  const [today] = useState(() => new Date());
  const tableWeek = useTimeTableWeek(today);
  // '자세히보기'를 켜면 칸마다 신청 인원을 보여 준다
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  // 이번 달 근무와 기준, 이번 달 보낸 변경 요청 수. 근로 시작 몇 시간 전까지만 바꿀 수 있다.
  // 새로고침하면 다시 불러온다 (바꾼 칸은 useTimeTable이 들고 있어 그대로 남는다)
  const loadTimeTableData = () => {
    const { year, month } = getMonthWeekInfo(today);

    return {
      source: createScheduleSource({
        year,
        month,
        editableFrom: new Date(today.getTime() + SCHEDULE_CHANGE_RULES.deadlineHours * HOUR_MS),
      }),
      settings: getWorkApplicationSettings({ year, month }).settings,
      usedChangeCount: getMyWorkChangeRequests({ year, month }).requests.length,
    };
  };
  const [{ source, settings, usedChangeCount }, setTimeTableData] = useState(loadTimeTableData);
  const { days, cells, changedSlots, resetEdits, getWorkingSlots } = useTimeTable(
    'edit',
    tableWeek.dates,
    source,
    { isOccupancyVisible: isDetailVisible },
  );

  const hasChangedSlots = changedSlots.length > 0;
  // 한 달 한도를 다 쓰면 더 요청할 수 없다
  const isChangeLimitReached = usedChangeCount >= SCHEDULE_CHANGE_RULES.maxPerMonth;
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [isRequestDoneModalOpen, setIsRequestDoneModalOpen] = useState(false);
  const { isLeaveModalOpen, setIsLeaveModalOpen, handleBack, handleLeave } =
    useLeaveGuard(hasChangedSlots);
  const deleteSchedules = createChangedRanges(changedSlots, 'PENDING_DELETE');
  const addSchedules = createChangedRanges(changedSlots, 'PENDING_ADD');

  // 수정 요청은 관리자가 승인해야 반영된다. 사유를 받아 보내고 완료 모달을 띄운다
  const handleSubmit = (reason: string) => {
    createWorkChangeRequest({ reason, deleteSchedules, addSchedules });
    setIsReasonModalOpen(false);
    setIsRequestDoneModalOpen(true);
  };

  // 확인 버튼·바깥 클릭·ESC 어느 쪽으로 닫아도 근로 시간표로 돌아간다
  const handleRequestDoneModalOpenChange = (open: boolean) => {
    setIsRequestDoneModalOpen(open);

    if (!open) router.replace(ROUTES.TIMETABLE);
  };

  return (
    <div className='flex w-full flex-col gap-[2rem] px-[2rem] py-[2.4rem]'>
      <BackHeader
        title='근로시간 수정 요청'
        year={tableWeek.year}
        month={tableWeek.month}
        onBack={handleBack}
      />
      <TimeTableToolbar
        week={tableWeek.week}
        isPrevWeekDisabled={tableWeek.isPrevWeekDisabled}
        isNextWeekDisabled={tableWeek.isNextWeekDisabled}
        onPrevWeek={tableWeek.handlePrevWeek}
        onNextWeek={tableWeek.handleNextWeek}
        isDetailVisible={isDetailVisible}
        onDetailVisibleChange={setIsDetailVisible}
      />
      <RefreshableInfo
        isWarning={isChangeLimitReached}
        onRefresh={() => setTimeTableData(loadTimeTableData())}
      >
        {isChangeLimitReached
          ? `이번 달 변경 요청 ${SCHEDULE_CHANGE_RULES.maxPerMonth}회를 모두 사용했어요`
          : `이번 달 변경 요청 ${usedChangeCount}/${SCHEDULE_CHANGE_RULES.maxPerMonth}회 사용`}
      </RefreshableInfo>

      <TimeTable days={days} cells={cells} />

      <WorkRuleNotice settings={settings}>
        <SlotLegend items={EDIT_LEGEND_ITEMS} />
      </WorkRuleNotice>
      {/* 추가·삭제 예정을 반영한 근무시간. 이미 지난 칸도 센다 */}
      <WorkHoursSummary
        items={[
          {
            label: `${tableWeek.week}주차 근무시간`,
            hours: getDatesWorkHours(
              getWorkingSlots(),
              days.map(({ date }) => date),
            ),
          },
          {
            label: `${tableWeek.month}월 근무시간`,
            hours: getMonthWorkHours(getWorkingSlots(), tableWeek.year, tableWeek.month),
          },
        ]}
      />
      <BottomCTAButton>
        <BottomCTAButton.Double
          leftButton={
            <Button tone='subtle_2' color='black' disabled={!hasChangedSlots} onClick={resetEdits}>
              초기화
            </Button>
          }
          rightButton={
            <Button
              color='blue'
              disabled={!hasChangedSlots || isChangeLimitReached}
              onClick={() => setIsReasonModalOpen(true)}
            >
              수정 요청
            </Button>
          }
        />
      </BottomCTAButton>
      <ConfirmModal
        open={isLeaveModalOpen}
        handleOpenChange={setIsLeaveModalOpen}
        title='수정을 그만두고 나갈까요?'
        description='표시한 추가·삭제 내용은 저장되지 않아요.'
        buttons={[
          { label: '계속 수정', tone: 'subtle_2', color: 'black' },
          { label: '나가기', color: 'red', onClick: handleLeave },
        ]}
      />
      <ChangeRequestModal
        open={isReasonModalOpen}
        deleteSchedules={deleteSchedules}
        addSchedules={addSchedules}
        onClose={() => setIsReasonModalOpen(false)}
        onSubmit={handleSubmit}
      />
      <ResultModal
        open={isRequestDoneModalOpen}
        handleOpenChange={handleRequestDoneModalOpenChange}
        type='success'
        title='수정 요청이 완료되었어요'
        description={
          '관리자가 승인하면 시간표에 반영돼요.\n요청 사실을 카카오톡 1:1 채팅으로 꼭 알려 주세요.'
        }
        descriptionClassName='whitespace-pre-line text-center'
        buttons={[{ label: '확인', color: 'blue' }]}
      />
    </div>
  );
}
