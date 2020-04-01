const FilePaths = require('../contracts/FilePaths');
const Docker = require('dockerode');
const { exec } = require('child_process');

function getContainersAsync(all = false) {
    let docker = new Docker();

    return new Promise((resolve, reject) => {
        docker.listContainers({ all })
            .then(containers => {
                resolve(containers);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

async function existsAsync(id) {
    return await getByIdAsync(id) !== null;
}

async function getNameFromIdAsync(id) {
    let container = await getByIdAsync(id);

    if (container === null || container === undefined) {
        return null;
    }

    return container.Labels["com.docker.compose.service"];
}

async function getByIdAsync(id) {
    console.log(`Searching for container with id ${id}`);
    let containers;
    try {
        containers = await getContainersAsync();
    }
    catch (e) {
        return null;
    }

    let container = containers.find(c => c.Id === id);
    console.log(`Container found:`);
    console.log(container);
    return container;
}

async function getByNameAsync(name) {
    console.log(`Searching for container with name: ${name}`);
    let containers = await getContainersAsync() || null;
    console.log(containers);

    if (containers === null) {
        return null;
    }

    let container = containers.find(c => c.Labels["com.docker.compose.service"] === name);
    return container || null;
}

async function copyFilesTo(directory, name) {
    console.log("Copying...");

    let containers = await getContainersAsync(true);
    let container = containers.find(c => c.Labels["com.docker.compose.service"] === name) || null;
    console.log("Container:");
    console.log(container);

    if (container === null) {
        return false;
    }

    let command = `docker cp ${directory}/. ${container.Id}:${FilePaths.containerLicenseLocation}`;

    return new Promise((resolve, reject) => {
        exec(command, (err, stdout) => {
            if (err) {
                console.log(err);
                return reject(err);
            }

            return resolve(true);
        });
    });
}

async function stopContainerAsync(id) {
    console.log("Stopping...");
    let exists = await existsAsync(id);

    if (!exists) {
        console.log("Error: Container does not exist.");
        return false;
    }

    return new Promise((resolve, reject) => {
        let command = `docker rm -f ${id}`;
        exec(command, (err, stdout) => {
            if (err) {
                console.log("Error stopping container:");
                console.log(err);
                return resolve(false);
            }

            console.log(stdout);
            return resolve(true);
        });
    });
}

module.exports = { 
    getContainersAsync, 
    getByIdAsync, 
    stopContainerAsync, 
    getNameFromIdAsync, 
    existsAsync,
    copyFilesTo,
    getByNameAsync
};