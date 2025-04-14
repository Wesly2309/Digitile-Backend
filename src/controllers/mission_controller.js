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

const getMissionDetails = async (req, res) => {
  try {
     

      const id = req.params['id'];

      const missionDetail = await db.mission.findFirst({
          where: {
              id: id,
          },
      });

      if (!missionDetail) {
          return res.status(404).json({
              success: false,
              message: 'Mission not found',
          });
      }

      return res.status(200).json({
          success: true,
          message: `Mission detail id: ${id}`,
          data: missionDetail,
      });

  } catch (err) {
      res.status(500).json({
          success: false,
          message: 'Internal Server Error',
          error: err.message,
      });
  }
};

const complete = async (req, res) => {
  try {
    const id = req.params.id;

    // Ambil misi berdasarkan ID
    const mission = await db.mission.findFirst({
      where: { id }
    });

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: 'Mission not found',
      });
    }

    // Update progressNo atau status
    const updatedMission = await db.mission.update({
      where: { id },
      data: {
        progressNo: {
          increment: mission.progressNo < mission.progressTarget ? 1 : 0
        },
        isCompleted: mission.progressNo == mission.progressTarget ? 'YES' : 'NO'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Mission successfully completed',
      data: updatedMission
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    });
  }
};


module.exports = {
  getMission , 
  storeMission,
  getMissionDetails,
  complete
};