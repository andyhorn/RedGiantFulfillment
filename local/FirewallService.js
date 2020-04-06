const os = require('os');
const { exec } = require('child_process');
// const sudo = require('sudo-prompt');

module.exports = class FirewallService {
    constructor () {
        this.init();
    }

    init() {
        let firewall = null;
        let platform = os.platform();
        switch(platform) {
            case 'win32': {
                firewall = new WindowsFirewall();
                console.log("Set Windows firewall");
                break;
            }
            // case 'darwin': {
            //     firewall = new MacFirewall();
            // }
            case 'linux': {
                firewall = new LinuxFirewall();
                console.log("Set Linux firewall");
                break;
            }
        }

        this.firewall = firewall;
    }

    async openPortAsync(port) {
        try {
            let opened = await this.firewall.openPort(port);
            return opened;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async closePortAsync(port) {
        try {
            let closed = await this.firewall.closePort(port);
            return closed;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

class Firewall {
    async executeCommand(command) {
        console.log(`Executing command: ${command}`);
        return new Promise((resolve, reject) => {
            exec(command, (err, stdout, stderr) => {
            // sudo.exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    console.log(stderr);
                    return reject(err);
                }
                console.log(stdout);
                resolve(true);
            });
        });
    }
}

class WindowsFirewall extends Firewall {
    async openPort(port) {
        let command = `netsh advfirewall firewall add rule protocol=tcp name="Open Docker Port" dir=in localport=${port} action=allow`;
        return await this.executeCommand(command);
    }

    async closePort(port) {
        let command = `netsh advfirewall firewall delete rule name=all protocol=tcp localport=${port}`;
        return await this.executeCommand(command);
    }
}

class LinuxFirewall extends Firewall {
    async openPort(port) {
        let command = `ufw allow ${port}/tcp`;
        return await this.executeCommand(command);
    }

    async closePort(port) {
        let command = `ufw delete allow ${port}/tcp`;
        return await this.executeCommand(command);
    }
}