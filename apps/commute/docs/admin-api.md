# 출근부 관리자 API

출근부 관리자 화면(`app/(admin)`, `/dashboard` 등)이 서버와 주고받는 API를 정리한 문서입니다. 프론트는 이 모양대로 화면을 만들어 두었고, 서버가 아직 없어서 같은 모양의 목업 JSON으로 동작합니다.

- 프론트 코드: `apps/commute/src/app/(admin)/_apis/` (리소스마다 파일 하나, 함수마다 위에 메서드·경로 주석)
- 목업: `apps/commute/src/app/(admin)/_apis/mock/` (서버가 보낼 JSON 모양 그대로)
- 서버를 붙이면 `_apis` 함수 안만 실제 요청으로 바꿉니다. 화면 코드는 그대로 둡니다

## 공통 규칙

| 항목          | 규칙                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| 경로          | 모두 `/api/v1/admin`으로 시작합니다. 이 문서에서는 앞의 `/api/v1`을 빼고 적습니다                            |
| 응답 모양     | `{ "isSuccess": true, "message": "...", "details": { ... } }`. 이 문서의 응답 예시는 `details` 안만 적습니다 |
| 날짜          | `YYYY-MM-DD` 문자열 (예: `"2026-10-25"`)                                                                     |
| 날짜·시각     | `YYYY-MM-DDTHH:mm:ss` 문자열, 한국 시간, 시간대 표기 없음 (예: `"2026-10-22T10:12:00"`)                      |
| 시각만        | `HH:mm` 문자열 (예: `"09:00"`). 근무 칸은 30분 단위이고 09:00 ~ 18:00입니다                                  |
| 월            | `year`(예: `2026`)와 `month`(1~12)를 따로 보냅니다                                                           |
| id            | 모두 숫자입니다 (`userId`, `scheduleId`, `requestId`, `todoId`, `noticeId`)                                  |
| 빈 값         | 아직 채우지 않은 정보는 빈 문자열이 아니라 `null`로 보냅니다                                                 |
| 근로시간 단위 | 근로신청 기준은 **시간**, 근무 기록은 **분**입니다 (아래 각 항목에 적어 둠)                                  |

> 프론트는 받은 날짜 문자열을 `_apis` 안에서 한 번만 `Date`로 바꾸고, 보낼 때도 `_apis` 안에서 문자열로 바꿉니다. 서버는 문자열 형식만 맞춰 주면 됩니다.

## 한눈에 보기

