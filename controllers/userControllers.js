const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const pool = require("../config/DBconfig")
const Login = async (req, res) => {
    const { phone, password } = req.body
    if (!phone || !password) res.json({ "message": "All Feilds Are Required" }).status(400) 
    var foundUser;
    try {
        const user = await pool.query("select phone , password from users where phone= $1", [phone]);
        if (user.rows.length) {
            const foundUser = user.rows[0]
            const isMatch = await bcrypt.compare(password, foundUser.password)
            if (isMatch) {
                const token = jwt.sign({ "email": foundUser.email, "roles": foundUser.roles, "username": foundUser.username, "phone": foundUser.phone, "gender": foundUser.gender }, process.env.ACCESS_TOKEN, { expiresIn: "24h" })
                res.json( { "username": foundUser.username, "roles": foundUser.roles,"phone": foundUser.phone ,"token" : token,"email":foundUser.email , "gender": foundUser.gender } ).status(200)
            }
            else {
                res.status(403).json({ "message": "Password Not Match" })
            }
        }
        else {
            res.json({ "message": "User Does Not Exist" }).status(400)
         }
    }
    catch(e){console.log(e)}
}
const Reg = async (req, res) => {
    const {type}=req.params
    const { username, email, phone, password, gender } = req.body
    try {
        if (!username || !email || !phone || !password || !gender) res.json({ "message": "All Feilds Are Required" })
        const duplicatePhone = await pool.query("select * from users where phone =$1",[phone])
         if (duplicatePhone.rows.length) {
            res.status(403).json({ "message": "Phone Already Founded" })
        }
        else {
             const hashedPassword = await bcrypt.hash(password, 10)
             const userRole = type === "student" ? 1000 : type === "teacher" ? 2000 : 3000 
             await pool.query("insert into users (username,password,phone,gender,role,email) values ($1,$2,$3,$4,$5,$6)",[username,hashedPassword,phone,gender,userRole,email])
            res.status(201).json({ "username": username, "email": email, "phone": phone, "gender": gender})
        }
    }
    catch (error) { console.log(error) }
}
const AddInfo = async (req, res) => { 
    const { type } = req.params
    if (type === "student") {
        const { user_id, academic_year, academic_department } = req.body
        if (!user_id || !academic_year || !academic_department) res.status(400).json({ "message": "All Feilds Are Required" })
        const MainInfo = await (await pool.query("select user_id from users where user_id = $1", [user_id])).rows[0]
        try {
            await pool.query("insert into students values ($1,$2,$3,$4,$5)", [MainInfo.user_id, academic_year, academic_department, 0, null])
            res.sendStatus(200)
        } catch (error) {
            console.error(error)
        }
    }
    else if (type === "teacher") { 
        const { user_id, department } = req.body
        if (!user_id || !department) res.status(400).json({ "message": "All Feilds Are Required" });
        const MainInfo = await (await pool.query("select user_id from users where user_id = $1", [user_id])).rows[0]
try {
            await pool.query("insert into teachers (teacher_id,department) values ($1,$2)", [MainInfo.user_id, department])
            res.sendStatus(200)
        } catch (error) {
            console.error(error)
        }
    }
}
module.exports={Login,Reg,AddInfo}