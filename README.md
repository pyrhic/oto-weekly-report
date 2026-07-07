# OTO WEEKLY REPORT

매일 한 일을 입력하면 주간보고서로 자동 정리해주는 아주 작은 도구입니다.
**Cloudflare 계정 하나면 됩니다** (구글시트, Supabase 등 다른 외부 서비스 필요 없음).

연대지능(Solidarity Intelligence) 정신에 따라, 이 코드를 그대로 복사해서 **각자 자기 것으로 직접 길러서** 쓰는 걸 전제로 만들었습니다.

## 왜 이렇게 만들었나

- 폰으로 오늘 한 일을 적으면 → Cloudflare에 저장
- "이번 주 보고서 만들기" 누르면 → 이번 주에 적은 것들을 모아서 문체만 다듬어 정리 (Cloudflare 내장 AI 사용, 별도 API 키 필요 없음)
- 위키나 다른 곳에 공유하고 싶으면 `reports.html`에서 계속 쌓인 기록을 볼 수 있음

## 셋업 방법 (약 10분)

### 1. 이 레포를 자기 GitHub 계정으로 복사(Fork)
오른쪽 위 "Fork" 버튼

### 2. Cloudflare Pages 프로젝트 만들기
1. https://dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git
2. 방금 fork한 레포 선택
3. Build settings는 비워두고 그대로 배포 (정적 파일이라 빌드 명령 필요 없음)

### 3. D1 데이터베이스 만들기
1. Cloudflare 대시보드 → Storage & Databases → D1 → Create database
2. 이름은 아무거나 (예: `oto-weekly-report-db`)
3. 만들어진 DB의 콘솔(Console) 탭에서 이 레포의 `schema.sql` 내용을 복사해서 실행

### 4. D1을 Pages 프로젝트에 연결
1. 방금 만든 Pages 프로젝트 → Settings → Bindings → "+ Add" (화면 구성이 바뀌어 "Functions" 대신 "Bindings"라는 이름일 수 있음)
2. D1 database 선택 → Variable name: `DB` / D1 database: 방금 만든 것 선택

### 5. (선택) AI 바인딩 연결
같은 Bindings 화면에서 "+ Add" → Workers AI 선택 → Variable name: `AI`
(이게 있어야 문체 다듬기가 작동하고, 없어도 원문 그대로 저장은 됩니다)

**⚠️ 바인딩을 추가/저장한 뒤에는 반드시 한 번 재배포해야 적용됩니다.** (Deployments 탭에서 최신 배포 옆 "Retry deployment"를 누르거나, 아무 커밋이나 하나 push하면 됩니다.)

### 6. 관리자 비밀번호 설정 (창고/삭제 기능 쓸 경우)
Settings → Variables and secrets → `ADMIN_PASSWORD` (Secret 타입)으로 원하는 비밀번호 추가

### 7. 완료
`https://프로젝트이름.pages.dev` 접속해서 확인

## 구조
- `index.html`, `daily-log.html`, `reports.html` — 화면
- `functions/api/submit-log.js` — 오늘 업무 저장
- `functions/api/generate-report.js` — 이번 주 보고서 조립 (AI로 문체 다듬기 포함)
- `functions/api/reports.js` — 저장된 보고서 목록 조회
- `schema.sql` — D1 테이블 구조
