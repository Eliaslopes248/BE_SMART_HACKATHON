#!/usr/bin/env bash
# Build both frontend and backend using LF-only scripts (for WSL/Git Bash)

set -e

echo "Building React app (WSL)..."
bash ./scripts/wsl_build_react.sh

echo "Building server (WSL)..."
bash ./scripts/wsl_build_server.sh

echo "\nAll builds completed."
echo "If the server is running in the foreground, use Ctrl+C to stop it."


