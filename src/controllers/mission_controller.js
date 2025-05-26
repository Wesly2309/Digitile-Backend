const db = require("../utils/db");
const dotenv = require("dotenv");
dotenv.config();

// Fungsi untuk memberikan poin dan menaikkan level user
async function givePointsAndCheckLevel(userId, pointsToAdd) {
  try {
    const user = await db.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: pointsToAdd,
        },
      },
    });

    if (user.points >= 100) {
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          level: {
            increment: 1,
          },
          points: 0,
        },
      });
      return updatedUser;
    }

    return user;
  } catch (error) {
    console.error("Gagal memberikan poin atau menaikkan level:", error);
    throw error; // Re-throw error untuk ditangani di route
  }
}


const getAllMission = async (req,res) => {
  try{
    const allmissions = await db.mission.findMany()
    return res.status(200).json({
      success: true,
      message: 'List of all mission',
      data: allmissions
    })
  }catch(err) {
    return res.status(500).json({
      success: false , 
      message: 'Internal Server Error',
      error: err.message
    })
  }
}



const getMission = async (req, res) => {
  try {
    const missions = await db.mission.findMany({
      where: {
        userId: req.user.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "List of Mission",
      data: missions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const storeMission = async (req, res) => {
  try {
    const { title, progressNo, progressTarget, rewardPoints } = req.body;

    const newMission = await db.mission.create({
      data: {
        userId: req.user.id, // Pastikan userId disertakan saat membuat misi
        title,
        progressNo,
        progressTarget,
        isCompleted: "NO",
        rewardPoints: rewardPoints || 0, // Default rewardPoints ke 0 jika tidak disediakan
      },
    });

    if (!newMission)
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong" });

    return res
      .status(201)
      .json({ success: true, message: "Mission created", data: newMission });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const getMissionDetails = async (req, res) => {
  try {
    const id = req.params["id"];

    const missionDetail = await db.mission.findFirst({
      where: {
        id: id,
      },
    });

    if (!missionDetail) {
      return res.status(404).json({
        success: false,
        message: "Mission not found",
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
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const complete = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id; // Ambil userId dari req.user (asumsi middleware autentikasi sudah ada)

    // Ambil misi berdasarkan ID
    const mission = await db.mission.findFirst({
      where: { id },
    });

    if (!mission) {
      return res.status(404).json({
        success: false,
        message: "Mission not found",
      });
    }

    // Update progressNo atau status
    const updatedMission = await db.mission.update({
      where: { id },
      data: {
        progressNo: {
          increment: mission.progressNo < mission.progressTarget ? 1 : 0,
        },
        isCompleted:
          mission.progressNo + 1 >= mission.progressTarget ? "YES" : "NO", // Ubah kondisi penyelesaian
      },
    });

    // Periksa apakah misi sudah selesai
    const isMissionCompleted = mission.progressNo + 1 >= mission.progressTarget;

    if (isMissionCompleted && mission.rewardPoints > 0) {
      try {
        const updatedUser = await givePointsAndCheckLevel(
          userId,
          mission.rewardPoints
        );
        return res.status(200).json({
          success: true,
          message:
            "Mission successfully completed. Points added and level checked.",
          data: { mission: updatedMission, user: updatedUser },
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Internal Server Error while awarding points/level",
          error: error.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Mission progress updated",
      data: updatedMission,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  getAllMission,
  getMission,
  storeMission,
  getMissionDetails,
  complete,
};
