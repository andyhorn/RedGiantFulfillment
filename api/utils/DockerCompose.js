const FilePaths = require("../contracts/FilePaths");
const FileHandler = require("./FileHandler");
const ServiceFactory = require('./ServiceFactory');
const path = require("path");
const yaml = require("yaml");
const { exec } = require("child_process");

const COMPOSE_VERSION = "3";
const COMPOSE_FILE = path.join(FilePaths.appData, "docker-compose.yml");

class DockerCompose {
  constructor() {
    this.read();
  }

  read() {
    // Initialize a service array
    this.services = [];

    // Read the file data
    const fileData = FileHandler.readData(COMPOSE_FILE);

    // Parse the yaml file into a JSON object
    const yamlData = yaml.parse(fileData);

    console.log("Reading Compose Configuration...");

    // If no services exist in configuration, reading is done
    if (yamlData.services === null) {
      return;
    }

    // Read the services from the YAML file and store the services
    // in the services array
    for (let key of Object.keys(yamlData.services)) {
      let service = yamlData.services[key];
      this.services.push(service);
    }

    console.log("Done!");
    console.log(this);
  }

  async addServiceAsync(name) {
    // Read the config file
    this.read();

    // If the service already exists, do not create a new one
    if (this.serviceExists(name)) {
      console.log("Service already configured");
      return false;
    }

    // If the service does not exist, create a new service object
    console.log("Adding new service");
    // let service = await getService(name);
    let service = await ServiceFactory.create(name);

    // Add the new service to the configuration
    this.services.push(service);

    // Write the configuration file
    this.write();

    // Return 'success'
    return true;
  }

  removeService(name) {
    // Read the configuration file
    this.read();
    console.log(`Removing service ${name}`);

    // If the service does not exist, return
    if (!this.serviceExists(name)) {
      console.log("Service not found in configuration");
      return;
    }
    console.log("Service found in configuration, removing...");

    // If there is only one service, reset the array
    if (this.services.length === 1) {
      this.services = [];
    } else {
      // If there is more than one service, find the index
      let index = this.indexOf(name);
      this.services = this.services.splice(index, 1);
    }
    console.log("Done!");

    // Write to the configuration file
    this.write();
  }

  upAsync(name) {
    let command = `docker-compose -f ${COMPOSE_FILE} up -d --build ${name}`;

    console.log(`Building and starting container ${name}`);
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.log("Error building/starting container:");
          console.log(err);
          return resolve(false);
        }

        console.log("Done!");
        return resolve(true);
      });
    });
  }

  restartAsync(name) {
    let command = `docker-compose -f ${COMPOSE_FILE} restart ${name}`;

    console.log(`Restarting container ${name}`);
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout) => {
        if (err) {
          console.log("Unable to restart container");
          console.log(err);
          return resolve(false);
        }

        console.log("Done!");
        return resolve(true);
      })
    })
  }

  getIsvPortFor(name) {
    // Read the configuration file
    this.read();
    console.log(`Getting ISV port for ${name}`);

    if (this.services === null) {
      return null;
    }

    // Get the service object
    let service = this.getService(name);

    // Get the ports from the service
    let ports = service.ports;

    // Parse the ISV port
    let isvPort = ports[2].split(":")[0];
    console.log(`Found ISV port: ${isvPort}`);

    return isvPort;
  }

  write() {
    let data = {
      version: COMPOSE_VERSION,
      services: null
    };

    if (this.services.length !== 0) {
      data.services = {};

      for (let service of this.services) {
        let name = service.container_name;
        data.services[name] = service;
      }
    }

    let fileData = yaml.stringify(data);
    console.log("Writing compose data:");
    console.log(fileData);

    FileHandler.writeData(
      fileData,
      path.join(FilePaths.appData, "docker-compose.yml")
    );
  }

  serviceExists(name) {
    if ((this.services === null || this.services === undefined) || this.services.length === 0) {
      return false;
    }

    let service = this.services.find(s => s.container_name === name);
    return service !== undefined;
  }

  indexOf(name) {
    if (this.serviceExists(name)) {
      return this.services.indexOf(s => s.container_name === name);
    }

    return -1;
  }

  getService(name) {
    if (!this.serviceExists(name)) {
      return null;
    }

    return this.services.find(c => c.container_name === name);
  }
}

module.exports = DockerCompose;
