const route = require('express').Router()
const { GetAllCourses, AddCourse, updateCourse, deleteCourse, getCourse } = require('../controllers/CoursesControllers')
route.get('/', GetAllCourses)
route.get('/:courseId', getCourse)
route.post('/', AddCourse)
route.put('/:courseId', updateCourse)
route.delete('/:courseId', deleteCourse)
module.exports = route
