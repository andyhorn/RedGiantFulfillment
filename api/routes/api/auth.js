const express = require("express");
const router = express.Router();
const userService = require("../../services/UserService");

router.post("/login", async (req, res) => {
  console.log("Login request received");
  let email = req.body.email;
  let password = req.body.password;

  console.log("Beginning login...")
  let result = await userService.loginAsync(email, password);

  if (result.err) {
    console.log("Login failed");
    return res.status(result.status).send(result.err);
  }

  console.log("Login success!");
  return sendSuccess(res, result.token, result.user);
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;

  console.log("New user registering:");
  console.log(email);
  console.log(password);
  console.log(name);

  let result = await userService.registerAsync(name, email, password);

  console.log("Result:");
  console.log(result);

  if (result.err) {
    return res.status(result.status).send(result.err);
  }

  return sendSuccess(res, result.token, result.user);
});

function sendSuccess(res, token, user) {
  return res.status(200).send({ auth: true, token: token, user: user });
}

module.exports = router;
