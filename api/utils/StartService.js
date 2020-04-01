const DockerCompose = require('./DockerCompose');
const DockerManager = require('./DockerManager');
const FilePaths = require('../contracts/FilePaths');
const FileHandler = require('./FileHandler');
const path = require('path');
const fs = require('fs');

const compose = new DockerCompose();

async function addService(name) {
    console.log(`Adding service: ${name}`);
    
    // Add the service to the configuration
    await compose.addServiceAsync(name);
}

async function copyFiles(name) {
    console.log("Copying license files into container...");

    // Get the license directory for the given service name
    let fileDir = path.join(FilePaths.licenseStore, name);

    // Initialize a flag
    let copied;
    try {
        // Attempt to copy the files; If copied, the flag will
        // change to true
        copied = await DockerManager.copyFilesTo(fileDir, name);
    }
    catch (e) {
        console.log("Error copying files:");
        console.log(e);
        copied = false; // Explicitly set the flag to false
    }

    console.log(`Done! Files copied? ${copied}`);
    return copied;
}

function updateIsvPorts(name, port) {
    // Get the license directory for the given service name
    let fileDir = path.join(FilePaths.licenseStore, name);

    // Loop through each file in the directory and update
    // it with the given ISV port
    for (let file of fs.readdirSync(fileDir)) {
        let fullPath = path.join(fileDir, file);
        console.log(`Updating ISV in file: ${fullPath}`);
        updateIsvPort(fullPath, port);
    }
}

function updateIsvPort(file, port) {
    // Create the new configuration line
    let isvLine = `ISV redgiant port=${port}`;

    // Read the file data as a string
    let fileData = fs.readFileSync(file, "utf-8");

    // Replace the configuration line
    fileData = fileData.replace(/ISV redgiant/g, isvLine);

    // Write the data back to the file
    fs.writeFileSync(file, fileData);
}

async function launch(name) {
    console.log("Launching service...");

    // Launch the service
    let launched = await compose.upAsync(name);
    return launched;
}

async function restart(name) {
    console.log("Restarting service...");

    // Restart the service
    let restarted = await compose.restartAsync(name);
    return restarted;
}

module.exports = async function(name, files) {
    console.log("Files posted, processing...");

    // Process the new license files
    console.log("Copying license files...");
    FileHandler.processLicenses(files, name);
    console.log("Copied!");

    // Configure the compose service
    await addService(name);

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