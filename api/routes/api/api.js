const express = require('express')
const router = express.Router()

const dockerRoutes = require('./docker')

router.get('/', (req, res) => {
    res.send("Connected")
})

router.use('/docker', dockerRoutes)

module.exports = router