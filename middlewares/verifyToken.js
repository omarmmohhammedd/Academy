const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token) res.status(401).json({ "Message": "UnAuthorized" });
    else {
        jwt.verify(token.split(" ")[1], process.env.ACCESS_TOKEN, (error,decoded) => {
            if (error) res.sendStatus(401)
            else {
                next()
            }
        })
    }
}
module.exports = verifyToken