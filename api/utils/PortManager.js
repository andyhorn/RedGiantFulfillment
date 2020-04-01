const DockerManager = require('./DockerManager');
const FileHandler = require('./FileHandler');
const DockerCompose = require('./DockerCompose');
const yaml = require('yaml');
const FilePaths = require('../contracts/FilePaths');
const path = require('path');

const MIN_PORT = 5000;
const MAX_PORT = 50000;

async function getPorts(num) {
    let ports = [];
    
    let containerPorts = await getContainerPorts();
    let servicePorts = getServicePorts();
    let takenPorts = [];
    takenPorts.push(...containerPorts);
    takenPorts.push(...servicePorts);
    console.log("Currently taken ports:");
    console.log(takenPorts);
    // let takenPorts = containerPorts.push(...servicePorts);

    for (let i = 0; i < num; i++) {
        let unusedPort = findUnusedPort(takenPorts);
        ports.push(unusedPort);
        takenPorts.push(unusedPort);
    }

    return ports;
}

function findUnusedPort(takenPorts) {
    console.log("Finding unused ports...");
    console.log("Current ports in use:");
    console.log(takenPorts)
    for (let i = MIN_PORT; i < MAX_PORT; i++) {
        if (!takenPorts.includes(i)) {
            console.log(`Port ${i} is available, returning.`);
            return i;
        }
    }
}

async function getContainerPorts() {
    let ports = [];
    let containers;

    console.log("Getting public ports of running containers...");
    try {
        console.log("Getting running containers...");
        containers = await DockerManager.getContainersAsync();
        console.log("Done!");
    }
    catch (e) {
        console.log("Unable to find running containers");
        console.log(e);
        return ports;
    }

    console.log("Finding ports from containers...");
    for (let container of containers) {
        console.log(container.Ports);
        let containerPorts = container.Ports.map(x => Number(x.PublicPort));
        console.log("Found ports:");
        console.log(containerPorts);

        ports.push(...containerPorts);
    }

    console.log("Complete!")
    return ports;
}

function getServicePorts() {
    let ports = [];

    console.log("Getting ports from configured services...");
    // const composeData = yaml.parse(path.join(FilePaths.appData, 'docker-compose.yml'));
    const fileData = FileHandler.readData(path.join(FilePaths.appData, 'docker-compose.yml'));
    const composeData = yaml.parse(fileData);

    if (composeData.services === null) {
        console.log("No services configured.");
        return ports;
    }

    console.log("Getting Public Ports from each service...")
    for (let key of Object.keys(composeData.services)) {
        let service = composeData.services[key];
        let servicePorts = service.ports.map(x => Number(x.split(":")[0]));
        console.log("Found configured ports:");
        console.log(servicePorts);
        ports.push(...servicePorts);
    }

    console.log("Complete!");
    return ports;
}

module.exports = { getPorts };