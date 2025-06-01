const db = require("../utils/db");
const dotenv = require("dotenv");
dotenv.config();

// Fungsi untuk memberikan poin dan menaikkan level user
async function givePointsAndCheckLevel(userId, pointsToAdd) {
  try {
    let user = await db.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User tidak ditemukan");

    let newPoints = user.points + pointsToAdd;
    let level = user.level;

    // Hitung poin maksimum yang dibutuhkan untuk level saat ini
    let maxPoints = 100 + (level - 1) * 20;

    // Naik level selama poin cukup
    while (newPoints >= maxPoints) {
      newPoints -= maxPoints;
      level++;
      maxPoints = 100 + (level - 1) * 20;
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        level,
        points: newPoints,
      },
    });

    return updatedUser;
  } catch (error) {
    console.log("Gagal memberikan poin atau menaikkan level:", error);
    throw error;
  }
}

const fetchAllMissions = async () => {
  return await db.mission.findMany();
};

const getAllMission = async (req, res) => {
  try {
    const allmission = await fetchAllMissions();
    return res.status(200).json({
      success: true,
      message: "List of all mission",
      data: allmission,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const getMission = async (req, res) => {
  try {
    const existing = await db.userMission.findMany({
      where: { userId: req.user.id },
      include: {
        mission: true,
      },
    });

    if (existing.length === 0) {
      const allMissions = await fetchAllMissions();
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
    const {
      title,
      progressNo,
      progressTarget,
      rewardPoints,
      missionType,
      url,
    } = req.body;

    // 1. Buat mission baru
    const newMission = await db.mission.create({
      data: {
        title,
        progressNo,
        progressTarget,
        missionType,
        url,
        rewardPoints: rewardPoints || 0, // default ke 0
      },
    });

    if (!newMission) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }

    // 2. Ambil semua user
    const users = await db.user.findMany();

    // 3. Assign mission ini ke semua user
    await Promise.all(
      users.map((user) =>
        db.userMission.create({
          data: {
            userId: user.id,
            missionId: newMission.id,
            progressNo: 0,
            isCompleted: false,
          },
        })
      )
    );

    // 4. Return sukses
    return res.status(201).json({
      success: true,
      message: "Mission created and assigned to all users",
      data: newMission,
    });
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
    const id = req.params["id"];
    const userId = req.user.id;

    const userMission = await db.userMission.findFirst({
      where: { userId, missionId: String(id) },
      include: { mission: true },
    });

    // ✅ Cek jika userMission tidak ditemukan
    if (!userMission) {
      return res.status(404).json({
        success: false,
        message: "UserMission not found for this user and mission",
      });
    }

    const incrementValue =
      userMission.progressNo < userMission.mission.progressTarget ? 1 : 0;
    const newProgress = userMission.progressNo + incrementValue;
    const isCompleted =
      newProgress >= userMission.mission.progressTarget ? true : false;

    const updatedUserMission = await db.userMission.update({
      where: { id: userMission.id },
      data: {
        progressNo: {
          increment: incrementValue,
        },
        isCompleted,
      },
    });

    if (isCompleted === true) {
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

const assignAllMissionsToUser = async (userId) => {
  try {
    const allMissions = await db.mission.findMany();

    for (const mission of allMissions) {
      const existing = await db.userMission.findFirst({
        where: {
          userId,
          missionId: mission.id,
        },
      });

      if (!existing) {
        await db.userMission.create({
          data: {
            userId,
            missionId: mission.id,
            progressNo: 0,
            isCompleted: false,
          },
        });
      }
    }

    return { success: true, message: "All missions assigned to user" };
  } catch (error) {
    console.log("Failed to assign missions:", error);
    throw error;
  }
};

module.exports = {
  getMission,
  getAllMission,
  storeMission,
  getMissionDetails,
  complete,
  assignAllMissionsToUser,
};
