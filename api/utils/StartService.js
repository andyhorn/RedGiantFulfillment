const DockerCompose = require('./DockerCompose');
const DockerManager = require('./DockerManager');
const FilePaths = require('../contracts/FilePaths');
const FileHandler = require('./FileHandler');
const path = require('path');
const fs = require('fs');
const replace = require('replace');

const compose = new DockerCompose();

async function addService(name) {
    console.log("Adding service...");
    try {
        await compose.addService(name);
        compose.write();
    }
    catch (e) {
        console.log(e);
        return false;
    }

    return true;
}

async function build(name) {
    console.log("Building container...");
    try {
        await compose.build(name);
        console.log("Done!");
    }
    catch (e) {
        console.log(e);
        return false;
    }

    return true;
}

async function copyFiles(name) {
    console.log("Copying license files into container...");

    let fileDir = path.join(FilePaths.licenseStore, name);

    let copied = false;
    try {
        copied = await DockerManager.copyFilesTo(fileDir, name);
    }
    catch (e) {
        console.log(e);
        copied = false;
    }

    console.log(`Done! Files copied? ${copied}`);
    return copied;
}

function updateIsvPorts(name, port) {
    let fileDir = path.join(FilePaths.licenseStore, name);

    for (let file of fs.readdirSync(fileDir)) {
        let fullPath = path.join(fileDir, file);
        console.log(`Updating ISV in file: ${fullPath}`);
        updateIsvPort(fullPath, port);
    }
}

function updateIsvPort(file, port) {
    let isvLine = `ISV redgiant port=${port}`;

    let fileData = fs.readFileSync(file, "utf-8");

    fileData = fileData.replace(/ISV redgiant/g, isvLine);

    fs.writeFileSync(file, fileData);

    // let options = {
    //     regex: 'ISV redgiant',
    //     replacement: isvLine,
    //     paths: file
    // };

    // replace(options);
}

async function launch(name) {
    console.log("Launching service...");

    try {
        await compose.up(name);
        console.log("Done!");
    }
    catch (e) {
        console.log(e);
        return false;
    }

    return true;
}

async function restart(name) {
    console.log("Restarting service...");

    try {
        await compose.restart(name);
        console.log("Done!");
    }
    catch (e) {
        console.log(e);
        return false;
    }

    return true;
}

module.exports = async function(name, files) {
    console.log("Files posted, processing...");

    // Process the new license files
    console.log("Copying license files...");
    FileHandler.processLicenses(files, name);
    console.log("Copied!");

    // Configure the compose service
    if (!await addService(name)) {
        return false;
    }

    // Launch the container
    if (!await launch(name)) {
        return false;
    }

    // Update the ISV ports
    let port = compose.getIsvPortFor(name);
    updateIsvPorts(name, port);

    // Copy the license files to the container
    if (!await copyFiles(name)) {
        return false;
    }

    // Restart the container
    if (!await restart(name)) {
        return false;
    }

    return true;
}