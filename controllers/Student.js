const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../config/DBconfig")
const mailer = require("nodemailer")
const { VsAuthenticator } = require('@vs-org/authenticator')
const { json } = require("express")


const getUserCourses = async (req, res) => {
    const { student_id } = req.params
    const studentCourses = await (await pool.query("select courses from students where student_id =$1", [student_id])).rows[0]
    if (studentCourses.courses) {
        res.status(200).json({ "studentCourses":studentCourses.courses }) 
    }
    else {
        res.status(404).json({ "message":"No Courses Found"}) 
    }
}


const userAddCourse = async (req, res) => { 
    const { student_id, course_id } = req.body
    try {
        const foundUser = (await pool.query("select * from students where student_id =$1", [student_id])).rows[0]
        const foundCourse = (await pool.query("select * from courses where course_id = $1", [course_id])).rows[0]
        const userCourses = foundUser.courses || []
        if (userCourses.length) {
            const checkDuplicateCourse = userCourses.filter(course =>course.course_id === course_id )
            if (checkDuplicateCourse.length) {
                 res.status(403).json({ "message": "Course already exists" })
            }
            else {
                // Add PayMop API Here 
                userCourses.push(foundCourse)
                await pool.query("update students set courses = $1 where student_id = $2", [userCourses, student_id])
                res.sendStatus(201)
            }
        }
        else {
               // Add PayMop API Here 
                userCourses.push(foundCourse)
                await pool.query("update students set courses = $1 where student_id = $2", [userCourses, student_id])
                res.sendStatus(201)
            }
    } catch (error) {
        console.error(error)
    }
}


const userDeleteCourse = async (req, res) =>
{
    const { student_id, course_id } = req.body
    try {
        const foundUser = (await pool.query("select * from students where student_id =$1", [student_id])).rows[0]
        const newUserCourses = foundUser.courses.filter(course =>  course.course_id !== course_id)
        await pool.query("update students set courses = $1 where student_id = $2", [newUserCourses, student_id])
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
    }
}


const Addattendances = async (req, res) => {
    const { student_id, course_id } = req.params
    await pool.query("insert into attendances (student_id, course_id,present) values ($1,$2,$3)", [student_id, course_id, true])
    res.sendStatus(200)
}

module.exports={getUserCourses,userAddCourse,userDeleteCourse,Addattendances}