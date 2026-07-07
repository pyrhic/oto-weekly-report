<walkthrough-tutorial-title>구글시트 연동 자동 설정</walkthrough-tutorial-title>

## 안녕하세요

이 튜토리얼은 OTO WEEKLY REPORT가 구글시트에 자동으로 백업 기록을 남길 수 있도록,
필요한 구글 클라우드 설정을 자동으로 만들어줍니다. 카드 등록이나 별도 가입 없이,
지금 로그인된 구글 계정으로 바로 진행됩니다.

아래 명령어를 클릭하면 오른쪽(또는 아래쪽) 터미널에 자동으로 입력됩니다. Enter만 눌러주세요.

```bash
bash gcp-setup.sh
```

## 실행 결과 확인

1분 정도 걸립니다. 끝나면 화면에 `{ "type": "service_account", ... }`로 시작하는
긴 텍스트가 나옵니다. 이게 필요한 열쇠(키)입니다.

## 다음 할 일

1. 방금 나온 `{ ... }` 전체를 복사하세요
2. Cloudflare 대시보드 → 내 Pages 프로젝트 → Settings → Variables and secrets → Add
   - Type: Secret
   - Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - Value: 방금 복사한 내용
3. 저장 후 재배포 (Deployments 탭 → 최신 배포 옆 "Retry deployment")

<walkthrough-conclusion-trophy></walkthrough-conclusion-trophy>

## 완료

이제 이 터미널은 닫으셔도 됩니다. `GOOGLE_SETUP.md`의 나머지 단계(내 이메일 등록)만 마저 진행해주세요.
