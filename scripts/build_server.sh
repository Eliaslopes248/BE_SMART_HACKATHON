#!/bin/bash
# ======================================================
# ADD ALL DEPENDENCIES TO THE $DEPENDENCIES VARIABLE
# ======================================================

# install list of server modules
DEPENDENCIES="" 

# make sure node server is init

# install all dependencies
echo "Installing modules...."
cd server_side
if [ -f package.json ]; then
    if [ -n "$DEPENDENCIES" ]; then
        npm install $DEPENDENCIES
    else
        npm install
    fi
fi

# run server
node server.js