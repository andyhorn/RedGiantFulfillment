const jwt = require('jsonwebtoken');
const config = require('../contracts/config');

function isAuthenticated(req, res, next) {
    // console.log(req);
    if (!req.headers.authorization) {
        return res.sendStatus(401);
    }

    let token = req.headers.authorization;

    try {
        let authenticated = jwt.verify(token, config.secret);
        if (authenticated) {
            return next();
        }
    }
    catch (e) {
        return res.sendStatus(401);
    }
}

module.exports = { isAuthenticated };