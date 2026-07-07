-- oto-weekly-report: Cloudflare D1 스키마
-- Cloudflare 대시보드의 D1 콘솔에서 이 파일 내용을 실행하세요.

create table daily_logs (
  id integer primary key autoincrement,
  log_date text not null,      -- 예: "7/9"
  dow text,                    -- 예: "목"
  tasks text not null,         -- 그날 한 일 (자유 텍스트, 여러 줄 가능)
  leave_note text,             -- 추가 부재시간/사유 (없으면 빈 문자열)
  created_at text default (datetime('now'))
);

create table weekly_reports (
  id integer primary key autoincrement,
  period_start text,           -- 예: "2026년 7월 6일"
  period_end text,             -- 예: "7월 10일"
  report_data text not null,   -- JSON 문자열 (직위/성명/요일별 업무 등)
  archived integer default 0,  -- 0=공개, 1=숨김
  created_at text default (datetime('now'))
);
