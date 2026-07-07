# 구글시트 연동 설정하기 (선택 사항, AI 도움 없이 혼자 따라 하기)

이 단계를 안 해도 앱은 정상 작동합니다 (Cloudflare D1에 저장됨). 이건 **추가로 구글시트에도 자동 백업**하고 싶을 때만 하면 됩니다. 약 5분 걸립니다.

## 1. 자동 설정 스크립트 실행하기

아래 버튼을 누르면 Google Cloud Shell(브라우저 터미널)이 열립니다. 지금 로그인된 구글 계정 그대로 진행되고, 카드 등록이나 별도 가입은 필요 없습니다.

[![Open in Cloud Shell](https://gstatic.com/cloudssh/images/open-btn.svg)](https://shell.cloud.google.com/cloudshell/open?cloudshell_git_repo=https://github.com/pyrhic/oto-weekly-report&cloudshell_tutorial=cloudshell-tutorial.md)

열리면 화면에 나오는 안내(튜토리얼 패널)를 따라 `bash gcp-setup.sh` 명령어를 실행하세요. 1분 정도 걸리고, 끝나면 `{ "type": "service_account", ... }`로 시작하는 열쇠(키) 텍스트가 나옵니다.

(버튼이 안 열리면 수동으로도 가능합니다: `console.cloud.google.com` 접속 → 오른쪽 위 터미널 아이콘 클릭 → 이 레포의 `gcp-setup.sh` 내용을 복사해서 붙여넣기)

## 2. Cloudflare에 등록하기

1. 방금 나온 `{ ... }` 전체를 복사
2. Cloudflare 대시보드 → 내 Pages 프로젝트 → Settings → Variables and secrets → Add
   - Type: **Secret**
   - Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - Value: 방금 복사한 내용
3. Save (저장 후 재배포 필요 — Deployments 탭에서 최신 배포 옆 "Retry deployment")

## 3. 내 이메일 등록해서 시트를 나도 볼 수 있게 하기

서비스 계정이 시트를 "대신" 만들어주는데, 그대로 두면 나는 그 시트를 못 봐요. 내 이메일에도 권한을 주도록 설정해야 합니다.

1. Cloudflare 대시보드 → 내 D1 데이터베이스 → **Console** 탭
2. 아래 SQL 실행 (본인 구글 이메일로 바꿔서):

```sql
insert into settings (key, value) values ('owner_email', 'my-email@gmail.com');
```

## 4. 완료

이제부터 사이트에서 "오늘 업무 입력"을 저장하면, Cloudflare D1뿐 아니라 구글시트에도 자동으로 기록됩니다. 처음 한 번 저장할 때 시트가 자동으로 만들어지고, 등록한 이메일로 공유됩니다 (구글 드라이브에서 "OTO WEEKLY REPORT 업무일지"라는 이름으로 찾을 수 있어요).
