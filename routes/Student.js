const route = require('express').Router()

const {getUserCourses,userAddCourse,userDeleteCourse,Addattendances}  = require("../controllers/Student")

route.get('/:student_id', getUserCourses)
route.post('/addCourse', userAddCourse)
route.delete('/deleteCourse', userDeleteCourse)
route.post('/attendance/:student_id/:course_id', Addattendances)

module.exports = route
