const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const apiRoutes = require('./routes/api/api')
const createError = require('http-errors')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', apiRoutes)

app.use((req, res, next) => {
    next(createError(404))
})

console.log('listening to port ' + process.env.PORT)
app.listen(process.env.PORT || 8000)

module.exports = app