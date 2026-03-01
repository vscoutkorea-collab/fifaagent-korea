#!/bin/bash
cd /Users/limwonbin/.verdent/verdent-projects/new-project
git add .
CHANGES=$(git diff --cached --name-only)
if [ -z "$CHANGES" ]; then
  echo "변경사항 없음"
else
  git commit -m "update $(date '+%Y-%m-%d %H:%M')"
  git push
  echo "✅ 배포 완료"
fi
