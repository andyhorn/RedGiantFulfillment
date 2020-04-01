const express = require("express");
const Docker = require("dockerode");
const FileHandler = require("../../utils/FileHandler");
const DockerCompose = require("../../utils/DockerCompose");
const DockerManager = require('../../utils/DockerManager');

const compose = new DockerCompose();

const multer = require("multer");
const upload = multer({
  dest: "./uploads/"
});
const app = express.Router();

app.get("/", async (req, res) => {
  console.log("Retrieving list of running containers");
  try {
    let containers = await DockerManager.getContainersAsync();
    containers = containers.filter(c => {
        let label = c.Labels["com.docker.compose.service"];
        return label !== "frontend" && label !== "backend";
    });
    res.send(JSON.stringify(containers));
  }
  catch (e) {
    console.log("Error retrieving list:");
    console.log(e);
    res.statusCode = 500;
    res.send(null);
  }
});

app.post(
  "/",
  upload.fields([{ name: "name" }, { name: "files" }]),
  async (req, res) => {
    console.log(req);
    let name = req.body.name;
    let files = req.files.files;

    console.log(`POST received for service: ${name}`);
    console.log(files);

    let success = await require('../../utils/StartService')(name, files);

    if (success) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  }
);

app.delete("/:id", async (req, res) => {
    let id = req.params.id;
    console.log(`Received delete request for id ${id}`);

    let exists = DockerManager.existsAsync(id);

    if (!exists) {
        console.log("Container not found with that ID");
        return res.sendStatus(404);
    }

    console.log("Container found!");
    let name = await DockerManager.getNameFromIdAsync(id);
    console.log(`Container name: ${name}`);
    
    console.log("Stopping container...");
    let stopped = await DockerManager.stopContainerAsync(id);
    if (stopped !== true) {
        console.log("Error: Unable to stop container");
        return res.sendStatus(500);
    }

    let deleted = await DockerManager.deleteImageAsync(name);
    if (!deleted) {
      console.log("Error: Unable to delete image");
      return res.sendStatus(500);
    }
    console.log("Stopped!");

    console.log("Removing from configuration...");
    compose.removeService(name);
    // compose.write();
    console.log("Done!");

    console.log("Deleting license files...");
    FileHandler.deleteLicenseFiles(name);
    console.log("Done!");

    res.sendStatus(200);
});

module.exports = app;
