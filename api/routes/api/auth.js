const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const userService = require('')

router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let data = { email, password };

    res.send(JSON.stringify(data));
})

router.post('/register', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let name = req.body.name;

    let data = { email, password, name };

    res.send(JSON.stringify(data));
})




module.exports = router