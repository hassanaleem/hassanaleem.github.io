#!/usr/bin/env bash
# Deploy a committed version of the site to people.cs.vt.edu/mhassan01.
# Usage: scripts/deploy.sh [commit]   (defaults to HEAD)
set -euo pipefail

REMOTE="mhassan01@rlogin.cs.vt.edu"
REMOTE_DIR="/web/people/mhassan01"
SSH_KEY="${RLOGIN_SSH_KEY_FILE:-$HOME/.ssh/rlogin_deploy}"
REV="${1:-HEAD}"

repo_root="$(git rev-parse --show-toplevel)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# Export exactly what is committed, not uncommitted edits in the working tree.
git -C "$repo_root" archive "$REV" | tar -x -C "$tmp"

echo "Deploying $(git -C "$repo_root" rev-parse --short "$REV") to $REMOTE:$REMOTE_DIR"
rsync -rltvz \
    --exclude '.github/' \
    --exclude 'scripts/' \
    --chmod=D755,F644 \
    -e "ssh -i $SSH_KEY -o BatchMode=yes" \
    "$tmp"/ "$REMOTE:$REMOTE_DIR/"
echo "Done: https://people.cs.vt.edu/mhassan01/"
