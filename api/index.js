const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const apiRoutes = require("./routes/api/api");
const createError = require("http-errors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", apiRoutes);

app.use((req, res, next) => {
  next(createError(404));
});

console.log("listening to port " + process.env.PORT);
app.listen(process.env.PORT || 8000);

// const HostService = require('./services/HostService');
// const host = new HostService();

// async function testHost() {
//   let platform = await host.getHostPlatformAsync();
//   let open = await host.openFirewallPortAsync(5005);
//   let close = await host.closeFirewallPortAsync(5005);

//   console.log(platform);
//   console.log(open);
//   console.log(close);
// }

// testHost();

module.exports = app;
