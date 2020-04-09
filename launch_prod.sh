#!/bin/bash
# Author:   Andy Horn
# Description: Launch the application and dependencies in production mode

# Get sudo permissions
sudo echo

# Launch the host-side listener
echo Launching host listener...
sudo node ./local/index.js & > ./local/listen.log
echo Done!

# Launch the Docker containers
echo Launching app...
docker-compose -f docker-compose.yml up -d --build
echo Done!