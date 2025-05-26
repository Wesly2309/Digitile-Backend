const db = require("../utils/db");
const dotenv = require("dotenv");
dotenv.config();

const leaderBoard = async (req, res) => {
  try {
    const leaderboards = await db.user.findMany({
      select: {
        profile: true,
        username: true,
        level: true,
        points: true,
      },
      orderBy: [{ level: "desc" }],
      take: 50,
    });
    return res.status(200).json({
      success: true,
      message: "List of leaderboards ",
      data: leaderboards,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  leaderBoard,
};