| 메서드 | 경로                                                      | 하는 일                                                          | 쓰는 화면                                                                                |
| ------ | --------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| GET    | `/admin/workers?date=&keyword=&page=&size=`               | 근무 인원 목록 (이름 검색·페이지는 서버)                         | 근로장학생(목록). 근로시간 관리·근로신청 관리의 전체 목록은 아래 "백엔드와 정해야 할 것" |
| GET    | `/admin/workers/{userId}?date=`                           | 근무 인원 상세                                                   | 근로장학생(상세보기, 근로대장 카드)                                                      |
| PATCH  | `/admin/workers/{userId}`                                 | 근로장학생 정보 수정                                             | 근로장학생                                                                               |
| GET    | `/admin/workers/{userId}/work-shifts?startDate=&endDate=` | (백엔드에 요청할 API) 한 근로장학생의 기간 근무 구간과 출근 기록 | 근로장학생(근태 요약의 지각·결근, 지각 기록, 근로대장 표)                                |
| POST   | `/admin/workers/{userId}/password-reset`                  | 비밀번호 재설정 링크를 학교 메일로 보내기                        | 근로장학생                                                                               |
| DELETE | `/admin/workers/{userId}`                                 | 계정 삭제                                                        | 근로장학생                                                                               |
| GET    | `/admin/work-schedules?startDate=&endDate=`               | 기간의 근무 시간표                                               | 대시보드(하루), 근로시간 관리(월~금)                                                     |
| GET    | `/admin/attendances?date=`                                | 그날 근무 구간별 출근 기록                                       | 대시보드(오늘 근로 현황, 시간표 근태 색)                                                 |
| POST   | `/admin/work-schedules`                                   | 근무 칸에 근로학생 넣기                                          | 근로시간 관리                                                                            |
| DELETE | `/admin/work-schedules/{scheduleId}`                      | 근무 칸에서 근로학생 빼기                                        | 근로시간 관리                                                                            |
| GET    | `/admin/work-change-requests?year=&month=`                | 한 달 근무 변경 요청과 상태별 건수                               | 대시보드(승인 대기 건수), 근로시간 관리, 수정요청                                        |
| PATCH  | `/admin/work-change-requests/{requestId}`                 | 근무 변경 요청 승인·반려                                         | 수정요청                                                                                 |
| GET    | `/admin/work-applications?year=&month=`                   | 그 달 근로신청 기준과 신청할 수 있는 학생                        | 근로신청 관리                                                                            |
| PUT    | `/admin/work-applications`                                | 그 달 근로신청 열기·수정                                         | 근로신청 관리                                                                            |
| GET    | `/admin/todos`                                            | 반복 업무 목록                                                   | 대시보드                                                                                 |
| POST   | `/admin/todos`                                            | 반복 업무 추가                                                   | 대시보드                                                                                 |
| PUT    | `/admin/todos/{todoId}`                                   | 반복 업무 수정                                                   | 대시보드                                                                                 |
| DELETE | `/admin/todos/{todoId}`                                   | 반복 업무 삭제                                                   | 대시보드                                                                                 |
| GET    | `/admin/todos/{todoId}/assignee-counts`                   | 근로학생별 그 업무 누적 횟수                                     | 대시보드(업무 지정)                                                                      |
| GET    | `/admin/todo-progress?date=`                              | 그날 업무 수와 완료한 업무                                       | 대시보드(업무 현황, 완료 업무 취소선)                                                    |
| GET    | `/admin/todo-assignments?date=`                           | 그날 업무별 시작 시각과 담당 근로학생                            | 대시보드                                                                                 |
| PUT    | `/admin/todo-assignments`                                 | 그날 업무 지정 통째로 저장                                       | 대시보드                                                                                 |
| GET    | `/admin/notices`                                          | 게시 중·게시 예정 공지                                           | 대시보드                                                                                 |
| POST   | `/admin/notices`                                          | 공지 등록                                                        | 대시보드                                                                                 |
| PUT    | `/admin/notices/{noticeId}`                               | 공지 수정                                                        | 대시보드                                                                                 |
| DELETE | `/admin/notices/{noticeId}`                               | 공지 삭제                                                        | 대시보드                                                                                 |

---

## 근로장학생 `workers`

### GET `/admin/workers?date=2026-07-15&keyword=홍길동&page=0&size=10`

근무 인원 목록입니다. 기준일(`date`)이 속한 주(월~일)·달의 근무 기록이 붙습니다. 이름 검색(`keyword`, 비우면 모두)과 페이지 나누기(`page`는 0부터)는 서버가 합니다.

목록 화면 열은 번호 / 성명 / 학번 / 학과 / 학년 / 연락처 / 근로 시작 / 이번달 누적 근로시간 / 지각 횟수 (시간) / 수정요청 / 상세보기입니다. 이 중 **근로 시작(`workStartDate`)과 지각 시간(`lateMinutes`)은 지금 응답에 없어 백엔드에 추가를 요청**했고, 아래 예시에 `// 추가 요청`으로 표시했습니다. 프론트 목업은 두 필드를 채워서 보냅니다.

```json
{
  "date": "2026-07-15",
  "workers": [
    {
      "userId": 1,
      "name": "홍길동",
      "studentId": "202211414",
      "department": "컴퓨터공학과",
      "grade": 3,
      "phoneNumber": "010-1234-5678",
      "workStartDate": "2025-03-01", // 추가 요청
      "weeklyWorkedMinutes": 240,
      "weeklyLimitMinutes": 780,
      "monthlyWorkedMinutes": 960,
      "monthlyLimitMinutes": 1620,
      "totalChangeRequestCount": 9,
      "approvedChangeRequestCount": 3,
      "totalAttendanceIssueCount": 9,
      "lateCount": 3,
      "lateMinutes": 41 // 추가 요청
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 21,
  "totalPages": 3,
  "first": true,
  "last": false
}
```

