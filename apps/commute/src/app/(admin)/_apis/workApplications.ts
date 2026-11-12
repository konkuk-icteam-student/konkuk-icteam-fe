import {
  parseApiDate,
  parseApiDateTime,
  toApiDate,
  toApiDateTime,
  type ApiJson,
} from '@/app/(student)/_apis/common';
import {
  getWorkApplicationMock,
  getWorkApplicationSubmissionsMock,
  saveWorkApplicationMock,
} from './mock/workApplications';

// 한 달 근로신청 기준. 시간은 모두 시간 단위다
export type WorkApplicationSettings = {
  // 근로학생이 근무 시간을 신청할 수 있는 기간 (보통 전달). 날짜와 시각을 함께 정한다
  // JSON으로는 'YYYY-MM-DDTHH:mm:ss'로 주고받는다
  applyStartDate: Date;
  applyEndDate: Date;
  // 한 칸(30분)에 함께 근무할 수 있는 최대 인원
  maxConcurrentWorkers: number;
  weeklyMinHours: number;
  weeklyMaxHours: number;
  monthlyMinHours: number;
  monthlyMaxHours: number;
  // 근무할 수 없는 날. 주말·공휴일은 원래 근무가 없어서 넣지 않는다
  unavailableDates: Date[];
};

export type GetWorkApplicationRequest = {
  year: number;
  // 1~12
  month: number;
};

export type GetWorkApplicationResponse = {
  year: number;
  month: number;
  // 관리자가 그 달 신청을 열었는지. 열지 않은 달은 settings가 null이다
  isOpened: boolean;
  settings: WorkApplicationSettings | null;
};

// 처음 저장하면 그 달 신청이 열린다. 모든 근로장학생이 신청할 수 있다.
// 이미 연 달을 다시 저장하면 지금까지 들어온 근로신청은 모두 초기화된다
export type SaveWorkApplicationRequest = {
  year: number;
  month: number;
  settings: WorkApplicationSettings;
};

export type SaveWorkApplicationResponse = GetWorkApplicationResponse;

// 근로장학생 한 명의 그 달 제출. 신청 기간 안에 여러 번 고칠 수 있고, 마지막으로 낸 신청 기준이다
export type WorkApplicationSubmission = {
  userId: number;
  name: string;
  studentId: string | null;
  department: string | null;
  grade: number | null;
  // 마지막 제출에 담긴 근무 시간의 합 (분). 미제출이면 0
  submittedMinutes: number;
  // 마지막으로 제출한 시각. 미제출이면 null
  lastSubmittedAt: Date | null;
};

export type GetWorkApplicationSubmissionsRequest = GetWorkApplicationRequest;

export type GetWorkApplicationSubmissionsResponse = {
  year: number;
  month: number;
  // 신청할 수 있는 모든 근로장학생. 열지 않은 달은 빈 배열
  submissions: WorkApplicationSubmission[];
};

const toSettings = (json: ApiJson<WorkApplicationSettings>): WorkApplicationSettings => ({
  ...json,
  applyStartDate: parseApiDateTime(json.applyStartDate),
  applyEndDate: parseApiDateTime(json.applyEndDate),
  unavailableDates: json.unavailableDates.map(parseApiDate),
});

const toSettingsJson = (settings: WorkApplicationSettings): ApiJson<WorkApplicationSettings> => ({
  ...settings,
  applyStartDate: toApiDateTime(settings.applyStartDate),
  applyEndDate: toApiDateTime(settings.applyEndDate),
  unavailableDates: settings.unavailableDates.map(toApiDate),
});

/**
 * GET /admin/work-applications?year=&month=
 * 그 달 근로신청 기준
 */
export const getWorkApplication = ({
  year,
  month,
}: GetWorkApplicationRequest): GetWorkApplicationResponse => {
  const saved = getWorkApplicationMock(year, month);

  return saved
    ? { year, month, isOpened: true, settings: toSettings(saved.settings) }
    : { year, month, isOpened: false, settings: null };
};

/**
 * PUT /admin/work-applications
 * 그 달 신청을 열거나 기준을 바꾼다
 */
export const saveWorkApplication = ({
  year,
  month,
  settings,
}: SaveWorkApplicationRequest): SaveWorkApplicationResponse => {
  saveWorkApplicationMock(year, month, { settings: toSettingsJson(settings) });

  return getWorkApplication({ year, month });
};

/**
 * GET /admin/work-applications/submissions?year=&month=
 * 그 달 근로장학생별 제출 현황 (근로신청 요약)
 */
export const getWorkApplicationSubmissions = ({
  year,
  month,
}: GetWorkApplicationSubmissionsRequest): GetWorkApplicationSubmissionsResponse => ({
  year,
  month,
  submissions: getWorkApplicationSubmissionsMock(year, month).map((json) => ({
    ...json,
    lastSubmittedAt: json.lastSubmittedAt ? parseApiDateTime(json.lastSubmittedAt) : null,
  })),
});
