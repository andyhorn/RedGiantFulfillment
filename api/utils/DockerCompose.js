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
    this.services = [];
    this.init();
  }

  init() {
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
      service.name = key;
      this.services.push(service);
    }

    console.log("Initialized!");
    console.log(this);
  }

  async addService(name) {
    if (this.services === undefined) {
      this.services = [];
    }

    let service = await getService(name);
    this.services.push(service);
  }

  async restart(name) {
    let command = `docker-compose -f ${COMPOSE_FILE} restart ${name}`;

    return new Promise((resolve, reject) => {
      exec(command, (err, stdout) => {
        if (err) {
          console.log(err);
          return reject();
        }

        return resolve(stdout);
      });
    });
  }

  removeService(name) {
    if (this.services === undefined || this.services === null) {
      return;
    }

    let index = this.services.indexOf(x => x.name === name);

    if (index === -1) {
      return;
    }

    this.services.splice(index, 1);
  }

  up(name) {
    let command = `docker-compose -f ${COMPOSE_FILE} up -d --build ${name}`;

    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          return reject(err);
        }

        return resolve(stdout);
      });
    });
  }

  build(name) {
    let command = `docker-compose -f ${COMPOSE_FILE} build ${name}`;

    return new Promise((resolve, reject) => {
      exec(command, (err, stdout) => {
        if (err) {
          return reject(err);
        }

        return resolve(stdout);
      });
    });
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
      services: {}
    };

    if (this.services === undefined) {
      return;
    }

    for (let service of this.services) {
      let name = service.name;
      delete service.name;
      data.services[name] = service;
    }

    let fileData = yaml.stringify(data);
    console.log("Writing compose data:");
    console.log(fileData);

    FileHandler.writeData(
      fileData,
      path.join(FilePaths.appData, "docker-compose.yml")
    );
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

  newService.name = name;
  newService.container_name = name;
  newService.ports = servicePorts;
  newService.hostname = name;
  newService.mac_address = "12:34:56:78:90:AB";
  newService.image = "andyhorn/redgiant-rlm:stable";
  newService.volumes = [
    `/usr/src/rlm/licenses/${name}:/usr/share/rlm/licenses`
  ];
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