| 필드                                                    | 설명                                                                                                                                                |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `weeklyWorkedMinutes`, `monthlyWorkedMinutes`           | 기준일이 속한 주·달에 근무 완료한 시간 (분)                                                                                                         |
| `weeklyLimitMinutes`, `monthlyLimitMinutes`             | 주·달 최대 근로시간 (분). 사람마다 다를 수 있습니다. 프론트는 **0이면 그 달 근로학생이 아닌 것**으로 보고 기록 칸을 `-`로 채웁니다 (서버 확인 필요) |
| `totalChangeRequestCount`, `approvedChangeRequestCount` | 그 달 근무 변경 요청 수와 그중 승인 수                                                                                                              |
| `workStartDate` (추가 요청)                             | 근로를 시작한 날. 목록의 "근로 시작" 열 (`YYYY.MM`)                                                                                                 |
| `lateCount`, `lateMinutes` (`lateMinutes`는 추가 요청)  | 그 달 지각 횟수와 늦은 분 합계. 목록의 "지각 횟수 (시간)" 열 (예: `3회 (41분)`)                                                                     |
| `totalAttendanceIssueCount`                             | 그 달 근태 이상 횟수. 목록 화면에서는 쓰지 않습니다. 목업은 지각 + 결근으로 셉니다 (서버 정의 확인 필요)                                            |
| `weeklyWorkedMinutes`, `weeklyLimitMinutes`             | 목록 화면에서는 쓰지 않습니다 (주 누적은 상세보기 근로대장에서 보여 줍니다)                                                                         |
| `totalElements`                                         | 검색어에 맞는 전체 인원. 목록 제목의 "총 인원 수"에 씁니다                                                                                          |

### GET `/admin/workers/{userId}?date=2026-07-15`

근무 인원 상세입니다. 기준일이 속한 주·달의 근무 기록이 붙습니다. 상세보기는 오늘을, 근로대장은 고른 달(이번 달은 오늘, 지난달은 그 달 마지막 날)을 기준일로 보냅니다.

```json
{
  "date": "2026-08-11",
  "userId": 1,
  "name": "학송은",
  "studentId": "202211272",
  "department": "컴퓨터공학부",
  "grade": 4,
  "phoneNumber": "010-5640-3252",
  "email": "ucs155@naver.com",
  "workStartDate": "2026-08-07",
  "weeklyWorkedMinutes": 0,
  "weeklyLimitMinutes": 540,
  "monthlyWorkedMinutes": 0,
  "monthlyLimitMinutes": 1620,
  "totalChangeRequestCount": 3,
  "approvedChangeRequestCount": 1,
  "submittedMinutes": 330,
  "lastRequestedAt": "2026-07-15 13:00"
}
```

| 필드                                                       | 설명                                                                                                                   |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `studentId`, `department`, `grade`, `phoneNumber`, `email` | 아직 채우지 않았으면 `null`                                                                                            |
| `email`                                                    | 로그인 아이디로 쓰는 학교 메일                                                                                         |
| `workStartDate`                                            | 근로를 시작한 날                                                                                                       |
| `submittedMinutes`                                         | 제출한 근무시간 (분). 화면에서 쓰지 않습니다. 목업은 그 달 배정된 근무 시간 합으로 둡니다 (뜻 확인 필요)               |
| `lastRequestedAt`                                          | 마지막 근무 변경 요청 시각. 이 값만 `YYYY-MM-DD HH:mm` 모양입니다 (공통 규칙과 달라 확인 필요). 화면에서 쓰지 않습니다 |
| `timestamp`                                                | 서버 응답 시각. 화면에서 쓰지 않습니다                                                                                 |

근태 요약의 지각 횟수·시간과 결근, 이번 달 지각 기록, 근로대장 표(날짜별 근무)는 이 응답에 없어서 아래 `work-shifts`(백엔드에 요청할 API)로 받습니다.

### PATCH `/admin/workers/{userId}`

바꾼 항목만 보냅니다. 비운 항목은 `null`로 보냅니다. 이메일과 근로 시작일은 바꿀 수 없습니다.

```json
{ "department": "소프트웨어학부", "phoneNumber": null }
```

응답은 바뀐 근로장학생 한 명입니다 (`userId`, `name`, `studentId`, `department`, `grade`, `phoneNumber`, `email`, `workStartDate`).

### GET `/admin/workers/{userId}/work-shifts?startDate=2026-11-01&endDate=2026-11-30` (백엔드에 요청할 API)

