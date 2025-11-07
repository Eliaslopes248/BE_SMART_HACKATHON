#!/usr/bin/env bash
# ======================================================
# WSL/Git Bash server build (LF line endings)
# ======================================================

set -e

# Resolve project root relative to this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SERVER_DIR="$PROJECT_ROOT/server_side"

cd "$SERVER_DIR"

# Install server dependencies (kept identical to original)
DEPENDENCIES="express body-parser url path fs dotenv cors google-auth-library jsonwebtoken bcrypt @aws-sdk/client-bedrock-runtime @aws-sdk/client-rds @aws-sdk/credential-providers mysql2 redis"

echo "Installing server modules (WSL)..."
if [ -f package.json ]; then
    if [ -n "$DEPENDENCIES" ]; then
        npm install $DEPENDENCIES
    else
        npm install
    fi
fi

# Match original behavior: start the server in development mode
export NODE_ENV=${NODE_ENV:-development}
echo "Running server in ${NODE_ENV} mode (WSL)..."

# Prefer Linux Node; if missing, fall back to Windows Node
if command -v node >/dev/null 2>&1; then
    NODE_BIN="node"
elif [ -x "/mnt/c/Program Files/nodejs/node.exe" ]; then
    NODE_BIN="/mnt/c/Program Files/nodejs/node.exe"
elif [ -x "/mnt/c/Program Files (x86)/nodejs/node.exe" ]; then
    NODE_BIN="/mnt/c/Program Files (x86)/nodejs/node.exe"
else
    echo "Error: Node.js not found in WSL, and Windows Node.exe not found."
    echo "Install Node in WSL (recommended):"
    echo "  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
    echo "  source ~/.nvm/nvm.sh && nvm install --lts && nvm use --lts"
    echo "Or install Node for Windows and ensure it's at /mnt/c/Program Files/nodejs/node.exe"
    exit 127
fi

"$NODE_BIN" server.js


