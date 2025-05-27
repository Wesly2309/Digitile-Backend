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

const getMission = async (req, res) => {
  try {
    const existing = await db.userMission.findMany({
      where: { userId: req.user.id },
      include: {
        mission: true,
      },
    });

    if (existing.length === 0) {
      // Jika belum ada userMission, tampilkan semua mission yang ada
      const allMissions = await db.mission.findMany();
      return res.status(200).json({
        success: true,
        message: "List of all missions (no user missions found)",
        data: allMissions,
      });
    }

    return res.status(200).json({
      success: true,
      message: "List of user missions",
      data: existing,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const storeMission = async (req, res) => {
  try {
    const { title, progressNo, progressTarget, rewardPoints } = req.body;

    const newMission = await db.mission.create({
      data: {
        title,
        progressNo,
        progressTarget,
        isCompleted: "NO",
        rewardPoints: rewardPoints, // Default rewardPoints ke 0 jika tidak disediakan
      },
    });

    if (!newMission)
      return res
        .status(400)
        .json({ success: false, message: "Something went wrong" });

    return res
      .status(201)
      .json({ success: true, message: "Mission created", data: newMission });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
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
    const userId = req.user.id;

    const userMission = await db.userMission.findFirst({
      where: { userId, missionId: id },
      include: { mission: true },
    });

    if (!userMission) {
      return res
        .status(404)
        .json({ success: false, message: "UserMission not found" });
    }

    const incrementValue =
      userMission.progressNo < userMission.mission.progressTarget ? 1 : 0;
    const newProgress = userMission.progressNo + incrementValue;
    const isCompleted =
      newProgress >= userMission.mission.progressTarget ? "YES" : "NO";

    const updatedUserMission = await db.userMission.update({
      where: { id: userMission.id },
      data: {
        progressNo: {
          increment: incrementValue,
        },
        isCompleted,
      },
    });

    // Jika misi selesai, berikan reward poin dan cek level
    if (isCompleted === "YES") {
      await givePointsAndCheckLevel(
        userId,
        userMission.mission.rewardPoints || 0
      );
    }

    return res.status(200).json({
      success: true,
      message: "Mission progress updated",
      data: updatedUserMission,
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
  getMission,
  storeMission,
  getMissionDetails,
  complete,
};