한 근로장학생의 기간(`endDate` 포함) 근무 구간과 출근 기록입니다. 한 사람의 이어진 30분 칸을 한 구간으로 묶고, 점심시간으로 끊기면 두 구간이 됩니다(`GET /admin/attendances`와 같은 묶음). 날짜·시작 시각 순으로 옵니다.

```json
{
  "userId": 2,
  "shifts": [
    {
      "date": "2026-11-04",
      "start": "10:30",
      "end": "11:30",
      "checkedInAt": "2026-11-04T10:36:00"
    },
    { "date": "2026-11-05", "start": "13:00", "end": "16:30", "checkedInAt": null }
  ]
}
```

- 예정·근무중·결근 근무도 모두 보냅니다. 지각은 서버가 판정해 주지만, 상세보기에 쓸 서버 근태 API가 정해지기 전이라 지금은 화면에서 `checkedInAt`과 지금 시각으로 지각·결근·근무 완료를 계산합니다 (아래 "백엔드와 정해야 할 것 > 지각 판정")
- 근로장학생 상세보기에서 이렇게 씁니다 (용어는 `apps/commute/CONTEXT.md`의 근무 절)

| 화면                | 쓰는 근무                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 근태 요약·지각 기록 | 이번 달 근무. 시작 시각에서 5분을 넘겨 출근했으면 지각(늦은 분은 시작 시각부터 셈), 끝났는데 출근하지 않았으면 결근           |
| 근로대장            | 고른 달의 근무 완료(출근했고 끝난) 건만, 배정된 시작·종료 시각으로 적습니다. 이번 달이면 이번 주 누적을 위해 그 주 월요일부터 |

### POST `/admin/workers/{userId}/password-reset`

근로장학생 학교 메일로 비밀번호 재설정 링크를 보냅니다. 근로장학생이 링크를 누르면 새 비밀번호를 정하는 화면으로 갑니다(근로학생·인증 쪽 화면). 요청·응답 본문은 없습니다. 메일이 없는 근로장학생은 화면에서 버튼을 막습니다.

### DELETE `/admin/workers/{userId}`

계정과 시간표·근로대장·개인정보 등 그 근로장학생과 관련한 정보를 모두 지웁니다. 되돌릴 수 없습니다([ADR 0001](adr/0001-account-deletion-removes-all-records.md)). 요청·응답 본문은 없습니다.

---

## 근무 시간표 `work-schedules`

### GET `/admin/work-schedules?startDate=2026-10-19&endDate=2026-10-23`

기간(시작일·마지막 날 포함)의 날마다 30분 단위 근무 칸과 배치된 사람입니다. 대시보드는 하루, 근로시간 관리는 월~금을 조회합니다.

```json
{
  "startDate": "2026-10-19",
  "endDate": "2026-10-23",
  "maxConcurrentWorkers": 4,
  "days": [
    {
      "date": "2026-10-19",
      "slots": [
        {
          "start": "09:00",
          "end": "09:30",
          "users": [{ "scheduleId": 101, "userId": 1, "userName": "홍길동" }]
        },
        { "start": "09:30", "end": "10:00", "users": [] }
      ]
    }
  ]
}
```

- `days`에는 기간 안의 모든 날짜가 순서대로 옵니다 (주말 포함)
- 하루는 09:00부터 18:00까지 18칸이고, 아무도 없는 칸도 `users: []`로 옵니다
- 점심시간(11:30 ~ 13:00) 칸도 오지만 근로학생은 신청할 수 없습니다
- `maxConcurrentWorkers`는 그 달 근로신청 기준의 동시 근무 최대 인원입니다. 넘겨도 배치는 되고, 화면은 칸마다 `인원/최대 인원`만 보여 줍니다
- `scheduleId`는 "이 사람의 이 칸 배치 한 건"입니다. 뺄 때 이 값을 보냅니다

### POST `/admin/work-schedules`

관리자가 근로학생을 근무 칸에 바로 넣습니다. 승인 절차 없이 확정됩니다.

```json
{ "userId": 3, "date": "2026-10-21", "start": "09:00", "end": "09:30" }
```

```json
{
  "scheduleId": 205,
  "userId": 3,
  "userName": "이서준",
  "date": "2026-10-21",
  "start": "09:00",
  "end": "09:30"
}
```

이미 그 칸에 있는 사람이면 `409`를 돌려줍니다.

