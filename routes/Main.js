const route = require('express').Router()
const verifyToken = require('../middlewares/verifyToken')
const verifyRoles = require('../middlewares/verifyRoles')
const allowedRoles = require('../config/allowedRoles')
const { GetAllCourses, getCourse, Login, Reg, AddInfo } = require('../controllers/Main')

route.post('/reg/:type', Reg)
route.post('/login/:type', Login)
route.post('/addInfo/:type', AddInfo)
route.get('/courses', verifyToken, GetAllCourses)
route.get('/courses/:courseId', verifyToken, getCourse)

module.exports = route
