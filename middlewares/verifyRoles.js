const jwt = require('jsonwebtoken')
const verifyToken = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]
    if (!token) res.status(401).json({ 'Message': 'UnAuthorized' })
    else {
      jwt.verify(token, process.env.ACCESS_TOKEN, (error, decoded) => {
        if (error) res.sendStatus(401)
        else {
            if (decoded.role === allowedRoles) next()
            else res.status(401).json({"message":"User is not allowed to access this page"})
        }
      })
    }
  }
}

module.exports = verifyToken