### DELETE `/admin/work-schedules/{scheduleId}`

근무 칸에서 근로학생을 뺍니다. 응답 본문은 없습니다.

---

## 출근 기록 `attendances`

### GET `/admin/attendances?date=2026-10-27`

그날 근무 구간마다 출근 기록입니다. 한 사람의 이어진 30분 칸을 한 구간으로 묶고, 점심시간으로 끊기면 두 구간이 됩니다. 시작 시각 순으로 옵니다.

```json
{
  "date": "2026-10-27",
  "shifts": [
    {
      "userId": 4,
      "userName": "박지우",
      "start": "09:00",
      "end": "11:00",
      "checkedInAt": "2026-10-27T08:56:00"
    },
    { "userId": 3, "userName": "이서준", "start": "13:00", "end": "16:30", "checkedInAt": null }
  ]
}
```

- `checkedInAt`은 출근 체크한 시각입니다. 아직 출근하지 않았거나 결근했으면 `null`입니다
- 근태(근무중·근무 완료·근무 예정·지각·결근)는 서버가 주지 않고, 화면에서 `checkedInAt`과 지금 시각으로 정합니다

| 근태      | 화면에서 정하는 기준                                                |
| --------- | ------------------------------------------------------------------- |
| 근무 예정 | 그 칸이 아직 시작하지 않음                                          |
| 근무중    | 출근한 뒤의 칸이고 진행 중                                          |
| 근무 완료 | 출근한 뒤의 칸이고 끝남                                             |
| 지각      | 출근 전에 시작한 칸 (아직 출근하지 않았고 근무가 진행 중일 때 포함) |
| 결근      | 근무 구간이 끝날 때까지 출근하지 않음                               |

대시보드 맨 위 오늘 근로 현황(근무 중·출근 예정·지각/결근 인원)도 같은 응답으로 셉니다.

---

## 근무 변경 요청 `work-change-requests`

근로학생이 보낸 "이 근무를 빼고 / 이 근무를 더하고 싶다"는 요청입니다.

| 상태 코드 | 뜻        |
| --------- | --------- |
| `CS01`    | 승인 대기 |
| `CS02`    | 승인      |
| `CS03`    | 반려      |

### GET `/admin/work-change-requests?year=2026&month=10`

요청을 **보낸 달** 기준으로 한 달 동안 들어온 요청과 상태별 건수입니다. 최근 요청이 앞에 옵니다. 대시보드는 `summary.pendingCount`만 씁니다.

```json
{
  "year": 2026,
  "month": 10,
  "summary": { "totalCount": 6, "pendingCount": 3, "approvedCount": 2, "rejectedCount": 1 },
  "requests": [
    {
      "requestId": 20261006,
      "userId": 1,
      "userName": "홍길동",
      "statusCode": "CS01",
      "requestedAt": "2026-10-22T10:12:00",
      "reason": "전공 수업 보강이 잡혀서 오전 근무를 오후로 옮기고 싶습니다.",
      "rejectReason": null,
      "deleteSchedules": [{ "date": "2026-10-27", "start": "09:00", "end": "12:00" }],
      "addSchedules": [{ "date": "2026-10-28", "start": "13:00", "end": "16:00" }]
    }
  ]
}
```

- `deleteSchedules`(뺄 근무)와 `addSchedules`(더할 근무) 중 한쪽만 있을 수도 있습니다
- `rejectReason`은 반려한 요청에만 있고, 나머지는 `null`입니다

### PATCH `/admin/work-change-requests/{requestId}`

승인 대기(`CS01`)인 요청만 처리할 수 있습니다.

```json
{ "statusCode": "CS02" }
```

```json
{ "statusCode": "CS03", "rejectReason": "그날은 이미 인원이 찼습니다." }
```

- 승인하면 서버가 `deleteSchedules`·`addSchedules`를 근무 시간표에 반영합니다
- 반려할 때는 `rejectReason`이 꼭 있어야 합니다
- 응답은 처리된 요청 한 건(`requests`의 항목 모양)입니다

---

## 근로신청 `work-applications`

관리자가 다음 달 근무 신청을 열 때 정하는 기준과, 신청할 수 있는 근로학생 명단입니다. 관리자 화면에서는 **다음 달**만 열고 고칩니다.

### GET `/admin/work-applications?year=2026&month=11`

