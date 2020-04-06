# Pull the Node.js image
FROM node:13.12-buster

# Set the working directory
WORKDIR /usr/src/app

# Update the system programs
RUN apt-get update && apt-get install -y docker-compose

# Install nodemon to watch the files for changes
RUN npm install -g nodemon

# Copy the project package.json file
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the remaining application files
COPY . .

# Set the entrypoint command
CMD ["nodemon", "/usr/src/app/index.js"]