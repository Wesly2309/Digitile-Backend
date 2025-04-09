const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const getUserByToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded) {
      console.log(decoded)
      const user = await db.user.findUnique({
      where: { id: decoded.id },
      
      }
      
      );
      if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
    }



    
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


    console.log(user)
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

const updateProfile = async (req,res ) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded) {
        const {name , username , phone , gender , email} = req.body
      const user = await db.user.update({
        data: {
          username , name , phone  , email , gender
        },
      where: { id: decoded.id },
      
      }
      
      );
      if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({success: true , message: 'Update profil success' , data: user});
    }
  } catch (error) {
    return res.status(500).json({
      success: false ,
      message: 'Internal Server Error' , 
      error
    })
  }
}

module.exports = {
  getUserByToken,
  getUserById,
  updateProfile
};
