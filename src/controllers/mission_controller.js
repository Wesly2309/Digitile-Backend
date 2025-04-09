const jwt = require('jsonwebtoken');
const db = require('../utils/db');
const dotenv = require('dotenv')
dotenv.config()


const getMission = async (req,res) => {
  try {
   

    const missions = await db.mission.findMany({
      
    })

    return res.status(200).json({
      success: true , 
      message: 'List of Mission' , 
      data: missions 
    })
  } catch (error) {
    return res.status(500).json({
      success: false , 
      message: 'Internal Server Error',
      error
    })    
  }
}


const storeMission = async (req,res) => {
  try {
    const {title , progressNo  , progressTarget} = req.body 
    if(!title || !progressNo ) return res.status(400).json({
      success: false, 
      message: 'All fields are required'
    }) 
    const newMission = await db.mission.create({
      data: {
        title , progressNo  , progressTarget,  isCompleted: 'NO'
      }
    })


    if(!newMission) return res.status(400).json({success: false , message: 'Something went wrong'})

    return res.status(201).json({success: true , message: 'Mission created' , data: newMission})
  } catch (error) {
    return res.status(500).json({
      success : false ,
      message: 'Internal Server Error', 
      error
    })
  }
}


module.exports = {
  getMission , 
  storeMission
};
