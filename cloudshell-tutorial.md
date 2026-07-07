<walkthrough-tutorial-title>구글시트 연동 자동 설정</walkthrough-tutorial-title>

## 안녕하세요

이 튜토리얼은 OTO WEEKLY REPORT가 구글시트에 자동으로 백업 기록을 남길 수 있도록,
필요한 구글 클라우드 설정을 자동으로 만들어줍니다. 카드 등록이나 별도 가입 없이,
지금 로그인된 구글 계정으로 바로 진행됩니다.

아래 명령어 상자를 누르면 터미널에 자동으로 입력됩니다. **그다음 터미널을 클릭하고 Enter 키를 한 번 눌러주세요** (보안 정책상 실행은 직접 확인해야 합니다).

```bash
bash gcp-setup.sh
```

## 실행 결과 확인

1분 정도 걸립니다. 끝나면 `key.json` 파일이 자동으로 **내 컴퓨터 다운로드 폴더로 다운로드**됩니다 (별도 복사 필요 없음). 다운로드 허용 팝업이 뜨면 "허용"을 눌러주세요.

## 다음 할 일

1. 다운로드 폴더에서 `key.json`을 메모장으로 열어서 전체 내용을 복사하세요
2. Cloudflare 대시보드 → 내 Pages 프로젝트 → Settings → Variables and secrets → Add
   - Type: Secret
   - Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - Value: 방금 복사한 내용
3. 저장 후 재배포 (Deployments 탭 → 최신 배포 옆 "Retry deployment")

<walkthrough-conclusion-trophy></walkthrough-conclusion-trophy>

## 완료

이제 이 터미널은 닫으셔도 됩니다. `GOOGLE_SETUP.md`의 나머지 단계(내 이메일 등록)만 마저 진행해주세요.
