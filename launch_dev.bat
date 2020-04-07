@ECHO OFF

rem Author:         Andy Horn
rem Description:    Launch/relaunch the development version
rem                 To rebuild, add "--build" to the end of the call
rem                 Example: "./launch_dev.bat --build"

echo Launching host listener...
START /b node ./local/index.js > ./local/log.log
echo Done!

echo Launching app in development mode...
rem Set the web port
SET WEB_PORT=80:8080
rem Launch the Docker containers
docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml up -d
echo Done!