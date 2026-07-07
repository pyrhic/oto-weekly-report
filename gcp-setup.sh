#!/bin/bash
set -e

PROJECT_ID="oto-report-$RANDOM"
echo "새 프로젝트를 만듭니다: $PROJECT_ID"

gcloud projects create "$PROJECT_ID" --name="OTO Weekly Report"
gcloud config set project "$PROJECT_ID"

echo "구글시트/드라이브 API를 켭니다..."
gcloud services enable sheets.googleapis.com drive.googleapis.com

echo "로봇 계정(서비스 계정)을 만듭니다..."
gcloud iam service-accounts create report-bot --display-name="OTO Report Bot"

SA_EMAIL="report-bot@${PROJECT_ID}.iam.gserviceaccount.com"

echo "비밀키를 발급받습니다..."
gcloud iam service-accounts keys create key.json --iam-account="$SA_EMAIL"

echo ""
echo "=================================================="
echo "완료! key.json 파일을 내 컴퓨터로 다운로드합니다..."
echo "=================================================="
cloudshell download key.json
echo ""
echo "다운로드 폴더에서 key.json 파일을 메모장으로 열어서"
echo "전체 내용을 복사한 뒤 Cloudflare Pages 프로젝트 -> Settings ->"
echo "Variables and secrets -> GOOGLE_SERVICE_ACCOUNT_KEY (Secret) 에 붙여넣으세요."
echo ""
echo "다 하셨으면 이 key.json 파일은 지우는 걸 추천합니다: rm key.json"
