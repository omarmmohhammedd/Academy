const pool = require("../config/DBconfig")
const { VsAuthenticator } = require('@vs-org/authenticator')
const e = require("express")



const AddParentToStudent = async (req, res) => {
    const { OTP, student_email } = req.body
    const { parent_id } = req.params
    const ValidateOTP = VsAuthenticator.verifyTOTP(OTP, 'JF5DOKTGFY4SKQ2QIBDTUOCPENEGUSLSKZBVC32VIQQT6SDVFJDQ', 120)
    if (!ValidateOTP) return res.status(403).json({ "message": "Invalid OTP" })
    else {
        try {
            const studentData = await (await pool.query("select * from students where email = $1",[student_email])).rows[0]
            if (studentData) {
            await pool.query("update students set parent_id = $1 where email = $2", [parent_id, student_email])
            res.sendStatus(200)
            }
            else {
                res.status(403).json({"message":"Student Not Found"})
            }
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
}


const getStudentDataForParent = async (req, res) => {
    const { parent_id } = req.params
    const Student = await (await pool.query("select * from students where parent_id =$1", [parent_id])).rows[0]
    const studentAttenances = await
        (await pool.query(`select courses.course_name , students.username , attendances.present ,to_char(attendances.date,'dd/mm/yyyy') as Date , to_char(attendances.time,'HH:MI') as Time from attendances
         join students on students.student_id = attendances.student_id
         join courses on courses.course_id = attendances.course_id
          where attendances.student_id = $1 order by attendances.time desc `, [Student.student_id])).rows

    const studentData = {
        course: Student.courses,
        attendance : studentAttenances
    }
    res.status(200).json({ "studentData":studentData })
}
module.exports={AddParentToStudent,getStudentDataForParent}