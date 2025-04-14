const db = require('../utils/db')
const cloudinary = require('../utils/cloudinary')
const dotenv = require('dotenv')
const fs = require('fs')
dotenv.config()




const getCapsules = async (req,res) => {
  try {
    
        const capsules = await db.capsule.findMany({
          include: {
            user: {
              select: {
                name: true 
              }
            }
          },
          where: {
            userId: req.user.id
          }
        })
    
         return res.status(200).json({
          success: true,
          message: `List of Capsule with the user name is ${req.user.name}`,
          data: capsules 
        })
    
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
    console.log(req.file)
      const result = await cloudinary.uploader.upload(req.file.path , {
        folder: 'uploads'
      })
      const {title , content , open_time} = req.body
      fs.unlinkSync(req.file.path);
      const newCapsule = await db.capsule.create({
        data: {
         userId: req.user.id ,
         title ,
         content,
         open_time ,
         image: result.secure_url 
        },
      })

      return res.status(201).json({
        success: true,
        message: 'Success create capsule',
        data: newCapsule
      })
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
    
    const id = req.params['id']

      const detailedCapsule = await db.capsule.findFirst({
        where: {
          id: id , 
          userId: req.user.id
        },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      })

      return res.status(200).json({
        success: true,
        message: `Detail of capsule  `,
        data: detailedCapsule
      })
      

    
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
    
        const id = req.params['id']
        const {title  , content , image , open_time} = req.body
        const updatedCurrentCapsule = await db.capsule.update({
          data: {
            title, 
            content , image, open_time
          },
          where: {
            id: id ,
            userId: req.user.id
          }
        }        
        )
        return res.status(200).json({
          sucess: true,
          message:'Success update capsule',
          data: updatedCurrentCapsule
        })

   
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
    
      const id = req.params['id']
      await db.capsule.delete({
        where: {
          id: id , 
          userId: req.user.id
        }
      }).then(() => {
        return res.status(200).json({
          success: true , 
          message: 'Success delete capsule'

        })
      })
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