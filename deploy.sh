#!/bin/bash

set -ex

function preflight_check() {
    # ディレクトリを保証
    local SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR" || exit 1

    # コミットされていることを保証
    local CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

    if [ "$CURRENT_BRANCH" != "main" ]; then
        echo "error: mainブランチ以外がチェックアウトされている" >&2
        exit 1
    fi

    if [ -n "$(git status --porcelain)" ]; then
        echo "error: コミットされていない変更がある" >&2
        exit 1
    fi
}

function create_tmp_dir() {
    local TMP_DIR=$(mktemp -d)
    echo "$TMP_DIR"
}

preflight_check

tmp_dir=$(create_tmp_dir)
npm ci
npm run build
cp -r dist/* $tmp_dir

git switch gh-pages
# rm -rf *
cp -r $tmp_dir/* .
git add .
git commit -m '[deploy]'
git push origin gh-pages

git switch main
