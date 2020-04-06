const fs = require("fs");
const path = require("path");
const FilePaths = require("../contracts/FilePaths");

function processLicenses(fileList, name) {
  console.log("Copying licenses for " + name);
  resolveFullPath(fileList);

  // Create the path for this organization's licenses
  let destinationPath = getDestinationPath(name);
  console.log(`Saving licenses to ${destinationPath}`);

  // Remove any existing license files
  deleteLicenseFiles(name);

  // Ensure the license directory is present
  makeLicenseDirectory(name);
  console.log("License directory present");

  // Copy the files
  console.log("Copying licenses...");
  copyFiles(fileList, destinationPath);
  console.log("Done!");

  // Delete the temporary files
  console.log("Deleting temporary files...");
  deleteFiles(fileList);
  console.log("Done!");
}

function exists(filepath) {
  return fs.existsSync(filepath);
}

function writeData(data, filename) {
  fs.writeFileSync(filename, data, "utf-8");
}

function readData(filename) {
  let data = fs.readFileSync(filename, "utf-8");
  return data;
}

function deleteLicenseFiles(name) {
  let dirPath = path.join(FilePaths.licenseStore, name);
  console.log(`Deleting licenses from ${dirPath}`);

  if (fs.existsSync(dirPath)) fs.rmdirSync(dirPath, { recursive: true });
}

function resolveFullPath(fileList) {
  for (file of fileList) {
    file.path = path.resolve(__dirname, "..", file.path);
  }
}

function deleteFiles(fileList) {
  for (let file of fileList) {
    deleteFile(file);
  }
}

function copyFiles(fileList, destination) {
  for (let file of fileList) {
    let newPath = getNewFilePath(file, destination);
    copyFile(file.path, newPath);
  }
}

function deleteFile(file) {
  fs.unlinkSync(file.path);
}

function getNewFilePath(file, destinationPath) {
  let newFilePath = path.join(destinationPath, file.originalname);
  return newFilePath;
}

function copyFile(currentPath, destinationPath) {
  fs.copyFileSync(currentPath, destinationPath);
}

function getDestinationPath(name) {
  return path.join(FilePaths.licenseStore, name);
}

function makeLicenseDirectory(name) {
  let destinationPath = getDestinationPath(name);

  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }
}

function createPath(fullPath) {
  fs.mkdirSync(fullPath, { recursive:true });
}

module.exports = { createPath, exists, processLicenses, writeData, readData, deleteLicenseFiles };
