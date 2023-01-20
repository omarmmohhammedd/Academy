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
// static file for img
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use("/userAuth", require("./routes/userAuth"))
app.use("/courses",require("./routes/courses"))
app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`)
})
