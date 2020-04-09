# Author:       Andy Horn
# Description:  Sets up any missing dependencies

# Get sudo permissions
sudo echo

# Install Node.js and NPM if missing
sudo apt-get install -y nodejs npm

# Install the API dependencies
cd ./api
npm install

# Install the Web dependencies
cd ../web
npm install