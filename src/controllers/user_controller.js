const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const fs = require('fs')
const cloudinary = require('../utils/cloudinary')

const getAllUsers = async (req,res) => {

  try{
  const users = await db.user.findMany()
  return res.status(200).json({success: true , message: 'List of Users' , data: users })
    
  }catch(err){
    return res.status(500).json({success: false , message: 'Internal Server Error' , error: err.message})
  }

}

const getUserByToken = async (req, res) => {
  try {
    
      const user = await db.user.findUnique({
      where: { id: req.user.id },
      
      }
      
      );
      if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

     return res.status(200).json({
      success: true , 
      message: 'Detail User By Token',
      data: user
    })



    
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const getUserById = async (req,res) => {
  try {
    const id = req.params['id'] 
    const user = await db.user.findFirst({
      where: {
        id: id      }
    })


    return res.status(200).json({
      success: true , 
      message: 'Detail User By Id',
      data: user
    })
  } catch (err) {
    return res.status(500).json({
      success: false, 
       message: 'Internal Server Error',
       error: err.message

      })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, username, phone, gender, email } = req.body;

    let profileUrl;

    // ✅ Upload hanya jika file dikirim
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'uploads',
      });
      profileUrl = result.secure_url;
    }

    // ✅ Siapkan data update
    const updateData = {
      username,
      name,
      phone,
      email,
      gender,
    };

    // ✅ Tambahkan field profile hanya jika ada
    if (profileUrl) {
      updateData.profile = profileUrl;
    }

    const user = await db.user.update({
      data: updateData,
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Update profile success',
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};



module.exports = {
  getUserByToken,
  getUserById,
  updateProfile,
  getAllUsers,
};