```json
{
  "year": 2026,
  "month": 11,
  "isOpened": true,
  "settings": {
    "applyStartDate": "2026-10-20T09:00:00",
    "applyEndDate": "2026-10-25T18:00:00",
    "maxConcurrentWorkers": 4,
    "weeklyMinHours": 6,
    "weeklyMaxHours": 15,
    "monthlyMinHours": 30,
    "monthlyMaxHours": 60,
    "unavailableDates": ["2026-11-11"]
  },
  "userIds": [1, 2, 3, 4, 5, 6, 7]
}
```

아직 열지 않은 달은 이렇게 옵니다.

```json
{ "year": 2026, "month": 11, "isOpened": false, "settings": null, "userIds": [] }
```

| 필드                                 | 설명                                                                          |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `applyStartDate`, `applyEndDate`     | 근로학생이 신청할 수 있는 기간. 날짜와 **시각**까지 정합니다 (날짜·시각 형식) |
| `maxConcurrentWorkers`               | 한 칸(30분)에 함께 근무할 수 있는 최대 인원 (1 이상)                          |
| `weeklyMinHours` ~ `monthlyMaxHours` | 근로시간 기준, **시간** 단위. 최소 ≤ 최대                                     |
| `unavailableDates`                   | 근무할 수 없는 날. 주말·공휴일은 원래 근무가 없어서 넣지 않습니다             |
| `userIds`                            | 그 달 근무를 신청할 수 있는 근로학생 = 그 달 근로학생 명단                    |

### PUT `/admin/work-applications`

그 달 신청을 열거나 기준을 바꿉니다.

```json
{
  "year": 2026,
  "month": 11,
  "settings": {
    "applyStartDate": "2026-10-20T09:00:00",
    "applyEndDate": "2026-10-25T18:00:00",
    "maxConcurrentWorkers": 4,
    "weeklyMinHours": 6,
    "weeklyMaxHours": 15,
    "monthlyMinHours": 30,
    "monthlyMaxHours": 60,
    "unavailableDates": []
  },
  "userIds": [1, 2, 3, 4, 5, 6, 7]
}
```

- 처음 저장하면 그 달 신청이 열립니다 (`isOpened: true`)
- 이미 연 달을 다시 저장하면 **지금까지 들어온 근로신청은 모두 초기화**됩니다. 화면에서 저장 전에 이 내용을 알리고 확인받습니다
- 응답은 `GET`과 같은 모양입니다
- 프론트가 저장 전에 확인하는 규칙: 신청 마감이 시작보다 늦을 것, 동시 근무 최대 인원 1 이상, 주간·월간 최소 ≤ 최대, 근로학생 1명 이상

---

## 업무 `todos`

날마다 반복하는 업무입니다. 오전·오후 시간대로 나뉩니다.

| `period`    | 뜻                             |
| ----------- | ------------------------------ |
| `MORNING`   | 오전 (12시 전에 시작하는 근무) |
| `AFTERNOON` | 오후                           |

### GET `/admin/todos`

```json
{
  "todos": [
    { "todoId": 1, "title": "사무실 오픈 및 PC 전원 켜기", "period": "MORNING" },
    { "todoId": 6, "title": "장비 대여·반납 처리", "period": "AFTERNOON" }
  ]
}
```

### POST `/admin/todos`

```json
{ "title": "택배·우편물 정리", "period": "MORNING" }
```

응답은 만든 업무 한 건(`{ todoId, title, period }`)입니다. 추가한 업무는 다음 날부터 매일 반복됩니다.

### PUT `/admin/todos/{todoId}`

```json
{ "title": "프린터 점검", "period": "AFTERNOON" }
```

응답은 바뀐 업무 한 건입니다. 시간대를 바꿔도 이미 맡긴 근로학생 지정은 그대로 둡니다.

### DELETE `/admin/todos/{todoId}`

응답 본문은 없습니다. 지운 업무는 **모든 날짜의 업무 지정에서도 빠집니다**.

### GET `/admin/todos/{todoId}/assignee-counts`

근로학생마다 이 업무를 지금까지(월 단위 아님) 몇 번 했는지입니다. 업무 지정에서 이름 옆 괄호(예: `홍길동 (3)`)로 보여 줍니다. 한 번도 안 한 사람은 빠지고, 화면은 빠진 사람을 0으로 보여 줍니다.

