const Db = require("../database/Db");
const bcrypt = require("bcryptjs");
const config = require("../contracts/config");
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 8;
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000;

async function registerAsync(name, email, password) {
  let result = {
    err: null,
    user: null,
    token: null,
    status: 0
  };

  console.log("Inserting user...");
  let inserted = await insertUser({ name, email, password });

  if (!inserted) {
    console.log("Error inserting user");
    result.err = "Unable to register new user";
    result.status = 500;
    return result;
  }

  console.log("Retrieving user data...");
  let user = await getByEmail(email);

  if (!user) {
    console.log("User not found");
    result.err = "User not found";
    result.status = 404;
    return result;
  }

  console.log("Getting token for user...");
  let token = getToken(user);
  console.log(token);

  result.status = 200;
  result.user = user;
  result.token = token;

  return result;
}

async function loginAsync(email, password) {
  let result = {
    err: null,
    user: null,
    status: 0,
    token: null
  };

  console.log("Searching for user by email...");
  let user = await getByEmail(email);
  if (!user) {
    console.log("User not found");
    result.err = "User not found";
    result.status = 404;
    return result;
  }
  result.user = user;
  console.log("User was found!");


  console.log("Verifying submitted password");
  let isValid = bcrypt.compareSync(password, result.user.password);
  if (!isValid) {
    console.log("Invalid password");
    result.err = "Invalid password";
    result.status = 401;
    return result;
  }
  console.log("Valid password!");

  console.log("Generating authentication token");
  let token = getToken(user);
  result.status = 200;
  result.token = token;

  return result;
}

function getToken(user) {
  return jwt.sign({ id: user.id }, config.secret, {
    expiresIn: TOKEN_EXPIRATION
  });
}

async function getByEmail(email) {
  let db = new Db();
  try {
    let user = await db.selectByEmailAsync(email);
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function insertUser(user) {
  let db = new Db();
  let hash = bcrypt.hashSync(user.password, SALT_ROUNDS);
  let added;
  try {
    added = await db.insertAsync(user.name, user.email, hash);
  } catch (e) {
    console.log("Error inserting user - error caught")
    return false;
  }

  return added;
}

module.exports = {
  registerAsync,
  loginAsync
};
