const FilePaths = require("../contracts/FilePaths");
const FileHandler = require("./FileHandler");
const PortManager = require("./PortManager");
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
    this.services = [];
    const fileData = FileHandler.readData(COMPOSE_FILE);
    const yamlData = yaml.parse(fileData);

    console.log("Initializing Compose Configuration.");
    console.log("Services:");
    console.log(yamlData.services);

    if (yamlData.services === null) {
      return;
    }

    for (let key of Object.keys(yamlData.services)) {
      let service = yamlData.services[key];
      this.services.push(service);
    }

    console.log("Initialized!");
    console.log(this);
  }

  async addService(name) {
    // Read the config file
    this.read();

    // If the service already exists, do not create a new one
    if (this.serviceExists(name)) {
      console.log("Service already configured");
      return false;
    }

    // If the service does not exist, create a new service object
    console.log("Adding new service");
    let service = await getService(name);

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

    console.log("Removed! Configuration now:");
    console.log(this.services);

    // Write to the configuration file
    this.write();
  }

  up(name) {
    let command = `docker-compose -f ${COMPOSE_FILE} up -d --build ${name}`;

    console.log(`Building and starting container ${name}`);
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.log("Error building/starting container:");
          console.log(err);
          return resolve(false);
        }

        return resolve(true);
      });
    });
  }

  restart(name) {
    let command = `docker-compose -f ${COMPOSE_FILE} restart ${name}`;

    return new Promise((resolve, reject) => {
      exec(command, (err, stdout) => {
        if (err) {
          console.log("Unable to restart container");
          console.log(err);
          return resolve(false);
        }

        return resolve(true);
      })
    })
  }

  getIsvPortFor(name) {
    console.log(`Getting ISV port for ${name}`);

    if (this.services === null) {
      return null;
    }

    console.log(this.services);

    let service = this.services.find(s => s.container_name === name);
    console.log("Service found:");
    console.log(service);

    let ports = service.ports;
    let isvPort = ports[2].split(":")[0];

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
}

async function getService(name) {
  let newService = {};

  let ports = await PortManager.getPorts(3);
  let servicePorts = [
    `${ports[0]}:5053`,
    `${ports[1]}:5054`,
    `${ports[2]}:${ports[2]}`
  ];

  newService.container_name = name;
  newService.ports = servicePorts;
  newService.hostname = name;
  newService.mac_address = "12:34:56:78:90:AB";
  newService.image = "andyhorn/redgiant-rlm:stable";
  newService.healthcheck = {
    test: `curl -f localhost:5054 || exit 1`,
    interval: "2m",
    timeout: "10s",
    retries: 3
  };
  newService.restart = "unless-stopped";
  return newService;
}

module.exports = DockerCompose;
