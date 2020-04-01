# Pull the Node.js image
FROM node:13.12-buster

# Set the working directory
WORKDIR /usr/src/app

# Update the system programs
# RUN apk update && apk upgrade && apk add --update nodejs nodejs-npm
RUN apt-get update && apt-get install -y docker-compose

# Install nodemon to watch the files for changes
RUN npm install -g nodemon

# Copy the project package.json file
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the remaining application files
COPY . .

# Expose the web port
# EXPOSE 8080

# Set the entrypoint command
CMD ["nodemon", "/usr/src/app/index.js"]