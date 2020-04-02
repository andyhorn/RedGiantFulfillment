const path = require('path');

const appData = path.join('/', 'usr', 'src', 'rlm');
const licenseStore = path.join(appData, 'licenses');

const containerLicenses = "/usr/share/rlm/licenses";

module.exports.appData = appData;
module.exports.licenseStore = licenseStore;
module.exports.containerLicenseLocation = containerLicenses;
module.exports.databaseFile = 'sqlitedb';