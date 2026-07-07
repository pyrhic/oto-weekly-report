import { syncToSheet } from "./sync-sheet.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const date = (body.date || "").trim();
    const dow = (body.dow || "").trim();
    const tasks = (body.tasks || "").trim();
    const leave = (body.leave || "").trim();

    if (!date || !tasks) {
      return new Response(JSON.stringify({ error: "날짜와 업무 내용은 필수입니다." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await env.DB.prepare(
      "insert into daily_logs (log_date, dow, tasks, leave_note) values (?, ?, ?, ?)"
    )
      .bind(date, dow, tasks, leave)
      .run();

    await syncToSheet(env, { date, dow, tasks, leave });

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
