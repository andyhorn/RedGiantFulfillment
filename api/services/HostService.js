const request = require('request');

module.exports = class {
    constructor() {
        this.localhost = process.env.LOCALHOST;
    }

    async getHostPlatformAsync() {
        const url = `${this.localhost}/platform`;
        let result = await this.executeRequestAsync(url);
        return result;
    }

    async openFirewallPortAsync(port) {
        const url = `${this.localhost}/port/${port}/open`;
        let result = await this.executeRequestAsync(url);
        return result;
    }

    async closeFirewallPortAsync(port) {
        const url = `${this.localhost}/port/${port}/close`;
        let result = await this.executeRequestAsync(url);
        return result;
    }

    async executeRequestAsync(url) {
        console.log(`Executing request on URL: ${url}`);
        try {
            let result = await this.sendRequestAsync(url);
            return result;
        } catch (e) {
            console.log("Error: ");
            console.log(e);
            return null;
        }
    }

    sendRequestAsync(url) {
        return new Promise((resolve, reject) => {
            request(url, { json: true }, (err, res, body) => {
                if (err) {
                    return reject(err);
                }

                return resolve(body);
            });
        });
    }
}