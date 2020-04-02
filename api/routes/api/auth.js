const express = require("express");
const router = express.Router();
const userService = require("../../services/UserService");

router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let result = await userService.loginAsync(email, password);

  if (result.err) {
    res.status(result.status).send(result.err);
  }

  sendSuccess(res, result.token, result.user);
});

router.post("/register", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;

  let result = await userService.registerAsync(name, email, password);

  if (result.err) {
    res.status(result.status).send(result.err);
  }

  sendSuccess(res, result.token, result.user);
});

function sendSuccess(res, token, user) {
  res.status(200).send({ auth: true, token: token, user: user });
}

module.exports = router;
