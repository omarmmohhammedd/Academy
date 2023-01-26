const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')

// env Info config
require('dotenv').config()
const PORT = process.env.PORT || 8000
// enable cors
app.use(cors())
// express URL encodded
app.use(express.urlencoded({ extended: false }))
// built-in middleware for json
app.use(express.json())
// middlewares
const verifyToken = require('./middlewares/verifyToken')
const verifyRoles = require('./middlewares/verifyRoles')
const allowedRoles = require('./config/allowedRoles')
// static file for img
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/user', require('./routes/Main.js'))
app.use('/student', verifyToken, require('./routes/Student.js'))
app.use('/admin', verifyRoles(allowedRoles.admin), require('./routes/Admin'))
app.use('/parent', require('./routes/Parent.js'))
// app.use("/teacher", require("./routes/Teacher.js"))

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`)
})