```json
{
  "todoId": 6,
  "counts": [
    { "userId": 1, "count": 3 },
    { "userId": 2, "count": 5 }
  ]
}
```

### GET `/admin/todo-progress?date=2026-10-27`

그날 업무 수와 근로학생이 완료한 업무입니다. 대시보드 맨 위 업무 현황(`2/10`)과, 업무 지정 목록에서 완료한 업무 이름의 취소선에 씁니다.

```json
{ "date": "2026-10-27", "totalCount": 10, "completedCount": 2, "completedTodoIds": [1, 6] }
```

---

## 업무 지정 `todo-assignments`

그날 업무마다 업무 시작 시각과 맡은 근로학생입니다. 관리자가 업무마다 시작 시각(30분 칸의 시작 시각)을 먼저 고르고, **그 시각에 근무하는 사람**에게만 맡깁니다. 끝 시각은 받지 않습니다.

### GET `/admin/todo-assignments?date=2026-10-27`

```json
{
  "date": "2026-10-27",
  "assignments": [
    { "todoId": 1, "start": "09:00", "userIds": [1, 2] },
    { "todoId": 6, "start": "14:00", "userIds": [5] }
  ]
}
```

시작 시각을 정하지 않은 업무는 `assignments`에서 빠집니다. 시작 시각만 정하고 아직 아무도 맡기지 않은 업무는 `userIds`가 빈 배열로 옵니다 (관리자가 시각을 먼저 고르고 사람을 나중에 고르기 때문입니다).

### PUT `/admin/todo-assignments`

그날 업무 지정을 **통째로** 바꿉니다. 목록에서 빠진 업무는 지정이 풀립니다.

```json
{
  "date": "2026-10-27",
  "assignments": [{ "todoId": 1, "start": "09:00", "userIds": [1] }]
}
```

응답은 `GET`과 같은 모양입니다. 시작 시각을 바꾸면 화면이 그 시각에 근무하지 않는 사람을 `userIds`에서 빼고 보냅니다.

---

## 공지사항 `notices`

근로학생에게 보이는 공지입니다. 게시 기간(시작일~마감일, 둘 다 포함) 동안만 보입니다.

### GET `/admin/notices`

게시가 끝나지 않은 공지(게시 중 + 게시 예정)를 시작일 순으로 줍니다. 게시가 끝난 공지는 오지 않습니다.

```json
{
  "notices": [
    {
      "noticeId": 1,
      "title": "11월 근로신청 안내",
      "content": "11월 근무 시간 신청을 이번 주 금요일까지 받습니다.",
      "startDate": "2026-10-22",
      "endDate": "2026-10-29",
      "createdAt": "2026-10-22T09:00:00"
    }
  ]
}
```

"게시 중 / 게시 예정" 구분은 화면에서 오늘과 `startDate`를 비교해서 합니다.

### POST `/admin/notices`

```json
{
  "title": "정보운영팀 사무실 소독 안내",
  "content": "소독 작업으로 오후 근무는 3층 회의실에서 진행합니다.",
  "startDate": "2026-10-30",
  "endDate": "2026-11-01"
}
```

응답은 만든 공지 한 건(`noticeId`, `createdAt` 포함)입니다.

- 제목·내용은 앞뒤 공백을 뺀 뒤 1글자 이상
- 시작일 ≤ 마감일
- 오늘 이전 날짜는 게시 기간에 넣을 수 없습니다. 단, 이미 게시 중인 공지를 고칠 때는 원래 시작일을 그대로 둘 수 있습니다

### PUT `/admin/notices/{noticeId}`

`POST`와 같은 본문을 보냅니다. 응답은 바뀐 공지 한 건입니다.

### DELETE `/admin/notices/{noticeId}`

응답 본문은 없습니다. 지운 공지는 근로학생 화면에서도 바로 사라집니다.

---

## 백엔드와 정해야 할 것

프론트가 임시로 가정해 둔 부분입니다. 정해지면 이 문서와 `_apis`를 함께 고칩니다.

