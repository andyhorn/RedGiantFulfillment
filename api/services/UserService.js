const Db = require('../database/Db')
const databaseFile = require('../contracts/FilePaths').databaseFile;
const database = new Db(databaseFile);
const bcrypt = require('bcryptjs');
const config = require('../contracts/config');

const SALT_ROUNDS = 8;
const TOKEN_EXPIRATION = 24 * 60 * 60 * 1000;

async function registerAsync(name, email, password) {
    let hash = bcrypt.hashSync(password, SALT_ROUNDS);

    let err = await database.insertAsync(name, email, hash);

    if (err) {
        return null;
    }

    let { err, user } = await database.selectByEmailAsync(email);

    if (err) {
        return null;
    }

    let token = getToken(user);

    return token;
}

async function loginAsync(email, password) {
    let { err, user } = await database.selectByEmailAsync(email);

    if (err || !user) {
        return false;
    }

    let isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
        return false;
    }

    let token = getToken(user);
    return token;
}

function getToken(user) {
    return jwt.sign({ id: user.id }, config.secret, {
        expiresIn: TOKEN_EXPIRATION
    });
}