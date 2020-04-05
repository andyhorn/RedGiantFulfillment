#!/bin/bash

# Launch/Relaunch the development versions of the Docker containers
# To rebuild, simply add "--build" to the end of "launch_dev.sh"
# For example: "./launch_dev.sh" will launch/relaunch the containers
# "./launch_dev.sh --build" will force-rebuild the containers
WEB_PORT=80:8080 docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d $1