const jwt = require('jsonwebtoken')
const db = require('../utils/db')

const getCapsules = async (req,res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if(!token) {
       return res.status(400).json({
        success: false,
        message: 'Please provide a token'
      })
    }
    if(token) {
      const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
      console.log(verifyToken)
      if(verifyToken) {
        const capsules = await db.capsule.findMany({
          include: {
            user: true
          },
          where: {
            userId: verifyToken.id
          }
        })
    
         return res.status(200).json({
          success: true,
          message: `List of Capsule with the user name is ${verifyToken.name}`,
          data: capsules 
        })
      }
    } 
    
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    })
  }
}

const createCapsule = async (req,res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if(!token) {
      return res.status(400).json({
        success: false,
        message: 'Please Provide a token'
      })
    }

    if(token) {
      const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
      const {title , content , open_time , image} = req.body
      const newCapsule = await db.capsule.create({
        data: {
         userId: verifyToken.id ,
         title ,
         content,
         open_time ,
         image 
        },
      })

      return res.status(201).json({
        success: true,
        message: 'Success create capsule',
        data: newCapsule
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message 
    })
  }
}

const detailCapsule = async (req,res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if(!token) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a token'
      })
    }
    if(token) {
      const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
    const id = req.params['id']

      const detailedCapsule = await db.capsule.findFirst({
        where: {
          id: id , 
          userId: verifyToken.id
        },
        include: {
          user: true
        }
      })

      return res.status(200).json({
        success: true,
        message: `Detail of capsule  `,
        data: detailedCapsule
      })
      

    }
    
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    })
  }
}

const updateCapsule = async (req,res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if(!token) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a token'
      })
    }

    if(token) {
        const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
        const id = req.params['id']
        const {title  , content , image , open_time} = req.body
        const updatedCurrentCapsule = await db.capsule.update({
          data: {
            title, 
            content , image, open_time
          },
          where: {
            id: id ,
            userId: verifyToken.id
          }
        }        
        )
        return res.status(200).json({
          sucess: true,
          message:'Success update capsule',
          data: updatedCurrentCapsule
        })
    }

   
  } catch (err) {
    return res.status(500).json({
      success: false, 
      message: 'Internal Server Error',
      error: err.message
    })
  }
}

const deleteCapsule = async (req,res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if(!token) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a token'
      })
    }

    if(token) {
      const verifyToken = jwt.verify(token , process.env.JWT_SECRET)
      const id = req.params['id']
      await db.capsule.delete({
        where: {
          id: id , 
          userId: verifyToken.id
        }
      }).then(() => {
        return res.status(200).json({
          success: true , 
          message: 'Success delete capsule'

        })
      })
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    })
  }
}
module.exports = {
  getCapsules,
  createCapsule,
  detailCapsule,
  updateCapsule,
  deleteCapsule
}