#!/bin/bash

git init
echo "green" > green.txt
git add green.txt

start_date="2023-01-01"
end_date="2025-12-31"

current="$start_date"

while [ "$current" != "$(date -I -d "$end_date + 1 day")" ]; do
  echo "$current" >> green.txt
  git add green.txt
  GIT_AUTHOR_DATE="$current 12:00:00" \
  GIT_COMMITTER_DATE="$current 12:00:00" \
  git commit -m "commit on $current"
  current=$(date -I -d "$current + 1 day")
done
