const route = require('express').Router()

const { addCourse, updateCourse, deleteCourse, getCourseAttendances } = require('../controllers/Admin')

const multer = require('multer')
const fs = require('fs')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('files')) {
      fs.mkdirSync('files')
    }
    cb(null, 'files')
  },
  filename: (req, file, cb) => cb(null, file.originalname)
})
const fileFilter = (req, file, cb) => {
  // accept pdf and image files
  if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter })

route.post('/addCourse', upload.single('courseimg'), addCourse)
route.put('/updateCourse/:course_id', updateCourse)
route.delete('/deleteCourse/:course_id', deleteCourse)
route.get('/attendance/:course_id', getCourseAttendances)

module.exports = route
