#!/usr/bin/env bash
# ======================================================
# WSL/Git Bash React build (LF line endings)
# ======================================================

set -e

# Resolve project directories relative to this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REACT_DIR="$PROJECT_ROOT/be-smart"

cd "$REACT_DIR"

# Install dependencies (explicit list kept identical to original)
DEPENDENCIES="react-loading-skeleton react-google-button jwt-decode tailwindcss @tailwindcss/vite google-one-tap react-icons react-router-dom @supabase/supabase-js motion usehooks-ts jwt-decode bcrypt"

echo "Installing React modules (WSL)..."
if [ -n "$DEPENDENCIES" ]; then
    npm install $DEPENDENCIES
else
    npm install
fi

echo "Building React app (WSL)..."
npm run build
echo "React build completed successfully (WSL)."


