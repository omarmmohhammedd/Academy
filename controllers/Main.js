const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../config/DBconfig")
const mailer = require("nodemailer")
const { VsAuthenticator } = require('@vs-org/authenticator')
const { json } = require("express")



const Login = async (req, res) => {
    const { phone, password } = req.body
    const {type} = req.params
    if (!phone || !password) res.json({ "message": "All Feilds Are Required" }).status(400) 
    try {
        if (type === "student") {
           var user = await pool.query("select * from students where phone= $1", [phone]);
        }
        else if (type === "teacher") {
           var user = await pool.query("select * from teachers where phone= $1", [phone]);
        }
        else if (type === "parent") { 
          var  user = await pool.query("select * from parents where phone= $1", [phone]);
        }
        else if (type === "admin") {
            var user = await pool.query("select * from Admin where phone= $1", [phone]);
        }
        if (user.rows.length) {
            const foundUser = user.rows[0]
            const isMatch = await bcrypt.compare(password, foundUser.password)
            if (isMatch) {
                const token = jwt.sign({ "email": foundUser.email, "role": foundUser.role, "username": foundUser.username, "phone": foundUser.phone, "gender": foundUser.gender }, process.env.ACCESS_TOKEN, { expiresIn: "24h" })
                res.json( { "user_id":foundUser.user_id,"username": foundUser.username, "role": foundUser.role,"phone": foundUser.phone ,"token" : token,"email":foundUser.email , "gender": foundUser.gender } ).status(200)
            }
            else res.status(403).json({ "message": "Password Not Match" })
        }
        else res.json({ "message": "User Does Not Exist" }).status(400)
    }
    catch(e){console.log(e)}
}


const Reg = async (req, res) => {
    const {type}=req.params
    const { username, email, phone, password, gender } = req.body
    try {
        if (!username || !email || !phone || !password ) res.json({ "message": "All Feilds Are Required" })
        if (type === "student") {
            var founduser = await pool.query("select * from students where phone= $1 or email = $2", [phone,email]);
            if (founduser.rows.length) {
            res.status(403).json({ "message": "Email Or Phone Already Founded" })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                const userRole = 1000
                await pool.query("insert into students (username,password,phone,gender,role,email) values ($1,$2,$3,$4,$5,$6)", [username, hashedPassword, phone, gender, userRole, email])
                res.status(201).json({ "username": username, "email": email, "phone": phone, "gender": gender})
            }
        }
        else if (type === "teacher") {
            var founduser = await pool.query("select * from teachers where phone= $1 or email = $2", [phone,email]);
            if (founduser.rows.length) {
            res.status(403).json({ "message": "Email Or Phone Already Founded" })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                const userRole = 2000
                await pool.query("insert into teachers (username,password,phone,gender,role,email) values ($1,$2,$3,$4,$5,$6)", [username, hashedPassword, phone, gender, userRole, email])
                res.status(201).json({ "username": username, "email": email, "phone": phone, "gender": gender})

            }
        }
        else if (type === "parent") { 
            var founduser = await pool.query("select * from parents where phone= $1 or email = $2", [phone,email]);
            if (founduser.rows.length) {
            res.status(403).json({ "message": "Email Or Phone Already Founded" })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                const userRole = 3000
                await pool.query("insert into parents (username,password,phone,gender,role,email) values ($1,$2,$3,$4,$5,$6)", [username, hashedPassword, phone, gender, userRole, email])
                res.status(201).json({ "username": username, "email": email, "phone": phone, "gender": gender})
            }
        }
        else if (type === "admin") {
             var founduser = await pool.query("select * from Admin where phone= $1 or email = $2", [phone,email]);
            if (founduser.rows.length) {
            res.status(403).json({ "message": "Email Or Phone Already Founded" })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                await pool.query("insert into Admin (username,password,phone,email) values ($1,$2,$3,$4)", [username, hashedPassword, phone, email])
                res.status(201).json({ "username": username, "email": email, "phone": phone})
            }
        }
    }
    catch (error) { console.error(error) }
}


const AddInfo = async (req, res) => { 
    const { type } = req.params
    if (type === "student") {
        const { student_id, academic_year, academic_department } = req.body
        if (!student_id || !academic_year || !academic_department) res.status(400).json({ "message": "All Feilds Are Required" })
        try {
            await pool.query("update students set academic_year = $1 , academic_department = $2 where student_id = $3", [ academic_year, academic_department,student_id])
            res.sendStatus(200)
        } catch (error) {
            console.error(error)
        }
    }
    else if (type === "teacher") { 
        const { teacher_id, department } = req.body
        if (!teacher_id || !department) res.status(400).json({ "message": "All Feilds Are Required" });
        try {
            await pool.query("update teachers set department = $1 where teacher_id = $2", [ department,teacher_id])
            res.sendStatus(200)
        } catch (error) {
            console.error(error)
        }
    }
    else if (type === "parent") { 
        const {student_email} = req.body
        if (!student_email) res.status(400).json({ "message": "All Feilds Are Required" });
        try {
            const studnet = (await pool.query("select * from students where email = $1", [student_email])).rows[0]
            if (studnet) {
                const secret = VsAuthenticator.generateTOTP('JF5DOKTGFY4SKQ2QIBDTUOCPENEGUSLSKZBVC32VIQQT6SDVFJDQ')
                console.log(secret)
                const transporter = mailer.createTransport( {
                service: 'gmail',
                auth: {
                    user: 'omarnaguibbb@gmail.com',
                    pass: 'wokamnkirgxrfzrv'
                }
            } );
            const mailOptions = {
                from: 'omarnaguibbb@gmail.com',
                to: `${student_email}`,
                subject: 'Sending OTP For Access Parent On Student Account',
                text: `Your OTP Password is ${secret}  Valid For 60 min`
        };
        transporter.sendMail( mailOptions, function ( error, info )
        {
            if (error)
            {
                console.log( error );
                res.sendStatus( 403 )
            }
            else
            {
                console.log("Email sent: " + info.response);
                res.sendStatus(200)
            }
        } );
            }
            else res.status(403).json({"message":"Student Email Not Found"})
        } catch (error) {
            console.error(error)
        }
    }
}


const GetAllCourses = async (req, res) => {
    const Courses =  (await pool.query("select * from courses order by course_id")).rows
    res.status(200).json({"courses": Courses})
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
module.exports={GetAllCourses,Login,Reg,AddInfo,getCourse}