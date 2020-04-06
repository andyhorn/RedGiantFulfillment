const os = require('os');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.configure();

const FirewallService = require('./FirewallService');

app.get("/", (req, res) => {
    console.log("Request received");
    res.send(os.platform());
});

app.get("/platform", (req, res) => {
    res.send(os.platform());
});

app.get("/port/:port/open", async (req, res) => {
    let port = req.params.port;
    console.log(port);
    const firewall = new FirewallService();
    let opened = await firewall.openPortAsync(port);
    res.send(`Port opened: ${opened}`);
});

app.get("/port/:port/close", async (req, res) => {
    let port = req.params.port;
    console.log(port);
    const firewall = new FirewallService();
    let closed = await firewall.closePortAsync(port);
    res.send(`Port closed: ${closed}`);
});

let port = process.env.PORT;
app.listen(port, () => {
    console.log(`listening...`);
});