# 구글시트 연동 설정하기 (선택 사항, AI 도움 없이 혼자 따라 하기)

이 단계를 안 해도 앱은 정상 작동합니다 (Cloudflare D1에 저장됨). 이건 **추가로 구글시트에도 자동 백업**하고 싶을 때만 하면 됩니다. 약 10분 걸립니다.

## 1. 구글 클라우드 프로젝트 만들기

1. 접속: https://console.cloud.google.com/projectcreate
2. Project name에 원하는 이름 입력 (예: `oto-report-자기이름`)
3. **Create** 클릭, 몇 초 기다린 후 화면 상단에서 방금 만든 프로젝트로 전환

## 2. Google Sheets API 켜기

1. 접속: https://console.cloud.google.com/apis/library/sheets.googleapis.com
2. (지금 만든 프로젝트가 선택된 상태인지 화면 위에서 확인)
3. **Enable** 클릭

## 3. Google Drive API도 켜기

1. 접속: https://console.cloud.google.com/apis/library/drive.googleapis.com
2. **Enable** 클릭
   (시트를 새로 만들고 나에게 공유 권한을 주는 데 필요합니다)

## 4. 서비스 계정 만들기

1. 접속: https://console.cloud.google.com/iam-admin/serviceaccounts/create
2. Service account name: 아무 이름 (예: `report-bot`)
3. **Create and continue** → 역할 부여 화면은 건너뛰고 **Continue** → **Done**

## 5. 키 파일(JSON) 발급받기

1. 접속: https://console.cloud.google.com/iam-admin/serviceaccounts
2. 방금 만든 계정 클릭 → 상단 **KEYS** 탭
3. **ADD KEY → Create new key → JSON → Create**
4. JSON 파일이 다운로드됩니다. **이 파일은 비밀번호와 같으니 다른 사람에게 보여주지 마세요.**

## 6. Cloudflare에 등록하기

1. 다운로드된 JSON 파일을 메모장으로 열어서 전체 내용을 복사
2. Cloudflare 대시보드 → 내 Pages 프로젝트 → Settings → Variables and secrets → Add
   - Type: **Secret**
   - Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - Value: 방금 복사한 JSON 전체 내용
3. Save (저장 후 재배포 필요 — Deployments 탭에서 최신 배포 옆 "Retry deployment")

## 7. 내 이메일 등록해서 시트를 나도 볼 수 있게 하기

서비스 계정이 시트를 "대신" 만들어주는데, 그대로 두면 나는 그 시트를 못 봐요. 내 이메일에도 권한을 주도록 설정해야 합니다.

1. Cloudflare 대시보드 → 내 D1 데이터베이스 → **Console** 탭
2. 아래 SQL 실행 (본인 구글 이메일로 바꿔서):

```sql
insert into settings (key, value) values ('owner_email', 'my-email@gmail.com');
```

## 8. 완료

이제부터 사이트에서 "오늘 업무 입력"을 저장하면, Cloudflare D1뿐 아니라 구글시트에도 자동으로 기록됩니다. 처음 한 번 저장할 때 시트가 자동으로 만들어지고, 등록한 이메일로 공유됩니다 (구글 드라이브에서 "OTO WEEKLY REPORT 업무일지"라는 이름으로 찾을 수 있어요).
