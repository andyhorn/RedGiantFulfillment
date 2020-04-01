const PortManager = require("./PortManager");

async function create(name) {
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
};

module.exports = { create };