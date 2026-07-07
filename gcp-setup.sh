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
echo "완료! 아래 내용 전체를 복사해서"
echo "Cloudflare Pages 프로젝트 -> Settings -> Variables and secrets"
echo "-> GOOGLE_SERVICE_ACCOUNT_KEY (Secret) 에 붙여넣으세요."
echo "=================================================="
echo ""
cat key.json
echo ""
echo "=================================================="
echo "다 붙여넣으셨으면, 이 key.json 파일은 지우는 걸 추천합니다:"
echo "rm key.json"
echo "=================================================="
