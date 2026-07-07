// 구글시트 동기화는 선택 기능입니다. GOOGLE_SERVICE_ACCOUNT_KEY가 설정 안 되어 있으면
// 아무 일도 하지 않고 조용히 넘어갑니다 (D1 저장은 이미 끝난 상태이므로 실패해도 무방).

function base64url(bytes) {
  const str = typeof bytes === "string" ? btoa(bytes) : btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(serviceAccount, scope) {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: serviceAccount.client_email,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;
  const pem = serviceAccount.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const binaryDer = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
  const jwt = `${unsigned}.${base64url(signature)}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=${encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer")}&assertion=${jwt}`,
  });
  if (!res.ok) throw new Error("구글 인증 실패: " + (await res.text()));
  return (await res.json()).access_token;
}

// D1의 settings 테이블에 시트 ID를 기억해둔다. 없으면 새로 만든다.
async function getOrCreateSheet(env, serviceAccount, accessToken) {
  const existing = await env.DB.prepare("select value from settings where key = 'google_sheet_id'").first();
  if (existing) return existing.value;

  const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      properties: { title: "OTO WEEKLY REPORT 업무일지" },
      sheets: [{ properties: { title: "업무일지" }, data: [{ startRow: 0, startColumn: 0, rowData: [{
        values: ["날짜", "요일", "한 일", "추가 부재시간"].map((v) => ({ userEnteredValue: { stringValue: v } })),
      }] }] }],
    }),
  });
  if (!createRes.ok) throw new Error("시트 생성 실패: " + (await createRes.text()));
  const created = await createRes.json();
  const sheetId = created.spreadsheetId;

  // 서비스 계정이 만든 시트라 소유자 본인은 못 봄 -> 본인 이메일에 편집 권한을 줘야 함.
  // (그 이메일은 settings 테이블에 owner_email로 미리 저장해뒀다고 가정, 없으면 건너뜀)
  const owner = await env.DB.prepare("select value from settings where key = 'owner_email'").first();
  if (owner && owner.value) {
    const driveToken = await getAccessToken(serviceAccount, "https://www.googleapis.com/auth/drive");
    await fetch(`https://www.googleapis.com/drive/v3/files/${sheetId}/permissions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${driveToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ role: "writer", type: "user", emailAddress: owner.value }),
    });
  }

  await env.DB.prepare("insert into settings (key, value) values ('google_sheet_id', ?)").bind(sheetId).run();
  return sheetId;
}

export async function syncToSheet(env, { date, dow, tasks, leave }) {
  if (!env.GOOGLE_SERVICE_ACCOUNT_KEY) return; // 설정 안 했으면 조용히 스킵

  try {
    const serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const accessToken = await getAccessToken(serviceAccount, "https://www.googleapis.com/auth/spreadsheets");
    const sheetId = await getOrCreateSheet(env, serviceAccount, accessToken);

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/업무일지!A:D:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [[date, dow, tasks, leave || ""]] }),
      }
    );
  } catch (err) {
    // 구글시트 동기화가 실패해도 D1 저장은 이미 됐으니 전체 요청은 실패시키지 않는다.
    console.error("구글시트 동기화 실패:", err.message);
  }
}
