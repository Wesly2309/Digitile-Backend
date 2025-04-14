const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const tokenMiddleware =  (req,res , next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if(!token) throw new Error('Please provide a token') 
        
    
        const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
        if(!verifyToken) throw new Error('Token is not valid')
        
        req.user = verifyToken

        next()
    } catch (err) {
        res.status(500).json({
            success: false , 
            message: 'Internal Server Error', 
            error: err.message
        })
    }
}

module.exports = tokenMiddleware