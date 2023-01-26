const route = require('express').Router()
const { AddParentToStudent, getStudentDataForParent } = require("../controllers/Parent")

route.get('/:parent_id', getStudentDataForParent)
route.post('/AddParent/:parent_id', AddParentToStudent)

module.exports = route
