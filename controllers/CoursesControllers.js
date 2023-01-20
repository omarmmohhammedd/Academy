const pool = require("../config/DBconfig")
const GetAllCourses = async (req, res) => {
    const Courses =  (await pool.query("select * from courses order by course_id")).rows
    res.status(200).json({"courses": Courses})
}
const AddCourse = async (req, res) => { 
    const { course_name, course_time, course_department, price } = req.body
    if (!course_name || !course_time || !course_department || !price) return res.status(400).json({ "message": "All Fields Are Required" })
    else {
        try {
                    await pool.query("insert into courses (course_name, course_time, course_department, price) values ($1,$2,$3,$4)", [course_name, course_time, course_department, price])
        res.sendStatus(200)
        } catch (error) {
            console.error(error)
        }

    }
}
const updateCourse = async (req, res) => {
    const {courseId} = req.params
    const { course_name, course_time, course_department, price } = req.body
    if (!course_name || !course_time || !course_department || !price) return res.status(400).json({ "message": "All Fields Are Required" })
    try {
    await pool.query("update courses set course_name = $1 , course_time = $2 , course_department = $3 ,price =$4 where course_id = $5", [course_name, course_time, course_department, price, courseId]) 
    res.sendStatus(200)
    } catch (error) {
        console.error(error)
    }
}
const deleteCourse = async (req, res) => { 
    const { courseId } = req.params
    try {
        await pool.query("delete from courses where course_id = $1", [courseId])
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
    }
}
    const getCourse = async (req, res) => {
        const { courseId } = req.params
        try {
            const query = (await pool.query("select * from courses where course_id = $1", [courseId])).rows
            res.status(200).json({"course":query})
        }
        catch (error) {
            console.error(error)
        }
}
module.exports={GetAllCourses,AddCourse,updateCourse,deleteCourse,getCourse}