- **인증**: 관리자 확인 방법(쿠키 / `Authorization` 헤더)과 권한이 없을 때의 응답
- **오류 응답 모양**: 지금은 `409`(이미 배치된 칸) 외에는 정하지 않았습니다. `{ "message": "..." }`처럼 화면에 보여 줄 문구를 함께 주면 토스트로 그대로 띄울 수 있습니다
- **목록 응답에 추가 요청**: 목록 화면의 "근로 시작"·"지각 횟수 (시간)" 열에 필요한 `workStartDate`, `lateMinutes`를 근무 인원 목록 응답에 넣어 달라고 요청합니다
- **전체 근로장학생 목록**: `GET /admin/workers`는 이제 기준일·검색어·페이지를 받는 근무 인원 목록입니다. 근로시간 관리(사람 찾기)와 근로신청 관리(학생 고르기)는 페이지 없는 전체 목록이 필요해서, 지금은 프론트 `getWorkers()`가 목업 전체를 줍니다. 전체 목록을 받을 방법(큰 `size`, 별도 API 등)을 정해야 합니다
- **근로장학생 상세보기에 없는 데이터**: 근태 요약의 지각 횟수·시간과 결근 횟수, 이번 달 지각 기록(날짜·시작 시각·출근 시각·늦은 분), 근로대장 표(근무 완료 건의 날짜·오전/오후·시작·종료·근무시간)가 상세 API에 없습니다. 지금은 `work-shifts`(제안)로 받아 화면에서 계산합니다
- **그 달 근로학생이 아닌 사람**: 목록·상세의 근무 기록이 모두 0으로 오는지, 최대 근로시간 0으로 구분해도 되는지
- **근태 이상 횟수**: `totalAttendanceIssueCount`가 지각 + 결근인지
- **`submittedMinutes`·`lastRequestedAt`의 뜻**과 `lastRequestedAt`의 날짜 모양(`YYYY-MM-DD HH:mm`)
- **업무 수정 메서드**: 업무 수정은 `PUT`(전체 바꾸기)으로 가정했습니다. 근로장학생·변경 요청처럼 `PATCH`로 맞출지 정해야 합니다
- **업무 지정 검증**: 업무 시작 시각에 근무하지 않는 사람을 맡기는 요청을 서버에서도 막을지
- **업무 누적 횟수 기준**: `assignee-counts`의 "한 번"을 지정된 날로 셀지, 근로학생이 완료 체크한 날로 셀지. 지금 목업은 업무·사람마다 정해 둔 임의의 기본 횟수에, 오늘 전 날짜에 지정한 횟수를 더해서 셉니다
- **지각 판정**: DB에는 출근 시각만 저장하고, 지각은 서버가 출근 시각으로 계산해 줍니다. 백엔드의 인원별 근태 현황 응답에 `attendanceStatusCode`·`lateCount`·`lateMinutes`가 있습니다. 지각 기준은 시작 시각에서 5분을 넘기면 지각이고, 늦은 분은 시작 시각부터 셉니다.
  - 지금 프론트는 서버 근태 API를 붙이기 전이라 같은 기준(`LATE_GRACE_MINUTES`)으로 목업과 근로장학생 상세보기에서 직접 계산합니다. 서버 값을 쓰게 되면 `(admin)/_utils/workerShift.ts`의 지각·결근 계산을 걷어 냅니다
  - 확인할 것: 서버의 5분 경계(10:35:00 정상, 10:35:01 지각)와 늦은 분 계산 방식, `attendanceStatusCode` 코드표, 인원별 근태 현황 응답만 `userId`가 문자열(`"1"`)인 이유 (근무 인원 목록·상세는 숫자)
  - 대시보드 근태 색과 출근 기록(`GET /admin/attendances`)도 근태를 화면에서 정한다고 가정하고 있고 아직 1분이라도 늦으면 지각으로 보여서, 서버 응답에 맞춰 함께 고쳐야 합니다
- **근로신청 재저장**: 이미 열린 달을 다시 저장할 때 들어온 신청을 초기화하는 처리를 서버에서 할지
- **계정 삭제 범위**: 화면은 디자인 문구대로 근로대장까지 모두 지운다고 안내합니다([ADR 0001](adr/0001-account-deletion-removes-all-records.md)). 서버가 지난 근무 기록을 남기기로 하면 확인 창 문구와 ADR을 함께 고칩니다
- **근로학생 화면 API**: 이 문서는 관리자 화면만 다룹니다. 근로학생 화면(홈·시간표)이 쓰는 API는 [`student-api.md`](student-api.md)에 정리했습니다
