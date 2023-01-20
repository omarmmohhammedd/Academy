const route = require('express').Router()
const {Login, Reg, AddInfo} = require('../controllers/userControllers')
route.post('/reg/:type', Reg)
route.post('/login', Login)
route.post('/addInfo/:type', AddInfo)
module.exports = route
