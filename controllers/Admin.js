const pool = require("../config/DBconfig")

const addCourse = async (req, res) => { 
    const { course_name, course_time, course_department, course_price } = req.body
    if (!course_name || !course_time || !course_department || !course_price) return res.status(400).json({ "message": "All Fields Are Required" })
    else {
        try {
                    await pool.query("insert into courses (course_name, course_time, course_department, course_price) values ($1,$2,$3,$4)", [course_name, course_time, course_department, course_price])
        res.sendStatus(200)
        } catch (error) {
            console.error(error)
        }

    }
}


const updateCourse = async (req, res) => {
    const { course_id } = req.params

    const { course_name, course_time, course_department,course_price } = req.body
    if (!course_name || !course_time || !course_department || !course_price) return res.status(400).json({ "message": "All Fields Are Required" })
    try {
    await pool.query("update courses set course_name = $1 , course_time = $2 , course_department = $3 ,course_price =$4 where course_id = $5", [course_name, course_time, course_department, course_price, course_id]) 
    res.sendStatus(200)
    } catch (error) {
        console.error(error)
    }
}


const deleteCourse = async (req, res) => { 
    const { course_id } = req.params
    try {
        await pool.query("delete from courses where course_id = $1", [course_id])
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
    }
}

const getCourseAttendances = async (req, res) => {
    const { course_id } = req.params
    const studentsCourseAttendances = (await pool.query("select student_id from attendances where course_id = $1", [course_id]))
        .rows.map(student => Number(student.student_id))

    const allStudentsinThisCourse = await (await pool.query("select student_id , courses from students")).rows.map(student => {
        const result = student.courses && student.courses.map((course) => {
            if (course.course_id === course_id) {
                return Number(student.student_id)
            }
        })
        return result
    }).flat().filter(id => parseInt(id))
    const studentDidnotAttenances = allStudentsinThisCourse.filter(id => !studentsCourseAttendances.includes(id))
    res.status(200).json({ "Attendances": studentsCourseAttendances, "DidnotAttenances": studentDidnotAttenances })
}

module.exports={addCourse,updateCourse,deleteCourse,getCourseAttendances}