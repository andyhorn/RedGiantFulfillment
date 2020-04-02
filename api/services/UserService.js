const Db = require("../database/Db");
// const databaseFile = require("../contracts/FilePaths").databaseFile;
// const database = new Db(databaseFile);
const bcrypt = require("bcryptjs");
const config = require("../contracts/config");

const SALT_ROUNDS = 8;
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000;

async function registerAsync(name, email, password) {
    let result = {
        err: null,
        user: null,
        token: null,
        status: 0
    };

  let hash = bcrypt.hashSync(password, SALT_ROUNDS);

  let insertErr = await database.insertAsync(name, email, hash);

  if (insertErr) {
    result.err = insertErr;
    result.status = 500;
    return result;
  }

  let { err, user } = await database.selectByEmailAsync(email);

  if (err) {
    result.err = err;
    result.status = 500;
    return result;
  }

  if (!user) {
      result.err = "User not found";
      result.status = 404;
      return result;
  }

  let token = getToken(user);

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

  let { err, user } = await database.selectByEmailAsync(email);

  if (err) {
    result.err = err;
    result.status = 500;
    return result;
  }

  if (!user) {
    result.err = "User not found";
    result.status = 404;
    return result;
  }

  result.user = user;

  let isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    result.err = "Invalid password";
    result.status = 401;
    return result;
  }

  let token = getToken(user);
  result.status = 200;
  result.token = token;

  return token;
}

function getToken(user) {
  return jwt.sign({ id: user.id }, config.secret, {
    expiresIn: TOKEN_EXPIRATION
  });
}

module.exports = {
  registerAsync,
  loginAsync
};
