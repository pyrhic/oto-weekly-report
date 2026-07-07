const DOW_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function getThisWeekWeekdays() {
  const now = new Date();
  const day = now.getUTCDay(); // 0=일 ... 6=토
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diffToMonday);

  const dates = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setUTCDate(monday.getUTCDate() + i);
    dates.push({
      label: `${d.getUTCMonth() + 1}/${d.getUTCDate()}`,
      dow: DOW_NAMES[d.getUTCDay()],
      month: d.getUTCMonth() + 1,
      day: d.getUTCDate(),
      year: d.getUTCFullYear(),
    });
  }
  return dates;
}

async function polish(env, text) {
  if (!env.AI || !text) return text;
  try {
    const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
      messages: [
        {
          role: "user",
          content: `다음 업무 내용을 공식 보고서에 어울리는 간결하고 격식있는 문체로 다듬어줘. 사실이나 내용은 절대 바꾸거나 지어내지 말고, 표현만 정돈해줘. 결과만 출력해:\n\n${text}`,
        },
      ],
    });
    return (result.response || text).trim();
  } catch {
    return text; // AI 실패해도 원문으로 진행
  }
}

export async function onRequestPost(context) {
  const { env } = context;
  try {
    const weekdays = getThisWeekWeekdays();
    const labels = weekdays.map((w) => w.label);

    const placeholders = labels.map(() => "?").join(",");
    const { results } = await env.DB.prepare(
      `select log_date, dow, tasks, leave_note from daily_logs where log_date in (${placeholders}) order by log_date asc`
    )
      .bind(...labels)
      .all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: "이번 주에 입력된 업무 기록이 없습니다." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const days = [];
    for (const row of results) {
      const polished = await polish(env, row.tasks);
      days.push({
        date: row.log_date,
        dow: row.dow,
        tasks: polished.split("\n").filter(Boolean),
        leave: row.leave_note || "",
      });
    }

    const first = weekdays[0];
    const last = weekdays[weekdays.length - 1];
    const periodStart = `${first.year}년 ${first.month}월 ${first.day}일`;
    const periodEnd = first.month === last.month ? `${last.day}일` : `${last.month}월 ${last.day}일`;

    const reportData = JSON.stringify({ periodStart, periodEnd, days, remarks: [] });

    await env.DB.prepare(
      "insert into weekly_reports (period_start, period_end, report_data) values (?, ?, ?)"
    )
      .bind(periodStart, periodEnd, reportData)
      .run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
