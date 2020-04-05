#!/bin/bash

# Launch the production versions of the Docker containers
WEB_PORT=80:80 docker-compose up -d --build