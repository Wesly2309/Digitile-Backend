const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const db = require("../utils/db");
const jwt = require("jsonwebtoken");
const { assignAllMissionsToUser } = require("./mission_controller");
dotenv.config();

const register = async (req, res) => {
  try {
    const { name, username, email, password, phone } = req.body;

    if (!name | !username | !email | !password | !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    } else {
      const existingUser = await db.user.findFirst({
        where: {
          email: email,
        },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const newUser = await db.user.create({
        data: {
          name,
          username,
          phone,
          email,
          password: hashedPassword,
        },
      });

      await assignAllMissionsToUser(newUser.id);

      return res.status(201).json({
        success: true,
        mesage: "User registered!",
        data: {
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
        },
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign(user, process.env.JWT_SECRET);

        return res.status(200).json({
          success: true,
          message: "Login Success",
          token: token,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: "Please provide a token",
      });
    }

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.JWT_SECRET);

    if (verify) {
      return res.status(200).json({
        success: true,
        message: "Logout Success",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
};
