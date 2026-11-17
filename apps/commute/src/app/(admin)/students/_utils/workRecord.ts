import type { WorkerWorkRecord } from '../../_apis/workers';

/**
 * 그 달 근로학생인지 확인합니다. 근무 인원 API는 근로학생이 아니어도 숫자(0)를 주므로,
 * 그 달 최대 근로시간이 0이면 근로신청 명단에 없는 것으로 봅니다.
 * @param record 근무 기록
 * @param record.monthlyLimitMinutes 그 달 최대 근로시간 (분)
 * @returns 그 달 근로학생이면 true
 * @example checkMonthWorker({ monthlyLimitMinutes: 3600 }); // true
 */
export const checkMonthWorker = ({
  monthlyLimitMinutes,
}: Pick<WorkerWorkRecord, 'monthlyLimitMinutes'>) => monthlyLimitMinutes > 0;
