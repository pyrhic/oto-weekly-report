export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const id = body.id;
    const tasks = (body.tasks || "").trim();
    const leave = (body.leave || "").trim();

    if (!id || !tasks) {
      return new Response(JSON.stringify({ error: "id와 업무 내용은 필수입니다." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await env.DB.prepare("update daily_logs set tasks = ?, leave_note = ? where id = ?")
      .bind(tasks, leave, id)
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
